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
    .expect('Content-Security-Policy', 'default-src *')
    .expect('hello')
    .expect(200, done);
  });

  it('string config', function (done) {
    var app = mock({
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
    var app = mock({
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
    var app = mock({
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
