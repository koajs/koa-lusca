/* eslint-env mocha */

const request = require('supertest')
const assert = require('assert')
const lusca = require('../index')
const mock = require('./mocks/app')

describe('xssProtection', function () {
  var server

  afterEach(function (done) {
    if (server) {
      server.close(done)
    } else {
      done()
    }
  })

  it('method', function () {
    assert(typeof lusca.xssProtection === 'function')
  })

  it('xssProtection = 1', function () {
    var config = { xssProtection: 1 }
    var app = mock(config)

    app.use(function (ctx) {
      ctx.status = 200
    })

    server = app.listen()

    return request(server)
      .get('/')
      .expect('X-XSS-Protection', '1; mode=block')
      .expect(200)
  })

  it('header (enabled)', function () {
    var config = { xssProtection: true }
    var app = mock(config)

    app.use(function (ctx) {
      ctx.status = 200
    })

    server = app.listen()

    return request(server)
      .get('/')
      .expect('X-XSS-Protection', '1; mode=block')
      .expect(200)
  })

  it('header (enabled; custom mode)', function () {
    var config = { xssProtection: { enabled: 1, mode: 'foo' } }
    var app = mock(config)

    app.use(function (ctx) {
      ctx.status = 200
    })

    server = app.listen()

    return request(server)
      .get('/')
      .expect('X-XSS-Protection', '1; mode=foo')
      .expect(200)
  })

  it('header (enabled is boolean; custom mode)', function () {
    var config = { xssProtection: { enabled: true } }
    var app = mock(config)

    app.use(function (ctx) {
      ctx.status = 200
    })

    server = app.listen()

    return request(server)
      .get('/')
      .expect('X-XSS-Protection', '1; mode=block')
      .expect(200)
  })

  it('header (!enabled)', function () {
    var config = { xssProtection: { enabled: 0 } }
    var app = mock(config)

    app.use(function (ctx) {
      ctx.status = 200
    })

    server = app.listen()

    return request(server)
      .get('/')
      .expect('X-XSS-Protection', '0; mode=block')
      .expect(200)
  })
})
