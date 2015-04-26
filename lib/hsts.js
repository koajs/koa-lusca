/**!
 * koa-lusca - lib/hsts.js
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

/**
 * Module dependencies.
 */

var assert = require('assert');

/**
 * HSTS - Http Strict Transport Security
 * https://www.owasp.org/index.php/HTTP_Strict_Transport_Security
 * @param {Object} options
 *   - maxAge {Number} The max age of the header. Required.
 *   - includeSubDomains {Boolean}
 */
module.exports = function (options) {
  if (typeof options === 'number') {
    options = {
      maxAge: options
    };
  }
  options = options || {};
  assert(typeof options.maxAge === 'number', 'options.maxAge should be a number');

  var value = 'max-age=' + options.maxAge;
  if (options.includeSubDomains) {
    value += '; includeSubDomains';
  }
  value += (value && options.preload) ? '; preload' : '';

  return function* hsts(next) {
    this.set('Strict-Transport-Security', value);
    yield* next;
  };
};
