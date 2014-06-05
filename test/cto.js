/*global describe:false, it:false */
'use strict';


var lusca = require('../index'),
    request = require('supertest'),
    assert = require('assert'),
    mock = require('./mocks/app');


describe('X-Content-Type-Options', function () {

    it('method', function () {
        assert(typeof lusca.cto === 'function');
    });


    it('header (nosniff)', function (done) {
        var config = { cto: 'nosniff' },
            app = mock(config);

        app.get('/', function (req, res) {
            res.send(200);
        });

        request(app)
            .get('/')
            .expect('X-Content-Type-Options', config.cto)
            .expect(200, done);
    });
});
