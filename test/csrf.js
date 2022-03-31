'use strict';

const request = require('supertest');
const assert = require('assert');
const lusca = require('../index');
const mock = require('./mocks/app');

describe('CSRF', function () {
  it('method', function () {
    assert(typeof lusca.csrf === 'function');
  });

  it('expects a thrown error if no session object', function (done) {
    const app = mock({
      csrf: true
    }, true);

    request(app.listen())
    .get('/')
    .expect(500, done);
  });

  it('GETs have a CSRF token', function (done) {
    const app = mock({ csrf: true });

    request(app.listen())
    .get('/csrf')
    .expect(200)
    .end(function (err, res) {
      assert(!err);
      assert(res.body.token);
      done();
    });
  });

  it('POST (200 OK with token)', function (done) {
    const app = mock({ csrf: true });

    request(app.listen())
    .get('/csrf')
    .expect(200, function (err, res) {
      assert(!err);
      request(app.listen())
      .post('/csrf')
      .set('Cookie', res.headers['set-cookie'].join(';'))
      .send({
        _csrf: res.body.token
      })
      .expect(200, done);
    });
  });

  it('POST (403 Forbidden on no token)', function (done) {
    const app = mock({ csrf: true });

    request(app.listen())
    .post('/')
    .expect(403, done);
  });

  it('should allow custom keys (session type: {value})', function (done) {
    const app = mock({
      csrf: {
        key: 'foobar'
      }
    });

    request(app.listen())
    .get('/csrf-foobar')
    .expect(200, function (err, res) {
      assert(!err);
      request(app.listen())
      .post('/csrf')
      .set('cookie', res.headers['set-cookie'].join(';'))
      .send({
        foobar: res.body.token
      })
      .expect(200, done);
    });
  });

  it('token can be sent through header instead of post body (session type: {value})', function (done) {
    const app = mock({ csrf: true });

    request(app.listen())
    .get('/csrf')
    .expect(200, function (err, res) {
      assert(!err);
      request(app.listen())
      .post('/csrf')
      .set('cookie', res.headers['set-cookie'].join(';'))
      .set('x-csrf-token', res.body.token)
      .send({
        name: 'Test'
      })
      .expect(200, done);
    });
  });

  it('should allow custom headers (session type: {value})', function (done) {
    const app = mock({
      csrf: {
        header: 'x-xsrf-token',
        secret: 'csrfSecret'
      }
    });

    request(app.listen())
    .get('/csrf')
    .expect(200, function (err, res) {
      assert(!err);
      request(app.listen())
      .post('/csrf')
      .set('cookie', res.headers['set-cookie'].join(';'))
      .set('x-xsrf-token', res.body.token)
      .send({
        name: 'Test'
      })
      .expect(200, done);
    });
  });

  it('should allow custom functions (session type: {value})', function (done) {
    const myToken = require('./mocks/token');
    const mockConfig = {
      csrf: {
        impl: myToken
      }
    };
    const app = mock(mockConfig);

    request(app.listen())
    .get('/csrf')
    .expect(200, function (err, res) {
      assert(!err);
      assert(myToken.value === res.body.token);
      request(app.listen())
      .post('/csrf')
      .set('cookie', res.headers['set-cookie'].join(';'))
      .send({
        _csrf: res.body.token
      })
      .expect(200, done);
    });
  });
});
