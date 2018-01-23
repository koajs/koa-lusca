/*global describe:false, it:false */
'use strict';

var request = require('supertest');
var assert = require('assert');
var pedding = require('pedding');
var lusca = require('../index');
var mock = require('./mocks/app');

describe('XFRAME', function () {
  var server;

  afterEach(function (done) {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  it('method', function () {
    assert(typeof lusca.xframe === 'function');
  });

  it('assert error', function () {
    assert.throws(function () {
      lusca.xframe();
    }, /options\.value should be a string/);
  });

  it('header (deny)', function (done) {
    var config = { xframe: 'DENY' };
    var app = mock(config);

    server = app.listen();

    request(server)
    .get('/')
    .expect('X-FRAME-OPTIONS', config.xframe)
    .expect(200, done);
  });

  it('header (sameorigin)', function (done) {
    var config = { xframe: 'SAMEORIGIN' };
    var app = mock(config);

    server = app.listen();

    request(server)
    .get('/')
    .expect('X-FRAME-OPTIONS', config.xframe)
    .expect(200, done);
  });

  it('header (sameorigin) with options.enable true', function (done) {
    var enable = function (url) {
      return url.indexOf('/show') >= 0;
    };
    var config = { xframe: { value: 'SAMEORIGIN', enable: enable } };
    var app = mock(config);

    app.get('/show', function* () {
      this.body = 'show';
    });

    server = app.listen();

    request(server)
    .get('/show')
    .expect('X-FRAME-OPTIONS', config.xframe.value)
    .expect('show')
    .expect(200, done);
  });

  it('header (sameorigin) with options.enable false', function (done) {
    var enable = function (url) {
      return url.indexOf('/show') >= 0;
    };
    var config = { xframe: { value: 'SAMEORIGIN', enable: enable } };
    var app = mock(config);

    server = app.listen();

    request(server)
    .get('/')
    .expect(200, function (err, res) {
      assert(!err);
      assert(res.headers['x-frame-options'] === undefined);
      done();
    });
  });
});
