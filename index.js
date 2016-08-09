const loopback = require('loopback');

const Couchbase = class CouchBase {

  constructor(url, bucket) {
    const connector = require('./connector.js');

    this.ds = loopback.createDataSource(connector(url, bucket));
  }

  getStatus() {
    return this.ds.getStatus()
      .then((result) => {
        return result[0];
      })
      .catch((error) => {
        throw error;
      });
  }

  find() {
    return this.ds.find()
      .then((result) => {
        return result[0];
      })
      .catch((error) => {
        throw error;
      })
  }

  findById(id) {
    return this.ds.findById(id)
      .then((result) => {
        return result[0];
      })
      .catch((error) => {
        throw error;
      });
  }

  findByIds(ids) {
    return this.ds.findByIds(ids)
      .catch((error) => {
        throw error;
      });
  }

  findByKeys(keys) {
    return this.ds.findByKeys(keys)
      .catch((error) => {
        throw error;
      });
  }

  create(data) {
    return this.ds.create(data)
      .then((result) => {
        return result[0];
      })
      .catch((error) => {
        throw error;
      })
  }

  createMany(data, model) {
    for(let x in data.docs) {
      data.docs[x] = new model(data.docs[x]);
    }
    return this.ds.createMany(data)
      .then((result) => {
        return result[0];
      })
      .catch((error) => {
        throw error;
      });
  }

  updateAttributes(data, id) {
    return this.findById(id)
      .then((result) => {
        const rev = result._rev;
        return this.ds.updateAttributes(data, id, rev);
      })
      .catch((error) => {
        if(error.message.reason == 'missing') {
          data._id = id;
          return this.create(data);
        } else {
          throw error;
        }
      });
  }

  deleteById(id) {
    return this.findById(id)
      .then((result) => {
        const rev = result._rev;
        return this.ds.deleteById(id, rev);
      })
      .then((result) => {
        return result[0];
      })
      .catch((error) => {
        throw error;
      });
  }

  getChanges() {
    return this.ds.getChanges()
      .then((result) => {
        return result[0];
      })
      .catch((error) => {
        throw error;
      });
  }

  putAttachment(data, id, attachment) {
   return this.findById(id)
    .then((result) => {
      const rev = result._rev;
      return this.ds.putAttachment(data, id, rev, attachment);
    })
    .then((result) => {
      return result[0];
    })
    .catch((error) => {
      throw error;
    })
  }

  getAttachment(id, attachment) {
    return this.ds.getAttachment(id, attachment)
      .then((result) => {
        return result[0];
      })
      .catch((error) => {
        throw error;
      });
  }

  putLocalDoc(data, localId) {
    return this.ds.putLocalDoc(data, localId)
      .then((result) => {
        return result[0];
      })
      .catch((error) => {
        throw error;
      });
  }

  getLocalDoc(localId) {
    return this.ds.getLocalDoc(localId)
      .then((result) => {
        return result[0];
      })
      .catch((error) => {
        throw error;
      });
  }

  deleteLocalDoc(localId) {
    return this.getLocalDoc(localId)
      .then((result) => {
        const rev = result._rev;
        return this.ds.deleteLocalDoc(localId, rev);
      }) 
      .catch((error) => {
        throw error;
      });
  }

  postFacebookToken(data) {
    return this.ds.postFacebookToken(data)
      .catch((error) => {
        throw error;
      });
  }

  postPersonaAssertion(data) {
    return this.ds.postPersonaAssertion(data)
      .catch((error) => {
        throw error;
      });
  }

  couchbasify(model, categories) {
    model.getStatus = () => this.getStatus();
    model.find = () => this.find();
    model.findById = (id) => this.findById(id);
    model.findByIds = (ids) => this.findByIds(ids);
    model.findByKeys = (keys) => this.findByKeys(keys);
    model.create = (data) => this.create(new model(data));
    model.createMany = (data) => this.createMany(data, model);
    model.deleteById = (id) => this.deleteById(id);
    model.updateAttributes = (data, id) => this.updateAttributes(new model(data), id);
    model.getChanges = () => this.getChanges();
    model.putAttachment = (data, id, attachment) => this.putAttachment(data, id, attachment);
    model.getAttachment = (id, attachment) => this.getAttachment(id, attachment);
    model.putLocalDoc = (data, localId) => this.putLocalDoc(new model(data), localId);
    model.getLocalDoc = (localId) => this.getLocalDoc(localId);
    model.deleteLocalDoc = (localId) => this.deleteLocalDoc(localId);
    model.postFacebookToken = (data) => this.postFacebookToken(data);
    model.postPersonaAssertion = (data) => this.postPersonaAssertion(data);

    categories.forEach(item => {
      const path = './remote_methods/' + item + '.js';
      require(path)(model);
    });

    require('./remote_methods/before-remote-methods.js')(model);

    return model;
  }
}

module.exports = (app, options) => {
  const url = options.url;
  const bucket = options.bucket;
  if (!url || !bucket) {
    throw new Error("Invalid configurations in component-config.json");
  }

  options.models.forEach(item => {
    const model = Object.keys(item)[0];
    const categories = item[model];

    const cb = new Couchbase(`http://${url}`, model.toLowerCase());
    cb.couchbasify(app.models[model], categories);
  });
}
