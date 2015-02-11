/**!
 * koa-lusca - lib/xframes.js
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

var assert = require('assert');

/**
 * Xframes
 * https://www.owasp.org/index.php/Clickjacking
 * @param {Object} options
 *  - value {String} The XFRAME header value, e.g. DENY, SAMEORIGIN.
 *  - enable {Function(url)} enable xframe header or not, default is all url enable.
 */
module.exports = function (options) {
  if (typeof options === 'string') {
    options = {
      value: options
    };
  }
  options = options || {};
  var value = options.value;
  assert(typeof value === 'string', 'options.value should be a string');
  var enable = options.enable || function (url) {
    return true;
  };

  return function* xframe(next) {
    if (enable(this.url)) {
      this.set('X-Frame-Options', value);
    }
    yield* next;
  };
};
