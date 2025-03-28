import { check } from 'k6';
import http from 'k6/http';

export default function () {
    const res = http.get('https://api.restful-api.dev/objects/7');
    check(res, {
        'is status 200': (r) => r.status === 200,
    });
    console.log(JSON.stringify(res));
}