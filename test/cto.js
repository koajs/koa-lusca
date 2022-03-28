/* eslint-env mocha */

const request = require('supertest')
const assert = require('assert')
const lusca = require('../index')
const mock = require('./mocks/app')

describe('X-Content-Type-Options', function () {
  var server

  afterEach(function (done) {
    if (server) {
      server.close(done)
    } else {
      done()
    }
  })

  it('method', function () {
    assert(typeof lusca.cto === 'function')
  })

  it('assert fail when value not string', function () {
    assert.throws(
      function () {
        lusca.cto()
      },
      /AssertionError/
    )
  })

  it('header (nosniff)', function () {
    var config = { cto: 'nosniff' }
    var app = mock(config)

    app.use(function (ctx) {
      ctx.body = 'hello'
    })

    server = app.listen()

    return request(server)
      .get('/')
      .expect('X-Content-Type-Options', config.cto)
      .expect('hello')
      .expect(200)
  })
})
