"use strict";
const path = require('path');
const http = require('http');
const url = require('url');
const querystring = require('querystring');

module.exports = function(module, options) {
  options || (options = {});
  const port = process.env.PORT || options.port || 3900;

  var onError = function(req, res, err) {
    var rval = {};
    if(err instanceof Error) {
      rval = { 
        error: err.message,
        name: err.name,
        stack: err.stack
      };
    } else if(typeof err === "string"){
      rval = {
        error: err
      };
    } else {
      throw new Error('Unexpected error:', err);
    }

    res.end(JSON.stringify(rval));
  };

  var onResponse = function(req, res, response) {
    var rval = JSON.parse(response.body);

    if(options.onResponse) {
      rval = options.onResponse.call(this, req, res, response);
    }

    return res.end(JSON.stringify(rval));
  };

  const server = http.createServer((req, res) => {
    var uri = url.parse(req.url);
    console.log('[Claudia-Server] >>>', req.method, req.url, uri.pathname, uri.query);

    var context = {
      requestContext: {
        resourcePath: uri.pathname || '/',
        httpMethod: req.method
      },
      queryStringParams: querystring.parse(uri.query)
    };

    if(options.onRequest) {
      options.onRequest(this, req, context);
    }

    module.proxyRouter(context, {
      done(err, response) {
        if(err) return onError(req, res, err);
        return onResponse(req, res, response);
      }
    });
  });

  server.listen(port, _ => {
    console.log('[Claudia-Server] listening on', port);
  });
};
