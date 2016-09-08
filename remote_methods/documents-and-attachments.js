const debug = require('debug')('couchbase:connector:documents');

module.exports = (model) => {
  debug("Adding documents-and-attachments remote methods");

  model.remoteMethod('create', {
    accepts: {arg: 'data', type: 'object', http: {source: 'body'}},
    returns: {arg: 'data', type: 'object', root: true },
    http: {path: '/', verb: 'post'}
  });

  model.remoteMethod('updateAttributes', {
    accepts: [
      {arg: 'data', type: 'object', http: {source: 'body'}},
      {arg: 'id', type: 'any', required: true,http: {source: 'path'}}
    ],
    returns: {arg: 'data', type: 'object', root: true },
    http: {path: '/:id', verb: 'put'}
  });

  model.remoteMethod('findById', {
    accepts: {arg: 'id', type: 'any', required: true,http: {source: 'path'}},
    returns: {arg: 'data', type: 'object', root: true },
    http: {path: '/:id', verb: 'get'}
  });

  model.remoteMethod('deleteById', {
    accepts: {arg: 'id', type: 'any', required: true, http: {source: 'path'}},
    returns: {arg: 'data', type: 'object', root: true },
    http: {path: '/:id', verb: 'delete'}
  });

  model.remoteMethod('putAttachment', {
    accepts: [
      {arg: 'data', type: 'object', http: {source: 'body'}},
      {arg: 'id', type: 'any', required: true, http: {source: 'path'}},
      {arg: 'attachment', type: 'any', required: true, http: {source: 'path'}}
    ],
    returns: {arg: 'data', type: 'object', root: true },
    http: {path: '/:id/:attachment', verb: 'put'}
  });

  model.remoteMethod('getAttachment', {
    accepts: [
      {arg: 'id', type: 'any', required: true,http: {source: 'path'}},
      {arg: 'attachment', type: 'any', required: true,http: {source: 'path'}}
    ],
    returns: {arg: 'data', type: 'object', root: true },
    http: {path: '/:id/:attachment', verb: 'get'}
  });
}