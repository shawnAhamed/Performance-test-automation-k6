import http from 'k6/http';
import { check } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

// import { trackMetrics } from './metricsUtil.js';
import { apiInventory } from '../api/api_Inventory.js';






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

        throughput.add(1 / (response.timings.duration / 1000));

        // trackMetrics(apiName, response);

        return response;
    } catch (error) {
        console.error(`[ERROR] API Request Failed: ${error.message}`);
        return { status: 500, body: '{}' }; // Return a safe default response
    }
}
