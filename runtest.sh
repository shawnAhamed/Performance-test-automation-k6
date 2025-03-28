# #!/bin/bash

# # Create results directory if not exists
# mkdir -p results

# # Run K6 test and save summary
# TEST_SCOPE=smoke API_ENDPOINT=productApi k6 run tests/mainTest.js --summary-export=results/k6_summary.json

# # Generate metrics report using Node.js
# echo "Generating JSON metrics report..."
# #node -e "import('./utils/metricsLogger.js').then(m => m.generateMetricsReport(require('./results/k6_summary.json')))"

# echo "Metrics report generated: results/metrics_report.json"



# #!/bin/bash

# Set K6 Cloud API Token
K6_CLOUD_TOKEN="f7deba96317dec6e0641d25812801dda2b0e800aad1d9287214915f09383e0fb"

# Export the token
export K6_CLOUD_TOKEN

# Run K6 test and send results to K6 Cloud
TEST_SCOPE=smoke k6 run tests/mainTest.js --out cloud

# Generate JSON report
echo "Generating JSON metrics report..."
node -e "require('./utils/metricsLogger.js').generateMetricsReport(require('./results/k6_summary.json'))"

echo "Custom metrics report saved in report/metrics_report.json"
echo "Test data sent to K6 Cloud. View results at https://app.k6.io"
