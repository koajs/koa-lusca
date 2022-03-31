/*global describe:false, it:false */
'use strict';

const request = require('supertest');
const assert = require('assert');
const lusca = require('../index');
const mock = require('./mocks/app');


describe('referrerPolicy', function () {

    it('method', function () {
        assert(typeof lusca.referrerPolicy === 'function');
    });

    it('header (enabled)', function (done) {
        const config = { referrerPolicy: 'no-referrer-when-downgrade' },
            app = mock(config);

        request(app.listen())
            .get('/')
            .expect('referrer-policy', 'no-referrer-when-downgrade')
            .expect(200, done);
    });

    it('header invalid value', function () {
        assert.throws(function () {
            lusca.referrerPolicy('value-with-error');
        }, /Referrer-Policy header doesn't support/);
    });

    it('header invalid value in production doesn\'t throw error', function (done) {
        process.env.NODE_ENV = 'production';
        const config = { referrerPolicy: 'invalid-value' },
            app = mock(config);

        request(app.listen())
            .get('/')
            .expect('referrer-policy', 'invalid-value')
            .expect(200, done);
    });
});
