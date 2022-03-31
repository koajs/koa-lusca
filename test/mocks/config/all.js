'use strict';

const cspPolicy = require('./cspReport');

module.exports = {
  csrf: true,
  xframe: 'SAMEORIGIN',
  p3p: 'MY_P3P_VALUE',
  hsts: { maxAge: 31536000 },
  csp: cspPolicy,
  xssProtection: true,
  cto: 'nosniff',
  referrerPolicy: 'same-origin'
};
