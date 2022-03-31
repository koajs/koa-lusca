/*global describe:false, it:false */
'use strict';

const request = require('supertest');
const assert = require('assert');
const lusca = require('..');
const mock = require('./mocks/app');

describe('P3P', function () {

  it('method', function () {
    assert(typeof lusca.p3p === 'function');
  });

  it('assert error when p3p value is not a string', function () {
    assert.throws(function () {
      lusca.p3p();
    }, /options\.value should be a string/);
    assert.throws(function () {
      lusca.p3p(123);
    }, /options\.value should be a string/);
    assert.throws(function () {
      lusca.p3p({});
    }, /options\.value should be a string/);
  });

  it('header', function (done) {
    const config = { p3p: 'MY_P3P_VALUE' };
    const app = mock(config);

    request(app.listen())
    .get('/')
    .expect('P3P', config.p3p)
    .expect('hello')
    .expect(200, done);
  });

});
