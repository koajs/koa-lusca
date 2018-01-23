/*global describe:false, it:false */
'use strict';

var request = require('supertest');
var assert = require('assert');
var lusca = require('..');
var mock = require('./mocks/app');

describe('P3P', function () {
  var server;

  afterEach(function (done) {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

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
    var config = { p3p: 'MY_P3P_VALUE' };
    var app = mock(config);

    app.get('/', function* () {
      this.body = 'hello';
    });

    server = app.listen();

    request(server)
    .get('/')
    .expect('P3P', config.p3p)
    .expect('hello')
    .expect(200, done);
  });

});
