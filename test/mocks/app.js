'use strict';

const Koa = require('koa');
const session = require('koa-generic-session');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const lusca = require('../..');

module.exports = function (config, disableSession) {
  const app = new Koa();
  const router = new Router();
  app.keys = ['key1', 'key2'];
  if (!disableSession) {
    app.use(session({ secret: 'abc' }));
  }
  app.use(bodyParser());
  app.use(lusca(config));
  app.use(router.routes());

  router.get('/', function(ctx) {
    ctx.body = 'hello';
  });

  router.get('/csrf', function(ctx) {
    ctx.body = {
      token: ctx.state._csrf
    };
  });
  router.post('/csrf', function(ctx) {
    ctx.body = {
      token: ctx.state._csrf
    };
  });
  router.all('/csrf-foobar', function(ctx) {
    ctx.body = {
      token: ctx.state.foobar
    };
  });

  router.get('/show', function(ctx) {
    ctx.body = 'show';
  });

  return app;
};
