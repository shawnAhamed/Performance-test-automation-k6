import { InfluxDB } from '@influxdata/influxdb-client';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Configuration - values loaded from .env
const config = {
    url: process.env.INFLUXDB_URL || 'http://localhost:8086',
    token: process.env.INFLUXDB_TOKEN || '',
    org: process.env.K6_INFLUXDB_ORGANIZATION || '',
    bucket: process.env.INFLUXDB_BUCKET || '',
};

// Validate configuration
if (!config.url || !config.token || !config.org || !config.bucket) {
    console.error('Error: Missing required InfluxDB configuration. Please check your .env file.');
    process.exit(1);
}

// Create InfluxDB client
const influxDB = new InfluxDB({ url: config.url, token: config.token });
const queryApi = influxDB.getQueryApi(config.org);

// Flux query to get endpoint performance data
const fluxQuery = `
from(bucket: "${config.bucket}")
  |> range(start: -10m)
  |> filter(fn: (r) => r._measurement == "http_req_duration" or 
                       r._measurement == "http_reqs" or
                       r._measurement == "http_req_failed")
  |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> group(columns: ["url", "name", "method", "status"])
`;

// Object to store aggregated results
const endpointResults = {};

console.log('Querying InfluxDB for K6 test results...');

// Execute query
queryApi.queryRows(fluxQuery, {
    next(row, tableMeta) {
        const o = tableMeta.toObject(row);

        const url = o.url || 'unknown';
        const endpointName = o.name || url;
        const method = o.method || 'GET';
        const status = o.status || '0';

        // Initialize endpoint entry if it doesn't exist
        if (!endpointResults[endpointName]) {
            endpointResults[endpointName] = {
                url,
                method,
                requestCount: 0,
                failedCount: 0,
                durations: [],
                statusCodes: {}
            };
        }

        const endpoint = endpointResults[endpointName];

        // Process different measurement types
        if (o._measurement === 'http_reqs') {
            endpoint.requestCount += o.value || 0;
        }
        else if (o._measurement === 'http_req_failed') {
            endpoint.failedCount += o.value || 0;
        }
        else if (o._measurement === 'http_req_duration') {
            endpoint.durations.push(o.value);
        }

        // Track status codes
        if (status && o._measurement === 'http_reqs') {
            if (!endpoint.statusCodes[status]) {
                endpoint.statusCodes[status] = 0;
            }
            endpoint.statusCodes[status] += o.value || 1;
        }
    },
    error(error) {
        if (error.code === 'unauthorized') {
            console.error('Error: Unauthorized access. Please check your InfluxDB token and permissions.');
        } else {
            console.error('Query error:', error);
        }
    },
    complete() {
        console.log('Query completed, processing results...');

        // Calculate statistics for each endpoint
        const finalResults = Object.keys(endpointResults).map(endpointName => {
            const endpoint = endpointResults[endpointName];
            const durations = endpoint.durations;

            // Calculate duration statistics
            const avgDuration = durations.length > 0
                ? durations.reduce((a, b) => a + b, 0) / durations.length
                : 0;

            const minDuration = durations.length > 0 ? Math.min(...durations) : 0;
            const maxDuration = durations.length > 0 ? Math.max(...durations) : 0;
            const p90Duration = calculatePercentile(durations, 90);
            const p95Duration = calculatePercentile(durations, 95);
            const p99Duration = calculatePercentile(durations, 99);

            return {
                endpoint: endpointName,
                method: endpoint.method,
                requestCount: endpoint.requestCount,
                failedCount: endpoint.failedCount,
                failureRate: endpoint.requestCount > 0
                    ? (endpoint.failedCount / endpoint.requestCount) * 100
                    : 0,
                averageDuration: avgDuration,
                minDuration,
                maxDuration,
                p90Duration,
                p95Duration,
                p99Duration,
                statusCodes: endpoint.statusCodes
            };
        });

        // Save to JSON file
        const outputPath = './finalResults.json';
        fs.writeFileSync(outputPath, JSON.stringify(finalResults, null, 2));
        console.log(`Results saved to ${outputPath}`);

        console.log(finalResults);
    }
});

// Helper function to calculate percentiles
function calculatePercentile(values, percentile) {
    if (!values || values.length === 0) return 0;

    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil(percentile / 100 * sorted.length) - 1;
    return sorted[Math.max(0, index)];
}