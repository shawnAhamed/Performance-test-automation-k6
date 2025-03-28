export function getTestScops(testScope) {
    const testConfigs = {
        smoke: {
            executor: 'constant-vus',
            vus: 1,
            duration: '1s',
        },
        baseline: {
            executor: 'constant-vus',
            vus:10,
            duration: '1m',
            thresholds: {
                http_req_duration: ['p(95)<300'],
                http_req_failed: ['rate<0.005'],
            },
        },
        load: {
            executor: 'ramping-vus',
            stages: [{ duration: '5m', target: 50 }],
            thresholds: {
                http_req_duration: ['p(95)<400'],
                http_req_failed: ['rate<0.01'],
            },
        },
        stress: {
            executor: 'ramping-vus',
            stages: [
                { duration: '2m', target: 50 },
                { duration: '5m', target: 500 },
            ],
            thresholds: {
                http_req_duration: ['p(99)<800'],
                http_req_failed: ['rate<0.02'],
            },
        },
        spike: {
            executor: 'ramping-vus',
            stages: [
                { duration: '10s', target: 200 },
                { duration: '30s', target: 10 },
            ],
            thresholds: {
                http_req_duration: ['p(99)<1000'],
                http_req_failed: ['rate<0.05'],
            },
        },
        soak: {
            executor: 'ramping-vus',
            stages: [{ duration: '1h', target: 100 }],
            thresholds: {
                http_req_duration: ['p(95)<500'],
                http_req_failed: ['rate<0.01'],
            },
        },
        endorance: {
            executor: 'ramping-vus',
            stages: [{ duration: '1h', target: 100 }],
            thresholds: {
                http_req_duration: ['p(95)<500'],
                http_req_failed: ['rate<0.01'],
            },
        }
    };

    return testConfigs[testScope] || testConfigs.smoke;
}
