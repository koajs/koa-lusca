/**!
 * koa-lusca - lib/csrf.js
 *
 * Copyright(c) 2014 - 2015 fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

/*───────────────────────────────────────────────────────────────────────────*\
│  Copyright (C) 2014 eBay Software Foundation                                │
│                                                                             │
│hh ,'""`.                                                                    │
│  / _  _ \  Licensed under the Apache License, Version 2.0 (the "License");  │
│  |(@)(@)|  you may not use this file except in compliance with the License. │
│  )  __  (  You may obtain a copy of the License at                          │
│ /,'))((`.\                                                                  │
│(( ((  )) ))    http://www.apache.org/licenses/LICENSE-2.0                   │
│ `\ `)(' /'                                                                  │
│                                                                             │
│   Unless required by applicable law or agreed to in writing, software       │
│   distributed under the License is distributed on an "AS IS" BASIS,         │
│   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  │
│   See the License for the specific language governing permissions and       │
│   limitations under the License.                                            │
\*───────────────────────────────────────────────────────────────────────────*/

'use strict';

var token = require('./token');

/**
 * CSRF
 * https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)
 * @param {Object} options
 *  - key {String} The name of the CSRF token in the model. Default "_csrf".
 *  - impl {Object} An object with create/validate methods for custom tokens. Optional.
 *  - header {String} The name of the response header containing the CSRF token. Default "x-csrf-token".
 *  - secret {String} The session key name of secret. Default "_csrfSecret"
 */
module.exports = function (options) {
  options = options || {};
  var key = options.key || '_csrf';
  var impl = options.impl || token;
  var header = options.header || 'x-csrf-token';
  var secret = options.secret || '_csrfSecret';

  return function* csrf(next) {
    //call impl
    var _impl = impl.create(this, secret);
    var validate = impl.validate || _impl.validate;
    var _token = _impl.token || _impl;
    // Set the token
    this.state[key] = _token;

    // Move along for safe verbs
    var method = this.method;
    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
      return yield* next;
    }

    // Validate token
    _token = (this.request.body && this.request.body[key]) || this.get(header);

    if (validate(this, _token)) {
      yield* next;
    } else {
      this.throw(403, new Error('CSRF token mismatch'));
    }
  };
};
