'use strict';

var request = require('supertest');
var assert = require('assert');
var lusca = require('../index');
var mock = require('./mocks/app');

describe('HSTS', function () {
  it('method', function () {
    assert(typeof lusca.hsts === 'function');
  });

  it('assert error when maxAge is not number', function () {
    assert.throws(function () {
      lusca.hsts();
    }, /options\.maxAge should be a number/);
  });

  it('header (maxAge)', function (done) {
    var config = { hsts: { maxAge: 31536000 } };
    var app = mock(config);

    app.get('/', function* () {
      this.body = 'hello';
    });

    request(app.listen())
    .get('/')
    .expect('Strict-Transport-Security', 'max-age=' + config.hsts.maxAge)
    .expect('hello')
    .expect(200, done);
  });

  it('header (maxAge 0)', function (done) {
    var config = { hsts: { maxAge: 0 } };
    var app = mock(config);

    app.get('/', function* () {
      this.body = 'hello';
    });

    request(app.listen())
    .get('/')
    .expect('Strict-Transport-Security', 'max-age=0')
    .expect('hello')
    .expect(200, done);
  });

  it('hsts = number', function (done) {
    var config = { hsts: 31536000 };
    var app = mock(config);

    app.get('/', function* () {
      this.body = 'hello';
    });

    request(app.listen())
    .get('/')
    .expect('Strict-Transport-Security', 'max-age=31536000')
    .expect('hello')
    .expect(200, done);
  });

  it('header (maxAge; includeSubDomains)', function (done) {
    var config = { hsts: { maxAge: 31536000, includeSubDomains: true } };
    var app = mock(config);

    app.get('/', function* () {
      this.body = 'hello';
    });

    request(app.listen())
    .get('/')
    .expect('Strict-Transport-Security', 'max-age=' + config.hsts.maxAge + '; includeSubDomains')
    .expect('hello')
    .expect(200, done);
  });

  it('header (missing maxAge)', function () {
    assert.throws(function () {
      mock({ hsts: {} });
    }, /options\.maxAge should be a number/);
  });
});
