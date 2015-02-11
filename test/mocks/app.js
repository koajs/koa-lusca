'use strict';

var koa = require('koa');
var koaMiddlewares = require('koa-middlewares');
var router = require('koa-router');
var lusca = require('../..');

module.exports = function (config, disableSession) {
  var app = koa();
  app.keys = ['key1', 'key2'];
  if (!disableSession) {
    app.use(koaMiddlewares.session({ secret: 'abc' }));
  }
  app.use(koaMiddlewares.bodyParser());
  app.use(lusca(config));
  app.use(router(app));

  app.get('/', function* () {
    this.body = 'hello';
  });

  return app;
};
