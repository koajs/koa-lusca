'use strict';

const request = require('supertest');
const assert = require('assert');
const lusca = require('../index');
const mock = require('./mocks/app');

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
    const config = { hsts: { maxAge: 31536000 } };
    const app = mock(config);

    request(app.listen())
    .get('/')
    .expect('Strict-Transport-Security', 'max-age=' + config.hsts.maxAge)
    .expect('hello')
    .expect(200, done);
  });

  it('header (maxAge 0)', function (done) {
    const config = { hsts: { maxAge: 0 } };
    const app = mock(config);

    request(app.listen())
    .get('/')
    .expect('Strict-Transport-Security', 'max-age=0')
    .expect('hello')
    .expect(200, done);
  });

  it('hsts = number', function (done) {
    const config = { hsts: 31536000 };
    const app = mock(config);

    request(app.listen())
    .get('/')
    .expect('Strict-Transport-Security', 'max-age=31536000')
    .expect('hello')
    .expect(200, done);
  });

  it('header (maxAge; includeSubDomains)', function (done) {
    const config = { hsts: { maxAge: 31536000, includeSubDomains: true } };
    const app = mock(config);

    request(app.listen())
    .get('/')
    .expect('Strict-Transport-Security', 'max-age=' + config.hsts.maxAge + '; includeSubDomains')
    .expect('hello')
    .expect(200, done);
  });

  it('header (maxAge; includeSubDomains; preload)', function (done) {
    const config = { hsts: { maxAge: 31536000, includeSubDomains: true, preload: true } };
    const app = mock(config);

    request(app.listen())
    .get('/')
    .expect('Strict-Transport-Security', 'max-age=' + config.hsts.maxAge + '; includeSubDomains; preload')
    .expect('hello')
    .expect(200, done);
  });

  it('header (missing maxAge)', function () {
    assert.throws(function () {
      mock({ hsts: {} });
    }, /options\.maxAge should be a number/);
  });
});
