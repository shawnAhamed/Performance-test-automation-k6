import { apiRequest } from '/app/utils/apiRequest.js'; // Updated path
import { getTestScops } from '/app/config/testScopes.js'; // Updated path
import { apiInventory } from '/app/api/api_Inventory.js'; // Updated path

const testName = __ENV.TEST_SCOPE || 'smoke';
const apiendpoint = __ENV.API_ENDPOINT || null;
const availableAPIs = apiendpoint ? [apiendpoint] : Object.keys(apiInventory);

console.log(`[INFO] Running test for: ${testName}`);

const testScopConfig = getTestScops(testName);
export const options = {
    scenarios: {
        testscenario: {
            executor: testScopConfig.executor,
            vus: testScopConfig.vus,
            duration: testScopConfig.duration,
        },
    },
    stages: testScopConfig.stages,
    thresholds: testScopConfig.thresholds,
};
console.log(`[INFO] Test Configuration: ${JSON.stringify(options)}`);

console.log(`[INFO] Number of APIs being tested: ${availableAPIs.length}`);

export default function () {
    console.log("[DEBUG] Test execution started...");

    availableAPIs.forEach(endpoint => {
        console.log(`[DEBUG] Testing API: ${endpoint}`);
        let response = apiRequest(endpoint);
        if (!response || response.status !== 200) {
            console.error(`[ERROR] API Test Failed for ${endpoint}`);
            return;
        }
        console.log(`[DEBUG] API Response Status: ${response.status}`);
        console.log(`[DEBUG] API Response Body: ${response.body}`);
    });
}
