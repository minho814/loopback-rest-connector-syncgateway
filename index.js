const debug = require('debug')('couchbase:connector:index');

const loopback = require('loopback');

const Couchbase = class CouchBase {

  constructor(url, bucket) {
    debug("url", url);
    debug("bucket", bucket);

    const connector = require('./connector.js');

    this.ds = loopback.createDataSource(connector(url, bucket));
  }

  getStatus() {
    debug("getStatus");
    return this.ds.getStatus()
      .then((result) => {
        return result[0];
      })
      .catch((error) => {
        throw error;
      });
  }

  find() {
    debug("find");
    return this.ds.find()
      .then((result) => {
        return result[0];
      })
      .catch((error) => {
        throw error;
      })
  }

  findById(id) {
    debug("findById");
    return this.ds.findById(id)
      .then((result) => {
        return result[0];
      })
      .catch((error) => {
        throw error;
      });
  }

  findByIds(ids) {
    debug("findByIds");
    return this.ds.findByIds(ids)
      .catch((error) => {
        throw error;
      });
  }

  findByKeys(keys) {
    debug("findByKeys");
    return this.ds.findByKeys(keys)
      .catch((error) => {
        throw error;
      });
  }

  create(data) {
    debug("create");
    return this.ds.create(data)
      .then((result) => {
        return result[0];
      })
      .catch((error) => {
        throw error;
      })
  }

  createMany(data, model) {
    debug("createMany");
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
    debug("updateAttributes");
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
    debug("deleteById");
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
    debug("getChanges");
    return this.ds.getChanges()
      .then((result) => {
        return result[0];
      })
      .catch((error) => {
        throw error;
      });
  }

  putAttachment(data, id, attachment) {
    debug("putAttachment");
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
    debug("getAttachment");
    return this.ds.getAttachment(id, attachment)
      .then((result) => {
        return result[0];
      })
      .catch((error) => {
        throw error;
      });
  }

  putLocalDoc(data, localId) {
    debug("putLocalDoc");
    return this.ds.putLocalDoc(data, localId)
      .then((result) => {
        return result[0];
      })
      .catch((error) => {
        throw error;
      });
  }

  getLocalDoc(localId) {
    debug("getLocalDoc");
    return this.ds.getLocalDoc(localId)
      .then((result) => {
        return result[0];
      })
      .catch((error) => {
        throw error;
      });
  }

  deleteLocalDoc(localId) {
    debug("deleteLocalDoc");
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
    debug("postFacebookToken");
    return this.ds.postFacebookToken(data)
      .catch((error) => {
        throw error;
      });
  }

  postPersonaAssertion(data) {
    debug("postPersonaAssertion");
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
  debug("options", options);

  const url = options.url;
  const bucket = options.bucket;

  if (!url) { throw new Error('options.url is undefined'); }
  if (!bucket) { throw new Error('options.bucket is undefined'); }

  options.models.forEach(item => {
    const model = Object.keys(item)[0];
    const categories = item[model];

    debug("categories", categories);

    if(!app.models[model]) {
      throw new Error(`'${model}' does not match any of the valid models`);
    }

    const cb = new Couchbase(`http://${url}`, bucket);
    cb.couchbasify(app.models[model], categories);
  });
}
