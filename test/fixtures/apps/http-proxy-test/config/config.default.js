'use strict'

exports.keys = '123456'

exports.httpProxyPlus = {
    '/proxy1': 'http://localhost:3000',
    '/api/proxy2': {
        target: 'http://localhost:3001',
        pathRewrite: { '^/api': '' }
    }
}
