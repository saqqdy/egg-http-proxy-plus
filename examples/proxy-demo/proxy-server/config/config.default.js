'use strict'

exports.keys = 'proxy-demo-secret-keys-123456'

/**
 * httpProxyPlus configuration examples
 *
 * Configuration styles:
 * - Object style: { '/path': 'target' or { target: '...', ...options } }
 * - Array style: [{ origin: '/path', options: '...' or {...} }]
 */
exports.httpProxyPlus = {
    // Basic proxy - direct forwarding to target server
    '/api/users': {
        target: 'http://localhost:4000',
        pathRewrite: { '^/api': '' },
        changeOrigin: true
    },

    // Request interception - add auth header
    '/api/auth': {
        target: 'http://localhost:4000',
        pathRewrite: { '^/api/auth': '' },
        changeOrigin: true,
        onProxyReq(proxyReq, req, res, ctx) {
            // Get token from cookie or header
            const token = ctx.cookies.get('access_token') || ctx.get('authorization')
            if (token) {
                proxyReq.setHeader('Authorization', `Bearer ${token}`)
                console.info('[Proxy] Added Authorization header')
            }
            // Add custom header
            proxyReq.setHeader('X-Proxy-By', 'egg-http-proxy-plus')
        }
    },

    // Response modification
    '/api/headers': {
        target: 'http://localhost:4000',
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
        onProxyRes(proxyRes) {
            // Add response headers
            proxyRes.headers['x-proxy-server'] = 'egg-http-proxy-plus'
            proxyRes.headers['x-proxy-time'] = Date.now()
            console.info('[Proxy] Response status:', proxyRes.statusCode)
        }
    },

    // Error handling
    '/api/error': {
        target: 'http://localhost:4000',
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
        onError(err, req, res) {
            console.error('[Proxy Error]', err.message)
            res.writeHead(502, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({
                code: 502,
                message: 'Proxy Error',
                error: err.message
            }))
        }
    },

    // Timeout settings
    '/api/slow': {
        target: 'http://localhost:4000',
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
        proxyTimeout: 5000 // 5 seconds timeout
    },

    // File upload
    '/api/upload': {
        target: 'http://localhost:4000',
        pathRewrite: { '^/api': '' },
        changeOrigin: true
    }
}

// Security config
exports.security = {
    csrf: {
        enable: false // Disable CSRF for test environment
    }
}

// Logger config
exports.logger = {
    level: 'INFO',
    consoleLevel: 'DEBUG'
}
