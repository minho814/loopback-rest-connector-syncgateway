# loopback-rest-connector-syncgateway

## Installation
```npm i --save loopback-rest-connector-syncgateway```

sync gateway public rest api reference:
http://developer.couchbase.com/documentation/mobile/1.2/develop/references/sync-gateway/rest-api/index.html

## Adding rest connector to an api:

1. Add to component-config:
```
"loopback-rest-connector-syncgateway": {
  "url": process.env.SYNC_GATEWAY_URL:process.env.SYNC_GATEWAY_PORT,
  "bucket": process.env.BUCKET_NAME,
  "models": [
    {
      process.env.MODEL: [ "databases", "documents-and-attachments" ]
    }
  ]
}
```
2. Change the model datasource to transient in model-config

available remote methods include:
  databases
  documents-and-attachments
  local-documents
  authentications
