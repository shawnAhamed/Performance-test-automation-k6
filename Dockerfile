FROM golang:1.23 AS builder

WORKDIR /xk6

RUN go install go.k6.io/xk6/cmd/xk6@latest

RUN xk6 build --with github.com/grafana/xk6-output-influxdb

FROM alpine:3.18

RUN apk add --no-cache ca-certificates

COPY --from=builder /xk6/k6 /usr/bin/k6

WORKDIR /k6

COPY . .

CMD ["sh", "runtest.sh"]
