/**!
 * koa-lusca - lib/csp.js
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
 * Parse Policy Rules
 * @param {Object} policyRules
 * @api private
 */
function parsePolicyRules(policyRules) {
  if (Array.isArray(policyRules)) {
    return policyRules.join('; ') + '; ';
  } else {
    var value = '', key;

    for (key in policyRules) {
      value += key + ' ' + policyRules[key] + '; ';
    }

    return value;
  }
}

/**
 * Content Security Policy (CSP)
 * https://www.owasp.org/index.php/Content_Security_Policy
 * @param {Object} options The CSP policy.
 */
module.exports = function (options) {
  options = options || {};
  var policyRules = options.policy;
  var value = '';
  var name = 'Content-Security-Policy';

  if (options.reportOnly) {
    name += '-Report-Only';
  }

  if (typeof policyRules === 'object') {
    value += parsePolicyRules(policyRules);
  } else {
    value += policyRules + '; ';
  }

  if (options.reportUri) {
    value += 'report-uri ' + options.reportUri;
  }

  return function* csp(next) {
    this.set(name, value);
    yield* next;
  };
};
