/*global describe:false, it:false */
'use strict';


var lusca = require('../index'),
    request = require('supertest'),
    assert = require('assert'),
    pedding = require('pedding'),
    mock = require('./mocks/app');


describe('XFRAME', function () {

    it('method', function () {
        assert(typeof lusca.xframe === 'function');
    });


    it('header (deny)', function (done) {
        var config = { xframe: 'DENY' },
            app = mock(config);

        app.get('/', function (req, res) {
            res.send(200);
        });

        request(app)
            .get('/')
            .expect('X-FRAME-OPTIONS', config.xframe)
            .expect(200, done);
    });


    it('header (sameorigin)', function (done) {
        var config = { xframe: 'SAMEORIGIN' },
            app = mock(config);

        app.get('/', function (req, res) {
            res.send(200);
        });

        request(app)
            .get('/')
            .expect('X-FRAME-OPTIONS', config.xframe)
            .expect(200, done);
    });

    it('header (sameorigin) with options.enable true', function (done) {
        var enable = function (url) {
            return url.indexOf('/show') >= 0;
        };
        var config = { xframe: { value: 'SAMEORIGIN', enable: enable } },
            app = mock(config);

        app.get('/show', function (req, res) {
            res.send(200);
        });

        request(app)
            .get('/show')
            .expect('X-FRAME-OPTIONS', config.xframe.value)
            .expect(200, done);
    });

    it('header (sameorigin) with options.enable false', function (done) {
        var enable = function (url) {
            return url.indexOf('/show') >= 0;
        };
        var config = { xframe: { value: 'SAMEORIGIN', enable: enable } },
            app = mock(config);

        app.get('/', function (req, res) {
            res.send(200);
        });

        request(app)
            .get('/')
            .expect(200, function (err, res) {
                assert(!err);
                assert(res.headers['x-frame-options'] === undefined);
                done();
            });
    });
});
