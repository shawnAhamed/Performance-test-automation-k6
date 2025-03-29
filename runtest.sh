
# Set K6 Cloud API Token
K6_CLOUD_TOKEN="f7deba96317dec6e0641d25812801dda2b0e800aad1d9287214915f09383e0fb"

# Export the token
export K6_CLOUD_TOKEN

# Run K6 test and send results to K6 Cloud
TEST_SCOPE=smoke k6 run tests/main_test.js --out cloud

# Generate JSON report

