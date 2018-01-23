'use strict';

var request = require('supertest');
var assert = require('assert');
var lusca = require('../index');
var mock = require('./mocks/app');

describe('All', function () {
  var server;

  afterEach(function (done) {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  it('method', function () {
    assert(typeof lusca === 'function');
  });

  it('headers', function (done) {
    var config = require('./mocks/config/all'),
    app = mock(config);

    server = app.listen();

    request(server)
    .get('/')
    .expect('X-FRAME-OPTIONS', config.xframe)
    .expect('P3P', config.p3p)
    .expect('Strict-Transport-Security', 'max-age=' + config.hsts.maxAge)
    .expect('Content-Security-Policy-Report-Only', 'default-src *; report-uri ' + config.csp.reportUri)
    .expect('X-XSS-Protection', '1; mode=block')
    .expect('hello')
    .expect(200, done);
  });
});
