/**!
 * koa-lusca - lib/xssprotection.js
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
 * X-XSS-Protection
 * http://blogs.msdn.com/b/ie/archive/2008/07/02/ie8-security-part-iv-the-xss-filter.aspx
 * @param {Object} options
 *  - enabled {Number} either 1 or 0
 */
module.exports = function (options) {
  if (typeof options === 'number') {
    // options = 1
    options = {
      enabled: options
    };
  } else if (options === true) {
    // options = true
    options = {
      enabled: 1
    };
  }
  options = options || {};

  var enabled = (options.enabled !== undefined) ? +options.enabled : 1;
  var mode = options.mode || 'block';

  var value = enabled + '; mode=' + mode;

  return function* xssProtection(next) {
    this.set('X-XSS-Protection', value);
    yield* next;
  };
};
