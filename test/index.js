/* eslint-env mocha */

const request = require('supertest')
const assert = require('assert')
const lusca = require('../index')
const mock = require('./mocks/app')

describe('All', function () {
  var server

  afterEach(function (done) {
    if (server) {
      server.close(done)
    } else {
      done()
    }
  })

  it('method', function () {
    assert(typeof lusca === 'function')
  })

  it('headers', function () {
    var config = require('./mocks/config/all')
    var app = mock(config)

    app.use(function (ctx) {
      ctx.status = 200
    })

    server = app.listen()

    return request(server)
      .get('/')
      .expect('X-FRAME-OPTIONS', config.xframe)
      .expect('P3P', config.p3p)
      .expect('Strict-Transport-Security', 'max-age=' + config.hsts.maxAge)
      .expect('Content-Security-Policy-Report-Only', 'default-src *; report-uri ' + config.csp.reportUri)
      .expect('X-XSS-Protection', '1; mode=block')
      .expect(200)
  })
})
