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

const token = require('./token');

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
  const key = options.key || '_csrf';
  const impl = options.impl || token;
  const header = options.header || 'x-csrf-token';
  const secret = options.secret || '_csrfSecret';

  return async function csrf(ctx, next) {
    //call impl
    const _impl = impl.create(ctx, secret);
    const validate = impl.validate || _impl.validate;
    let _token = _impl.token || _impl;
    // Set the token
    ctx.state[key] = _token;

    // Move along for safe verbs
    const method = ctx.method;
    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
      await next();
      return;
    }

    // Validate token
    _token = (ctx.request.body && ctx.request.body[key]) || ctx.get(header);

    if (validate(ctx, _token)) {
      await next();
    } else {
      ctx.throw(403, new Error('CSRF token mismatch'));
    }
  };
};
