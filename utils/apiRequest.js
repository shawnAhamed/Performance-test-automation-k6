import http from 'k6/http';
import { check } from 'k6';
import { Trend, Counter, Rate,Gauge } from 'k6/metrics';
import { apiInventory } from '../api/api_Inventory.js';

let responseTime = new Trend('response_time');
let failureRate = new Rate('failed_requests');
let requestCount = new Counter('request_count');
let p90 = new Trend('p90_latency');
let p95 = new Trend('p95_latency');
let p99 = new Trend('p99_latency');
let throughput = new Trend('throughput');


export function apiRequest(apiName) {
    // Extract API details from inventory
    const { endpoint, method, headers, body } = apiInventory[apiName];

    console.log(`[DEBUG] API Request: ${apiName} | Method: ${method} | URL: ${endpoint}`);
    console.log(`[DEBUG] API Request Headers: ${JSON.stringify(headers)}`);

    let params = { headers: { ...headers } };

    console.log(`[DEBUG] Sending ${method} request to ${endpoint}`);

    let response;

    try {
        response = method === "POST"
            ? http.post(endpoint, JSON.stringify(body), params)
            : http.get(endpoint, params);

        check(response, { "is status 200": (r) => r.status === 200 });

        console.log(`[DEBUG] API Response Status: ${response.status}`);


        responseTime.add(response.timings.duration);
        failureRate.add(response.status >= 400);
        requestCount.add(1);
        p90.add(response.timings.duration);
        p95.add(response.timings.duration);
        p99.add(response.timings.duration);
        throughput.add(1 / (response.timings.duration / 1000));
        mymetrics.add("my custom text");
        return response;
    } catch (error) {
        console.error(`[ERROR] API Request Failed: ${error.message}`);
        return { status: 500, body: '{}' }; // Return a safe default response
    }
}
