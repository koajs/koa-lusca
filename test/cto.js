/*global describe:false, it:false */
'use strict';

var request = require('supertest');
var assert = require('assert');
var lusca = require('../index');
var mock = require('./mocks/app');

describe('X-Content-Type-Options', function () {
  var server;

  afterEach(function (done) {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  it('method', function () {
    assert(typeof lusca.cto === 'function');
  });

  it('assert fail when value not string', function () {
    assert.throws(
      function () {
        lusca.cto();
      },
      /AssertionError/
    );
  });

  it('header (nosniff)', function (done) {
    var config = { cto: 'nosniff' };
    var app = mock(config);

    app.get('/', function* () {
      this.body = 'hello';
    });

    server = app.listen();

    request(server)
    .get('/')
    .expect('X-Content-Type-Options', config.cto)
    .expect('hello')
    .expect(200, done);
  });
});
