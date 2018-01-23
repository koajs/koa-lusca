/* eslint-env mocha */

const request = require('supertest')
const assert = require('assert')
const lusca = require('../index')
const mock = require('./mocks/app')

describe('HSTS', function () {
  var server

  afterEach(function (done) {
    if (server) {
      server.close(done)
    } else {
      done()
    }
  })

  it('method', function () {
    assert(typeof lusca.hsts === 'function')
  })

  it('assert error when maxAge is not number', function () {
    assert.throws(function () {
      lusca.hsts()
    }, /options\.maxAge should be a number/)
  })

  it('header (maxAge)', function () {
    var config = { hsts: { maxAge: 31536000 } }
    var app = mock(config)

    app.use(function (ctx) {
      ctx.body = 'hello'
    })

    server = app.listen()

    return request(server)
      .get('/')
      .expect('Strict-Transport-Security', 'max-age=' + config.hsts.maxAge)
      .expect('hello')
      .expect(200)
  })

  it('header (maxAge 0)', function () {
    var config = { hsts: { maxAge: 0 } }
    var app = mock(config)

    app.use(function (ctx) {
      ctx.body = 'hello'
    })

    server = app.listen()

    return request(server)
      .get('/')
      .expect('Strict-Transport-Security', 'max-age=0')
      .expect('hello')
      .expect(200)
  })

  it('hsts = number', function () {
    var config = { hsts: 31536000 }
    var app = mock(config)

    app.use(function (ctx) {
      ctx.body = 'hello'
    })

    server = app.listen()

    return request(server)
      .get('/')
      .expect('Strict-Transport-Security', 'max-age=31536000')
      .expect('hello')
      .expect(200)
  })

  it('header (maxAge; includeSubDomains)', function () {
    var config = { hsts: { maxAge: 31536000, includeSubDomains: true } }
    var app = mock(config)

    app.use(function (ctx) {
      ctx.body = 'hello'
    })

    server = app.listen()

    return request(server)
      .get('/')
      .expect('Strict-Transport-Security', 'max-age=' + config.hsts.maxAge + '; includeSubDomains')
      .expect('hello')
      .expect(200)
  })

  it('header (maxAge; includeSubDomains; preload)', function () {
    var config = { hsts: { maxAge: 31536000, includeSubDomains: true, preload: true } }
    var app = mock(config)

    app.use(function (ctx) {
      ctx.body = 'hello'
    })

    server = app.listen()

    return request(server)
      .get('/')
      .expect('Strict-Transport-Security', 'max-age=' + config.hsts.maxAge + '; includeSubDomains; preload')
      .expect('hello')
      .expect(200)
  })

  it('header (missing maxAge)', function () {
    server = null
    assert.throws(function () {
      mock({ hsts: {} })
    }, /options\.maxAge should be a number/)
  })
})
