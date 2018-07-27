#!/bin/bash
data=''
#bx wsk action invoke --result svc-message --param $data

curl -u $API_KEY \
  -X POST \
  -H 'Content-Type: application/json'\
  -H 'Accept: application/json'\
  --data @example.json\
  "https://openwhisk.eu-gb.bluemix.net/api/v1/namespaces/bluemix@compsy.nl_dev/actions/svc-messages?blocking=true"
