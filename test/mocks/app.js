'use strict';

const koa = require('koa');
const session = require('koa-generic-session');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router');
const lusca = require('../..');

module.exports = function (config, disableSession) {
  const app = koa();
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
