'use strict';


/**
 * Xframes
 * https://www.owasp.org/index.php/Clickjacking
 * @param {String} value The XFRAME header value, e.g. DENY, SAMEORIGIN.
 */
module.exports = function (value) {
    var options = value;
    var enable = function (url) {
      return true;
    };

    if (typeof options === 'object') {
        value = options.value;
        enable = options.enable || enable;
    }

    if (options.koa) {
        return function* xframe(next) {
            if (enable(this.url)) {
                this.set('X-Frame-Options', value);
            }
            yield* next;
        };
    }

    return function xframe(req, res, next) {
        if (enable(req.url)) {
            res.header('X-Frame-Options', value);
        }
        next();
    };
};
