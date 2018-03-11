'use strict';

var koa = require('koa');
var session = require('koa-generic-session');
var bodyParser = require('koa-bodyparser');
var router = require('koa-router');
var lusca = require('../..');

module.exports = function (config, disableSession) {
  var app = koa();
  app.keys = ['key1', 'key2'];
  if (!disableSession) {
    app.use(session({ secret: 'abc' }));
  }
  app.use(bodyParser());
  app.use(lusca(config));
  app.use(router(app));

  app.get('/', function* () {
    this.body = 'hello';
  });

  return app;
};
