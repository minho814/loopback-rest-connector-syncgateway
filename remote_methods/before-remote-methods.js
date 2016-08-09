module.exports = (model) => {
  model.beforeRemote('create', (ctx, unused, next) => {
    ctx.instance = new model(ctx.args.data);
    ctx.Model = model;

    model.notifyObserversOf('before save', ctx, next, () => {});
  });

  model.beforeRemote('createMany', (ctx, unused, next) => {
    const ctxArray = [];
    const promises = [];

    for(let x in ctx.args.data.docs) {
      ctxArray[x] = ctx;
      ctxArray[x].instance = new model(ctx.args.data.docs[x]);
      ctxArray[x].Model = model;
      promises.push(new Promise((resolve, reject) => {
        model.notifyObserversOf('before save', ctxArray[x], (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      }));
    }

    Promise.all(promises)
      .then(() => { next(); })
      .catch((error) => { next(error); });
  });

  model.beforeRemote('updateAttributes', (ctx, unused, next) => {
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