/* eslint-env mocha */

const request = require('supertest')
const assert = require('assert')
const lusca = require('../index')
const mock = require('./mocks/app')

describe('XFRAME', function () {
  var server

  afterEach(function (done) {
    if (server) {
      server.close(done)
    } else {
      done()
    }
  })

  it('method', function () {
    assert(typeof lusca.xframe === 'function')
  })

  it('assert error', function () {
    assert.throws(function () {
      lusca.xframe()
    }, /options\.value should be a string/)
  })

  it('header (deny)', function () {
    var config = { xframe: 'DENY' }
    var app = mock(config)

    app.use(function (ctx) {
      ctx.status = 200
    })

    server = app.listen()

    return request(server)
      .get('/')
      .expect('X-FRAME-OPTIONS', config.xframe)
      .expect(200)
  })

  it('header (sameorigin)', function () {
    var config = { xframe: 'SAMEORIGIN' }
    var app = mock(config)

    app.use(function (ctx) {
      ctx.status = 200
    })

    server = app.listen()

    return request(server)
      .get('/')
      .expect('X-FRAME-OPTIONS', config.xframe)
      .expect(200)
  })

  it('header (sameorigin) with options.enable true', function () {
    var enable = function (url) {
      return url.indexOf('/show') >= 0
    }
    var config = { xframe: { value: 'SAMEORIGIN', enable: enable } }
    var app = mock(config)

    app.router.get('/show', function (ctx) {
      ctx.body = 'show'
    })

    server = app.listen()

    return request(server)
      .get('/show')
      .expect('X-FRAME-OPTIONS', config.xframe.value)
      .expect('show')
      .expect(200)
  })

  it('header (sameorigin) with options.enable false', function () {
    var enable = function (url) {
      return url.indexOf('/show') >= 0
    }
    var config = { xframe: { value: 'SAMEORIGIN', enable: enable } }
    var app = mock(config)

    app.use(function (ctx) {
      ctx.status = 200
    })

    server = app.listen()

    return request(server)
      .get('/')
      .expect(200)
      .then(function (res) {
        assert(res.headers['x-frame-options'] === undefined)
      })
  })
})
