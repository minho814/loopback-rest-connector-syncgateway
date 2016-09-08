const debug = require('debug')('couchbase:connector:connector');

module.exports = (url, bucket) => {
	debug("url ", url);
	debug("bucket ", bucket);

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  const responsePath = '$';

	return {
	  'name': 'cb',
	  'connector': require('loopback-connector-rest'),
	  'debug': true,
	  'operations': [
	    {
	      template: {
	        method: 'GET',
	        url: `${url}/${bucket}/`,
	        headers,
	        'query': {
	          'include_docs': true
	        },
	        responsePath,
	      },
	      'functions': {
	        'getStatus': []
	      }
	    },
	    {
	      template: {
	        method: 'GET',
	        url: `${url}/${bucket}/_all_docs`,
	        headers,
	        'query': {
	          'include_docs': true
	        },
	        responsePath,
	      },
	      'functions': {
	        'find': []
	      }
	    },
	    {
	      template: {
	        method: 'GET',
	        url: `${url}/${bucket}/{id}`,
	        headers,
	        'query': {
	          'include_docs': true
	        },
	        responsePath,
	      },
	      'functions': {
	        'findById': ['id']
	      }
	    },
	    {
	      template: {
	        method: 'POST',
	        url: `${url}/${bucket}/_bulk_get`,
	        'headers' : {'Content-Type': 'application/json'},
	        'body': '{data}',
	        responsePath,
	      },
	      'functions': {
	        'findByIds': ['data']
	      }
	    },
	    {
	      template: {
	        method: 'POST',
	        url: `${url}/${bucket}/`,
	        headers,
	        'body': '{data}',
	        responsePath,
	      },
	      'functions': {
	        'create': ['data']
	      }
	    },
	    {
	      template: {
	        method: 'POST',
	        url: `${url}/${bucket}/_all_docs`,
	        headers,
	        'body': '{data}',
	        'query': {
	          'include_docs': true
	        },
	        responsePath,
	      },
	      'functions': {
	        'findByKeys': ['data']
	      }
	    },
	    {
	      template: {
	        method: 'POST',
	        url: `${url}/${bucket}/_bulk_docs`,
	        headers,
	        'body': '{data}',
	        responsePath,
	      },
	      'functions': {
	        'createMany': ['data']
	      }
	    },
	    {
	      template: {
	        method: 'DELETE',
	        url: `${url}/${bucket}/{id}`,
	        headers,
	        'query': {
	          'rev': '{rev}'
	        },
	        responsePath,
	      },
	      'functions': {
	        'deleteById': ['id', 'rev']
	      }
	    },
	    {
	      template: {
	        method: 'PUT',
	        url: `${url}/${bucket}/{id}`,
	        headers,
	        'body': '{data}',
	        'query': {
	          'rev': '{rev}'
	        },
	        responsePath,
	      },
	      'functions': {
	        'updateAttributes': ['data', 'id', 'rev']
	      }
	    },
	    {
	      template: {
	        method: 'GET',
	        url: `${url}/${bucket}/_changes`,
	        headers,
	        'query': {
	          'include_docs': true
	        },
	        responsePath,
	      },
	      'functions': {
	        'getChanges': []
	      }
	    },
	    {
	      template: {
	        method: 'PUT',
	        url: `${url}/${bucket}/{id}/{attachment}`,
	        headers,
	        'body': '{data}',
	        'query': {
	          'rev': '{rev}'
	        },
	        responsePath,
	      },
	      'functions': {
	        'putAttachment': ['data','id','rev','attachment']
	      }
	    },
	    {
	      template: {
	        method: 'GET',
	        url: `${url}/${bucket}/{id}/{attachment}`,
	        responsePath,
	      },
	      'functions': {
	        'getAttachment': ['id','attachment']
	      }
	    },
	    {
	      template: {
	        method: 'PUT',
	        url: `${url}/${bucket}/_local/{localId}`,
	        headers,
	        'body': '{data}',
	        responsePath,
	      },
	      'functions': {
	        'putLocalDoc': ['data', 'localId']
	      }
	    },
	    {
	      template: {
	        method: 'GET',
	        url: `${url}/${bucket}/_local/{localId}`,
	        responsePath,
	      },
	      'functions': {
	        'getLocalDoc': ['localId']
	      }
	    },
	    {
	      template: {
	        method: 'DELETE',
	        url: `${url}/${bucket}/_local/{localId}`,
	        'query': {
	          'rev': '{rev}'
	        },
	        responsePath,
	      },
	      'functions': {
	        'deleteLocalDoc': ['localId', 'rev']
	      }
	    },
	    {
	      template: {
	        method: 'POST',
	        url: `${url}/${bucket}/_facebook_token`,
	        headers,
	        'body': '{data}',
	        responsePath,
	      },
	      'functions': {
	        'postFacebookToken': ['data']
	      }
	    },
	    {
	      template: {
	        method: 'POST',
	        url: `${url}/${bucket}/_persona_assertion`,
	        headers,
	        'body': '{data}',
	        responsePath,
	      },
	      'functions': {
	        'postPersonaAssertion': ['data']
	      }
	    }
	  ]
	}
};
