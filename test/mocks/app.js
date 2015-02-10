'use strict';


var express = require('express'),
	cookieParser = require('cookie-parser'),
	cookieSession = require('cookie-session'),
	session = require('express-session'),
	bodyParser = require('body-parser'),
	errorHandler = require('errorhandler'),
	lusca = require('../..');

function createKoa(config) {
    var http = require('http'),
        koa = require('koa'),
        koaMiddlewares = require('koa-middlewares');

    config.koa = true;
    var app = koa();
    app.keys = ['key1', 'key2'];

    app.use(koaMiddlewares.session({ secret: 'abc' }));
    app.use(koaMiddlewares.bodyParser());
    app.use(lusca(config));

    var server = http.createServer();

    server.get = server.all = function (url, fn) {
        app.use(function* router() {
            var ctx = this;
            var res = {
                send: function (status, body) {
                    ctx.body = body;
                    ctx.status = status;
                },
                locals: ctx.locals,
            };

            fn(ctx.req, res);
        });

        server.on('request', app.callback());
    };

    return server;
}

module.exports = function (config, sessionType) {
    if (process.env.APP_MODE === 'koa') {
        return createKoa(config);
    }

    var app = express();

	app.use(cookieParser());
	if (sessionType === undefined || sessionType === 'session') {
		app.use(session({
			secret: 'abc',
			resave: true,
			saveUninitialized: true
		}));
	} else if (sessionType === "cookie") {
		app.use(cookieSession({
			secret: 'abc'
		}));
	}

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: false
	}));
	(config !== undefined) ? app.use(lusca(config)) : console.log('no lusca');
	app.use(errorHandler());

	return app;
};
