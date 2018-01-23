/* eslint-env mocha */

const request = require('supertest')
const assert = require('assert')
const lusca = require('../index')
const mock = require('./mocks/app')

describe('CSRF', function () {
  var server

  afterEach(function (done) {
    if (server) {
      server.close(done)
    } else {
      done()
    }
  })

  it('method', function () {
    assert(typeof lusca.csrf === 'function')
  })

  it('expects a thrown error if no session object', function () {
    var app = mock({
      csrf: true
    }, true)

    server = app.listen()

    return request(server)
      .get('/')
      .expect(500)
  })

  it('GETs have a CSRF token', function () {
    var app = mock({ csrf: true })

    app.router.get('/csrf', function (ctx) {
      ctx.body = {
        token: ctx.state._csrf
      }
    })

    server = app.listen()

    return request(server)
      .get('/csrf')
      .expect(200)
      .then(function (response) {
        assert(response.body.token)
      })
  })

  it('POST (200 OK with token)', async function () {
    var app = mock({ csrf: true })

    app.router.get('/csrf', function (ctx) {
      ctx.body = {
        token: ctx.state._csrf
      }
    })

    app.router.post('/csrf', function (ctx) {
      ctx.body = {
        token: ctx.state._csrf
      }
    })

    server = app.listen()

    const response = await request(server)
      .get('/csrf')
      .expect(200)

    return request(server)
      .post('/csrf')
      .set('Cookie', response.headers['set-cookie'].join(';'))
      .send({
        _csrf: response.body.token
      })
      .expect(200)
  })

  it('POST (403 Forbidden on no token)', function () {
    var app = mock({ csrf: true })

    server = app.listen()

    return request(server)
      .post('/')
      .expect(403)
  })

  it('should allow custom keys (session type: {value})', async function () {
    var app = mock({
      csrf: {
        key: 'foobar'
      }
    })

    app.router.use(function (ctx) {
      ctx.body = {
        token: ctx.state.foobar
      }
    })

    server = app.listen()

    const response = await request(server)
      .get('/csrf')
      .expect(200)

    return request(server)
      .post('/csrf')
      .set('cookie', response.headers['set-cookie'].join(';'))
      .send({
        foobar: response.body.token
      })
      .expect(200)
  })

  it('token can be sent through header instead of post body (session type: {value})', async function () {
    var app = mock({ csrf: true })
    app.router.use(function (ctx) {
      ctx.body = {
        token: ctx.state._csrf
      }
    })

    server = app.listen()

    const response = await request(server)
      .get('/csrf')
      .expect(200)

    return request(server)
      .post('/csrf')
      .set('cookie', response.headers['set-cookie'].join(';'))
      .set('x-csrf-token', response.body.token)
      .send({
        name: 'Test'
      })
      .expect(200)
  })

  it('should allow custom headers (session type: {value})', async function () {
    var app = mock({
      csrf: {
        header: 'x-xsrf-token',
        secret: 'csrfSecret'
      }
    })

    app.router.use(function (ctx) {
      ctx.body = {
        token: ctx.state._csrf
      }
    })

    server = app.listen()

    const response = await request(server)
    .get('/csrf')
    .expect(200)

    return request(server)
      .post('/csrf')
      .set('cookie', response.headers['set-cookie'].join(';'))
      .set('x-xsrf-token', response.body.token)
      .send({
        name: 'Test'
      })
      .expect(200)
  })

  it('should allow custom functions (session type: {value})', async function () {
    var myToken = require('./mocks/token')
    var mockConfig = {
      csrf: {
        impl: myToken
      }
    }
    var app = mock(mockConfig)

    app.router.use(function (ctx) {
      ctx.body = {
        token: ctx.state._csrf
      }
    })

    server = app.listen()

    const response = await request(server)
      .get('/csrf')
      .expect(200)

    assert(myToken.value === response.body.token)

    return request(server)
      .post('/csrf')
      .set('cookie', response.headers['set-cookie'].join(';'))
      .send({
        _csrf: response.body.token
      })
      .expect(200)
  })
})
