'use strict';

var request = require('supertest');
var assert = require('assert');
var lusca = require('../index');
var mock = require('./mocks/app');

describe('xssProtection', function () {
  it('method', function () {
    assert(typeof lusca.xssProtection === 'function');
  });

  it('xssProtection = 1', function (done) {
    var config = { xssProtection: 1 };
    var app = mock(config);

    request(app.listen())
    .get('/')
    .expect('X-XSS-Protection', '1; mode=block')
    .expect(200, done);
  });

  it('header (enabled)', function (done) {
    var config = { xssProtection: true };
    var app = mock(config);

    request(app.listen())
    .get('/')
    .expect('X-XSS-Protection', '1; mode=block')
    .expect(200, done);
  });

  it('header (enabled; custom mode)', function (done) {
    var config = { xssProtection: { enabled: 1, mode: 'foo' } };
    var app = mock(config);

    request(app.listen())
    .get('/')
    .expect('X-XSS-Protection', '1; mode=foo')
    .expect(200, done);
  });

  it('header (enabled is boolean; custom mode)', function (done) {
    var config = { xssProtection: { enabled: true } };
    var app = mock(config);

    request(app.listen())
    .get('/')
    .expect('X-XSS-Protection', '1; mode=block')
    .expect(200, done);
  });

  it('header (!enabled)', function (done) {
    var config = { xssProtection: { enabled: 0 } };
    var app = mock(config);

    request(app.listen())
    .get('/')
    .expect('X-XSS-Protection', '0; mode=block')
    .expect(200, done);
  });
});
