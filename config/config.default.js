/**
 * egg-http-proxy-plus default config
 * @member Config#httpProxyPlus
 * @property {object | Array} httpProxyPlus - Proxy configuration
 *
 * @example
 * // Object style configuration
 * exports.httpProxyPlus = {
 *   '/api': 'http://target.com',
 *   '/v1': { target: 'http://target.com', pathRewrite: { '^/v1': '' } }
 * }
 *
 * // Array style configuration (for more control)
 * exports.httpProxyPlus = [
 *   { origin: '/api', options: 'http://target.com' },
 *   {
 *     origin: pathname => pathname.startsWith('/api'),
 *     options: { target: 'http://target.com' }
 *   }
 * ]
 */
'use strict'

exports.httpProxyPlus = {}
