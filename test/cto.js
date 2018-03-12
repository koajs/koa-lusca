/*global describe:false, it:false */
'use strict';

const request = require('supertest');
const assert = require('assert');
const lusca = require('../index');
const mock = require('./mocks/app');

describe('X-Content-Type-Options', function () {
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
    const config = { cto: 'nosniff' };
    const app = mock(config);

    app.get('/', function* () {
      this.body = 'hello';
    });

    request(app.listen())
    .get('/')
    .expect('X-Content-Type-Options', config.cto)
    .expect('hello')
    .expect(200, done);
  });
});
