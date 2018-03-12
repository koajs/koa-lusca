/*global describe:false, it:false */
'use strict';

const request = require('supertest');
const assert = require('assert');
const lusca = require('../index');
const mock = require('./mocks/app');

describe('XFRAME', function () {

  it('method', function () {
    assert(typeof lusca.xframe === 'function');
  });

  it('assert error', function () {
    assert.throws(function () {
      lusca.xframe();
    }, /options\.value should be a string/);
  });

  it('header (deny)', function (done) {
    const config = { xframe: 'DENY' };
    const app = mock(config);

    request(app.listen())
    .get('/')
    .expect('X-FRAME-OPTIONS', config.xframe)
    .expect(200, done);
  });

  it('header (sameorigin)', function (done) {
    const config = { xframe: 'SAMEORIGIN' };
    const app = mock(config);

    request(app.listen())
    .get('/')
    .expect('X-FRAME-OPTIONS', config.xframe)
    .expect(200, done);
  });

  it('header (sameorigin) with options.enable true', function (done) {
    const enable = function (url) {
      return url.indexOf('/show') >= 0;
    };
    const config = { xframe: { value: 'SAMEORIGIN', enable: enable } };
    const app = mock(config);

    request(app.listen())
    .get('/show')
    .expect('X-FRAME-OPTIONS', config.xframe.value)
    .expect('show')
    .expect(200, done);
  });

  it('header (sameorigin) with options.enable false', function (done) {
    const enable = function (url) {
      return url.indexOf('/show') >= 0;
    };
    const config = { xframe: { value: 'SAMEORIGIN', enable: enable } };
    const app = mock(config);

    request(app.listen())
    .get('/')
    .expect(200, function (err, res) {
      assert(!err);
      assert(res.headers['x-frame-options'] === undefined);
      done();
    });
  });
});
