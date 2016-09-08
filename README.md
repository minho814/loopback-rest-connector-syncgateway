# loopback-rest-connector-syncgateway
Note: For SyncGateway 1.2

## Installation
```npm i --save loopback-rest-connector-syncgateway```

SyncGateway Public REST API reference:
http://developer.couchbase.com/documentation/mobile/1.2/develop/references/sync-gateway/rest-api/index.html

## Adding REST connector to an API

1. Add to component-config:
```
"loopback-rest-connector-syncgateway": {
  "bucket": process.env.COUCHBASE_BUCKET,
  "url": process.env.SYNC_GATEWAY_URL,
  "models": [
    {
      "<someModelName>": [ "databases", "documents-and-attachments" ]
    }
  ]
}
```

2. Change the model datasource to transient in model-config.json

3. The name of your bucket will be set with your COUCHBASE_BUCKET environment variable  
   ex. `COUCHBASE_BUCKET=somebucket`
4. Add a SYNC_GATEWAY_URL environment variable which will be the url:port  
   ex. `SYNC_GATEWAY_URL=192.168.99.100:4984` (4984 is the default port for sync gateway)

####Available remote methods
- databases
- documents-and-attachments
- local-documents
- authentications
