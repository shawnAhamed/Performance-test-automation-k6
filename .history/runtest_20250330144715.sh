#!/bin/bash

## Run K6 test and send results to K6 Cloud
#K6_CLOUD_TOKEN="f7deba96317dec6e0641d25812801dda2b0e800aad1d9287214915f09383e0fb"
#export K6_CLOUD_TOKEN
#TEST_SCOPE=smoke k6 run tests/main_test.js --out cloud


  # Load environment variables from .env file
  set -o allexport
  source .env
  set +o allexport

  # Script path
  SCRIPT_PATH="tests/main_test.js"  # Adjusted to match the container's directory structure

# Determine the k6 binary to use
if [ -f "./k6" ]; then
  K6_BINARY="./k6"
else
  K6_BINARY="k6"
fi

# Run with xk6-influxdb plugin
K6_INFLUXDB_ORG=$K6_INFLUXDB_ORG \
K6_INFLUXDB_BUCKET=$K6_INFLUXDB_BUCKET \
K6_INFLUXDB_TOKEN=$K6_INFLUXDB_TOKEN \
$K6_BINARY run --out xk6-influxdb=$K6_INFLUXDB_URL "$SCRIPT_PATH"
node ./utils/indluxReport.js
node ./scripts/renderResult.js

