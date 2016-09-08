const debug = require('debug')('couchbase:connector:authentications');

module.exports = (model) => {
  debug("Adding authentications remote methods");
  
  model.remoteMethod('postFacebookToken', {
    accepts: {arg: 'data', type: 'object', http: {source: 'body'}},
    returns: {arg: 'data', type: 'object', root: true },
    http: {path: '/_facebook_token', verb: 'post'}
  });

  model.remoteMethod('postPersonaAssertion', {
    accepts: {arg: 'data', type: 'object', http: {source: 'body'}},
    returns: {arg: 'data', type: 'object', root: true },
    http: {path: '/_persona_assertion', verb: 'post'}
  });
}