const debug = require('debug')('couchbase:connector:beforeRemote');

module.exports = (model) => {

  model.beforeRemote('create', (ctx, unused, next) => {
    debug("create before remote");

    ctx.instance = new model(ctx.args.data);
    ctx.Model = model;

    model.notifyObserversOf('before save', ctx, next, () => {});
  });

  model.beforeRemote('createMany', (ctx, unused, next) => {
    debug("createMany before remote");

    const ctxArray = [];
    const promises = [];

    for(let x in ctx.args.data.docs) {
      ctxArray[x] = {};
      Object.assign(ctxArray[x], ctx);
      ctxArray[x].instance = new model(ctx.args.data.docs[x]);
      ctxArray[x].Model = model;

      promises.push(new Promise((resolve, reject) => {
        model.notifyObserversOf('before save', ctxArray[x], (error) => {
          if (error) {
            if (error.errors) {
              resolve(JSON.stringify(error.errors));
            }
            resolve(error);
          }
          resolve();
        });
      }));
    }

    Promise.all(promises)
      .then((results) => { 
        if(results.every(result => !result)) {
          next();
        }
        else {
          next(new Error(results)); 
        }
      })
      .catch((error) => { next(error); });
  });

  model.beforeRemote('updateAttributes', (ctx, unused, next) => {
    debug("updateAttributes before remote");

    ctx.data = new model(ctx.args.data);
    ctx.Model = model;
    model.findById(ctx.args.id)
      .then((data) => {
        ctx.currentInstance = data;

        model.notifyObserversOf('before save', ctx, next, () => {});
      })
      .catch((error) => {

        if(error.message.reason == 'missing') {
          ctx.instance = ctx.data;
          if (!ctx.instance.vitals) {
            ctx.instance.vitals = {};
          }
          model.notifyObserversOf('before save', ctx, next, () => {});
        } else {
          next(error);
        }
      });
  });
}