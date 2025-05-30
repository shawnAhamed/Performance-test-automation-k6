# Use the official k6 image as the base
FROM grafana/k6:latest

# Switch to root user to install dependencies
USER root

# Install required tools and dependencies
RUN apk add --no-cache git build-base wget

# Install the latest version of Go manually
ENV GO_VERSION=1.23.1
RUN wget https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go${GO_VERSION}.linux-amd64.tar.gz && \
    rm go${GO_VERSION}.linux-amd64.tar.gz

# Add Go to PATH
ENV PATH="/usr/local/go/bin:${PATH}"

# Set GOPATH to ensure Go binaries are installed in the correct location
ENV GOPATH="/go"
ENV PATH="${GOPATH}/bin:${PATH}"

# Install xk6 and build k6 with the xk6-influxdb plugin
RUN go install -v go.k6.io/xk6/cmd/xk6@latest && \
    xk6 build --with github.com/grafana/xk6-output-influxdb && \
    mv k6 /usr/bin/k6

# Install Node.js
RUN apk add --no-cache nodejs npm

# Copy the package.json file
COPY package.json package.json

# Install Node.js dependencies (if any)
RUN npm install

# Set the working directory
WORKDIR /app

# Copy the test scripts and other necessary files
COPY tests ./tests
COPY .env .env
COPY runtest.sh runtest.sh

# Copy the utils directory
COPY utils ./utils

# Copy the api and config directories
COPY api ./api
COPY config ./config

# Make the script executable (as root)
RUN chmod +x runtest.sh

# Switch back to the default user
USER k6

# Override the default entrypoint to run the script
ENTRYPOINT ["sh", "./runtest.sh"]