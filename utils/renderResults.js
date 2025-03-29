import fs from 'fs';
import path from 'path';

// Read finalResults.json
const resultsPath = path.resolve('./finalResults.json');
const finalResults = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));

// Generate HTML content
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>K6 Test Results</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f4f4f4; }
        .endpoint { font-weight: bold; }
    </style>
</head>
<body>
    <h1>K6 Test Results</h1>
    ${finalResults.map(result => `
        <h2 class="endpoint">${result.endpoint} (${result.method})</h2>
        <table>
            <tr>
                <th>Metric</th>
                <th>Value</th>
            </tr>
            <tr>
                <td>Request Count</td>
                <td>${result.requestCount}</td>
            </tr>
            <tr>
                <td>Failed Count</td>
                <td>${result.failedCount}</td>
            </tr>
            <tr>
                <td>Failure Rate (%)</td>
                <td>${result.failureRate.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Average Duration (ms)</td>
                <td>${result.averageDuration.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Min Duration (ms)</td>
                <td>${result.minDuration.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Max Duration (ms)</td>
                <td>${result.maxDuration.toFixed(2)}</td>
            </tr>
            <tr>
                <td>P90 Duration (ms)</td>
                <td>${result.p90Duration.toFixed(2)}</td>
            </tr>
            <tr>
                <td>P95 Duration (ms)</td>
                <td>${result.p95Duration.toFixed(2)}</td>
            </tr>
            <tr>
                <td>P99 Duration (ms)</td>
                <td>${result.p99Duration.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Status Codes</td>
                <td>${Object.entries(result.statusCodes).map(([code, count]) => `${code}: ${count}`).join(', ')}</td>
            </tr>
        </table>
    `).join('')}
</body>
</html>
`;

// Write HTML to file
const outputPath = path.resolve('./results.html');
fs.writeFileSync(outputPath, htmlContent);
console.log(`HTML report generated at ${outputPath}`);
