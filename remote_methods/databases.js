module.exports = (model) => {
  model.remoteMethod('getStatus', {
    returns: {arg: 'data', type: 'object', root: true },
    http: {path: '/', verb: 'get'}
  });

  model.remoteMethod('find', {
    returns: {arg: 'data', type: 'object', root: true },
    http: {path: '/_all_docs', verb: 'get'}
  });

  model.remoteMethod('findByKeys', {
    accepts: {arg: 'data', type: 'object', http: {source: 'body'}},
    returns: {arg: 'data', type: 'object', root: true },
    http: {path: '/_all_docs', verb: 'post'}
  });

  model.remoteMethod('findByIds', {
    accepts: {arg: 'data', type: 'object', http: {source: 'body'}},
    returns: {arg: 'data', type: 'object', root: true },
    http: {path: '/_bulk_get', verb: 'post'}
  });

  model.remoteMethod('createMany', {
    accepts: {arg: 'data', type: 'object', http: {source: 'body'}},
    returns: {arg: 'data', type: 'object', root: true },
    http: {path: '/_bulk_docs', verb: 'post'}
  });

  model.remoteMethod('getChanges', {
    returns: {arg: 'data', type: 'object', root: true },
    http: {path: '/_changes', verb: 'get'}
  });
}