/* eslint-env mocha */

const request = require('supertest')
const assert = require('assert')
const lusca = require('../index')
const mock = require('./mocks/app')

describe('CSP', function () {
  var server

  afterEach(function (done) {
    if (server) {
      server.close(done)
    } else {
      done()
    }
  })

  it('method', function () {
    assert(typeof lusca.csp === 'function')
  })

  it('header (report)', function () {
    var config = require('./mocks/config/cspReport')
    var app = mock({ csp: config })

    app.use(function (ctx) {
      ctx.body = 'hello'
    })

    server = app.listen()

    return request(server)
      .get('/')
      .expect('Content-Security-Policy-Report-Only', 'default-src *; report-uri ' + config.reportUri)
      .expect('hello')
      .expect(200)
  })

  it('header (enforce)', function () {
    var config = require('./mocks/config/cspEnforce')
    var app = mock({ csp: config })

    app.use(function (ctx) {
      ctx.body = 'hello'
    })

    server = app.listen()

    return request(server)
      .get('/')
      .expect('Content-Security-Policy', 'default-src *')
      .expect('hello')
      .expect(200)
  })

  it('string config', function () {
    var app = mock({
      csp: {
        policy: 'default-src *'
      }
    })

    app.use(function (ctx) {
      ctx.status = 200
    })

    server = app.listen()

    return request(server)
      .get('/')
      .expect('Content-Security-Policy', 'default-src *')
      .expect(200)
  })

  it('array config', function () {
    var app = mock({
      csp: {
        policy: ['default-src *', 'img-src *']
      }
    })

    app.use(function (ctx) {
      ctx.body = 'hello'
    })

    server = app.listen()

    return request(server)
      .get('/')
      .expect('Content-Security-Policy', 'default-src *; img-src *')
      .expect(200)
  })

  it('nested config', function () {
    var app = mock({
      csp: {
        policy: [
        { 'default-src': '*' },
          'img-src *'
        ]
      }
    })
    app.use(function (ctx) {
      ctx.body = 'hello'
    })

    server = app.listen()

    return request(server)
      .get('/')
      .expect('Content-Security-Policy', 'default-src *; img-src *')
      .expect(200)
  })
})
