loopback-rest-connector-syncgateway
===

## Adding rest connector to an api:

1. add to component-config:
```
"loopback-rest-connector-syncgateway": {
  "url": 192.168.99.100:4984,
  "bucket": worker,
  "models": [
    {
      "worker": [ "databases", "documents-and-attachments" ]
    }
  ]
}
```
2. Change the model datasource to transient in model-config.json
3. The name of your model will be the name of your bucket