/*global describe:false, it:false */
'use strict';

var request = require('supertest');
var assert = require('assert');
var lusca = require('../index');
var mock = require('./mocks/app');

describe('CSP', function () {
  it('method', function () {
    assert(typeof lusca.csp === 'function');
  });

  it('header (report)', function (done) {
    var config = require('./mocks/config/cspReport');
    var app = mock({ csp: config });

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
    var config = require('./mocks/config/cspEnforce');
    var app = mock({ csp: config });

    app.get('/', function* () {
      this.body = 'hello';
    });

    request(app.listen())
    .get('/')
    .expect('Content-Security-Policy', 'default-src *; ')
    .expect('hello')
    .expect(200, done);
  });

  it('array block-all-mixed-content + upgrade insecure', function (done) {
    var app = mock({
      csp: {
        policy: ['block-all-mixed-content', 'upgrade-insecure-requests']
      }
    });

    app.get('/', function (req, res) {
      res.status(200).end();
    });

    request(app.listen())
    .get('/')
    .expect('Content-Security-Policy', 'block-all-mixed-content; upgrade-insecure-requests; ')
    .expect(200, done);
  });

  it('harcoded block-all-mixed-conntent', function (done) {
    var app = mock({
      csp: {
        policy: 'block-all-mixed-content'
      }
    });

    app.get('/', function (req, res) {
      res.status(200).end();
    });

    request(app.listen())
    .get('/')
    .expect('Content-Security-Policy', 'block-all-mixed-content; ')
    .expect(200, done);
  });
});
