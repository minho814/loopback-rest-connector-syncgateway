loopback-rest-connector-syncgateway
===

## Adding rest connector to an api:

1. add to component-config:
```
"loopback-rest-connector-syncgateway": {
  "url": process.env.SYNC_GATEWAY_URL:process.env.SYNC_GATEWAY_PORT,
  "bucket": process.env.BUCKET_NAME,
  "models": [
    {
      "worker": [ "databases", "documents-and-attachments" ]
    }
  ]
}
```
2. Change the model datasource to transient in model-config
