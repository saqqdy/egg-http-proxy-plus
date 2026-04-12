'use strict'

exports.keys = '123456'

exports.httpProxyPlus = {
  '/proxy1': 'http://localhost:3000',
  '/api/proxy2': {
    target: 'http://localhost:3001',
    pathRewrite: { '^/api': '' },
  },
  '/data': 'http://localhost:3002',
  '/custom': {
    target: 'http://localhost:3003',
    onProxyReq(proxyReq, req, res, ctx) {
      // Pass through custom headers
      const customHeader = ctx.get('x-custom')
      if (customHeader) {
        proxyReq.setHeader('X-Custom', customHeader)
      }
    },
  },
}
