/**!
 * koa-lusca - lib/token.js
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

var crypto = require('crypto');
var LENGTH = 10;

function create(ctx, secretKey) {
  if (!ctx.session) {
    throw new Error('lusca requires this.session to be available in order to maintain state');
  }
  var secret = ctx.session[secretKey];
  // Save the secret for validation
  if (!secret) {
    secret = ctx.session[secretKey] = crypto.pseudoRandomBytes(LENGTH).toString('base64');
  }

  return {
    token: tokenize(salt(LENGTH), secret),
    validate: function validate (ctx, token) {
      if (typeof token !== 'string' || !ctx.session || !ctx.session[secretKey]) {
        return false;
      }
      return token === tokenize(token.slice(0, LENGTH), ctx.session[secretKey]);
    }
  };
}

function tokenize(salt, secret) {
  return salt + crypto.createHash('sha1').update(salt + secret).digest('base64');
}

function salt(len) {
  var str = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < len; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}

module.exports = {
  create: create
};
