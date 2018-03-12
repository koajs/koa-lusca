/*global describe:false, it:false */
'use strict';

const request = require('supertest');
const assert = require('assert');
const lusca = require('../index');
const mock = require('./mocks/app');

describe('CSP', function () {
  it('method', function () {
    assert(typeof lusca.csp === 'function');
  });

  it('header (report)', function (done) {
    const config = require('./mocks/config/cspReport');
    const app = mock({ csp: config });

    app.get('/', function* () {
      this.body = 'hello';
    });

    request(app.listen())
    .get('/')
    .expect('Content-Security-Policy-Report-Only', 'default-src *; report-uri ' + config.reportUri)
    .expect('hello')
    .expect(200, done);
  });


  it('header (enforce)', function (done) {
    const config = require('./mocks/config/cspEnforce');
    const app = mock({ csp: config });

    app.get('/', function* () {
      this.body = 'hello';
    });

    request(app.listen())
    .get('/')
    .expect('Content-Security-Policy', 'default-src *')
    .expect('hello')
    .expect(200, done);
  });

  it('string config', function (done) {
    const app = mock({
      csp: {
        policy: 'default-src *'
      }
    });

    app.get('/', function (req, res) {
      res.status(200).end();
    });

    request(app.listen())
    .get('/')
    .expect('Content-Security-Policy', 'default-src *')
    .expect(200, done);
  });

  it('array config', function (done) {
    const app = mock({
      csp: {
        policy: ['default-src *', 'img-src *']
      }
    });

    app.get('/', function* () {
      this.body = 'hello';
    });

    request(app.listen())
    .get('/')
    .expect('Content-Security-Policy', 'default-src *; img-src *')
    .expect(200, done);
  });

  it('nested config', function (done) {
    const app = mock({
      csp: {
        policy: [
        { 'default-src': '*' },
        'img-src *'
        ]
      }
    });
    app.get('/', function* () {
      this.body = 'hello';
    });

    request(app.listen())
    .get('/')
    .expect('Content-Security-Policy', 'default-src *; img-src *')
    .expect(200, done);
  });
});
