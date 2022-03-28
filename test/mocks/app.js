'use strict'

var Koa = require('koa')
var session = require('koa-generic-session')
var Router = require('koa-trie-router')
var bodyParser = require('koa-bodyparser')
var lusca = require('../..')

module.exports = function (config, disableSession) {
  const app = new Koa()

  app.keys = ['key1', 'key2']

  if (!disableSession) {
    app.use(session({}, app))
    app.use(function (ctx, next) {
      ctx.session.secret = 'abc'
      return next()
    })
  }
  app.use(bodyParser())
  app.use(lusca(config))

  app.router = new Router()
  app.use(app.router.middleware())

  return app
}
