# Performance Test Automation with K6

This project is designed to test the performance of various API endpoints using K6. It collects metrics such as request count, failure rate, response times, and more, and generates a detailed HTML report for analysis.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [Go](https://golang.org/) (for building custom K6 binaries)

---

## Project Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Performance-test-automation-k6
```

### 2. Install Dependencies
Install Node.js dependencies:
```bash
npm install
```

---

## K6 Installation

### 1. Install K6
Follow the official [K6 installation guide](https://k6.io/docs/getting-started/installation/) for your operating system.

### 2. Build Custom K6 Binary
This project uses the `xk6-influxdb` plugin for exporting metrics to InfluxDB. Build the custom K6 binary:
```bash
go install go.k6.io/xk6/cmd/xk6@latest
xk6 build --with github.com/grafana/xk6-output-influxdb
```

---

## Docker Setup

### 1. Build Docker Image
Build the custom Docker image for running K6 tests:
```bash
docker-compose build
```

### 2. Start Services
Start InfluxDB, Grafana, and the K6 runner:
```bash
docker-compose up -d
```

- **InfluxDB**: Accessible at `http://localhost:8086`


---

## Test Configuration

### 1. Define API Endpoints
Edit the `api/api_Inventory.js` file to define the API endpoints to be tested:
```javascript
export const apiInventory = {
    example_endpoint: {
        endpoint: 'https://dummyjson.com/objects',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    },
    // Add more endpoints as needed
};
```

### 2. Configure Test Scopes
Edit the `config/testScopes.js` file to define test scenarios (e.g., smoke, load, stress):
```javascript
export function getTestScops(testScope) {
    return {
        smoke: { executor: 'constant-vus', vus: 1, duration: '1s' },
        load: { executor: 'ramping-vus', stages: [{ duration: '5m', target: 50 }] },
        // Add more scenarios as needed
    }[testScope];
}
```

---

## Test Execution

### 1. Run Tests Locally
Run the tests using the custom K6 binary:
```bash
./k6 run tests/main_test.js
```

### 2. Run Tests with Docker
Execute the tests using Docker Compose:
```bash
docker-compose run k6
```

### 3. Generate Reports
After the tests complete, the results will be processed and saved:
- **Raw Results**: `finalResults.json`
- **HTML Report**: `results.html`

---

## Interpreting Test Results

### Metrics Overview
- **Request Count**: Total number of requests sent.
- **Failed Count**: Number of failed requests.
- **Failure Rate**: Percentage of failed requests.
- **Response Times**: Average, minimum, maximum, and percentile durations (P90, P95, P99).
- **Status Codes**: Distribution of HTTP status codes.

### HTML Report
Open `results.html` in a browser to view a detailed summary of the test results for each endpoint.

---
