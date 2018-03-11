/**!
 * koa-lusca - lib/referrerpolicy.js
 *
 * Copyright(c) 2018 fengmk2 and other contributors.
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
 * See https://www.w3.org/TR/referrer-policy/#referrer-policies
 * @type {Array}
 */
var supportedValues = [
    '',
    'no-referrer',
    'no-referrer-when-downgrade',
    'same-origin',
    'origin',
    'strict-origin',
    'origin-when-cross-origin',
    'strict-origin-when-cross-origin',
    'unsafe-url'
];

/**
 * Default value.
 * @type {String}
 */
var defaultValue = ''; // Browser should fallback to a Referrer Policy defined via other mechanisms elsewhere

/**
 * Referrer-Policy
 * https://scotthelme.co.uk/a-new-security-header-referrer-policy/
 * Specification: https://www.w3.org/TR/referrer-policy/
 * @param {String} value The Referrer-Policy header value, e.g. no-referrer, same-origin, origin.
 */
module.exports = function (value) {
    if (supportedValues.indexOf(value) === -1 && process.env.NODE_ENV !== 'production') {
        throw Error('Referrer-Policy header doesn\'t support value: ' + value);
    }

    return function* referrerpolicy(next) {
        this.set('Referrer-Policy', value || defaultValue);
        yield* next;
    };

};
