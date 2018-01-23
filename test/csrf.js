'use strict';

var request = require('supertest');
var assert = require('assert');
var lusca = require('../index');
var mock = require('./mocks/app');

describe('CSRF', function () {
  var server;

  afterEach(function (done) {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  it('method', function () {
    assert(typeof lusca.csrf === 'function');
  });

  it('expects a thrown error if no session object', function (done) {
    var app = mock({
      csrf: true
    }, true);

    server = app.listen();

    request(server)
    .get('/')
    .expect(500, done);
  });

  it('GETs have a CSRF token', function (done) {
    var app = mock({ csrf: true });

    app.get('/csrf', function* () {
      this.body = {
        token: this.state._csrf
      };
    });

    server = app.listen();

    request(server)
    .get('/csrf')
    .expect(200)
    .end(function (err, res) {
      assert(!err);
      assert(res.body.token);
      done();
    });
  });

  it('POST (200 OK with token)', function (done) {
    var app = mock({ csrf: true });

    app.get('/csrf', function* () {
      this.body = {
        token: this.state._csrf
      };
    });

    app.post('/csrf', function* () {
      this.body = {
        token: this.state._csrf
      };
    });

    server = app.listen();

    request(server)
    .get('/csrf')
    .expect(200, function (err, res) {
      assert(!err);
      request(server)
      .post('/csrf')
      .set('Cookie', res.headers['set-cookie'].join(';'))
      .send({
        _csrf: res.body.token
      })
      .expect(200, done);
    });
  });

  it('POST (403 Forbidden on no token)', function (done) {
    var app = mock({ csrf: true });

    server = app.listen();

    request(server)
    .post('/')
    .expect(403, done);
  });

  it('should allow custom keys (session type: {value})', function (done) {
    var app = mock({
      csrf: {
        key: 'foobar'
      }
    });

    app.all('/csrf', function* () {
      this.body = {
        token: this.state.foobar
      };
    });

    server = app.listen();

    request(server)
    .get('/csrf')
    .expect(200, function (err, res) {
      assert(!err);
      request(server)
      .post('/csrf')
      .set('cookie', res.headers['set-cookie'].join(';'))
      .send({
        foobar: res.body.token
      })
      .expect(200, done);
    });
  });

  it('token can be sent through header instead of post body (session type: {value})', function (done) {
    var app = mock({ csrf: true });
    app.all('/csrf', function* () {
      this.body = {
        token: this.state._csrf
      };
    });

    server = app.listen();

    request(server)
    .get('/csrf')
    .expect(200, function (err, res) {
      assert(!err);
      request(server)
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
    var app = mock({
      csrf: {
        header: 'x-xsrf-token',
        secret: 'csrfSecret'
      }
    });

    app.all('/csrf', function* () {
      this.body = {
        token: this.state._csrf
      };
    });

    server = app.listen();

    request(server)
    .get('/csrf')
    .expect(200, function (err, res) {
      assert(!err);
      request(server)
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
    var myToken = require('./mocks/token');
    var mockConfig = {
      csrf: {
        impl: myToken
      }
    };
    var app = mock(mockConfig);

    app.all('/csrf', function* () {
      this.body = {
        token: this.state._csrf
      };
    });

    server = app.listen();

    request(server)
    .get('/csrf')
    .expect(200, function (err, res) {
      assert(!err);
      assert(myToken.value === res.body.token);
      request(server)
      .post('/csrf')
      .set('cookie', res.headers['set-cookie'].join(';'))
      .send({
        _csrf: res.body.token
      })
      .expect(200, done);
    });
  });
});
