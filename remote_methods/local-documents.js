module.exports = (model) => {
  model.remoteMethod('putLocalDoc', {
    accepts: [
      {arg: 'data', type: 'object', http: {source: 'body'}},
      {arg: 'localId', type: 'any', required: true,http: {source: 'path'}}
    ],
    returns: {arg: 'data', type: 'object', root: true },
    http: {path: '/_local/:localId', verb: 'put'}
  });

  model.remoteMethod('getLocalDoc', {
    accepts: {arg: 'localId', type: 'any', required: true, http: {source: 'path'}},
    returns: {arg: 'data', type: 'object', root: true },
    http: {path: '/_local/:localId', verb: 'get'}
  });

  model.remoteMethod('deleteLocalDoc', {
    accepts: {arg: 'localId', type: 'any', required: true, http: {source: 'path'}},
    returns: {arg: 'data', type: 'object', root: true },
    http: {path: '/_local/:localId', verb: 'delete'}
  });
}