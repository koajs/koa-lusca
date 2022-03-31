'use strict';

const request = require('supertest');
const assert = require('assert');
const lusca = require('../index');
const mock = require('./mocks/app');

describe('All', function () {

  it('method', function () {
    assert(typeof lusca === 'function');
  });

  it('headers', function (done) {
    const config = require('./mocks/config/all'),
    app = mock(config);

    request(app.listen())
    .get('/')
    .expect('X-FRAME-OPTIONS', config.xframe)
    .expect('P3P', config.p3p)
    .expect('Strict-Transport-Security', 'max-age=' + config.hsts.maxAge)
    .expect('Content-Security-Policy-Report-Only', 'default-src *; report-uri ' + config.csp.reportUri)
    .expect('X-XSS-Protection', '1; mode=block')
    .expect('X-Content-Type-Options', 'nosniff')
    .expect('Referrer-Policy', 'same-origin')
    .expect('hello')
    .expect(200, done);
  });
});
