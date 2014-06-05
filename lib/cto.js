/**!
 * koa-lusca - lib/cto.js
 *
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

'use strict';

/**
 * Module dependencies.
 */

/**
 * X-Content-Type-Options
 * http://blogs.msdn.com/b/ie/archive/2008/09/02/ie8-security-part-vi-beta-2-update.aspx
 * @param {Object} options
 *    value {String} "nosniff" or not
 */
module.exports = function (value) {
    var options = value;
    if (typeof options === 'object') {
        value = options.value;
    }
    if (options.koa) {
        // koa style middleware
        return function* cto(next) {
            if (value) {
                this.set('X-Content-Type-Options', value);
            }
            yield* next;
        };
    }

    // express style middleware
    return function cto(req, res, next) {
        if (value) {
            res.header('X-Content-Type-Options', value);
        }
        next();
    };
};
