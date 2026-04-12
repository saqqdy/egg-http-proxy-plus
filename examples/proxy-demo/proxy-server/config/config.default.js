'use strict'

exports.keys = 'proxy-demo-secret-keys-123456'

/**
 * httpProxyPlus 配置示例
 *
 * 配置说明：
 * - 对象形式: { '/path': 'target' 或 { target: '...', ...options } }
 * - 数组形式: [{ origin: '/path', options: '...' 或 {...} }]
 */
exports.httpProxyPlus = {
    // 基础代理 - 直接转发到目标服务器
    '/api/users': {
        target: 'http://localhost:4000',
        pathRewrite: { '^/api': '' },
        changeOrigin: true
    },

    // 请求拦截 - 添加认证头
    '/api/auth': {
        target: 'http://localhost:4000',
        pathRewrite: { '^/api/auth': '' },
        changeOrigin: true,
        onProxyReq(proxyReq, req, res, ctx) {
            // 从 cookie 或 header 获取 token
            const token = ctx.cookies.get('access_token') || ctx.get('authorization')
            if (token) {
                proxyReq.setHeader('Authorization', `Bearer ${token}`)
                console.log('[Proxy] Added Authorization header')
            }
            // 添加自定义头
            proxyReq.setHeader('X-Proxy-By', 'egg-http-proxy-plus')
        }
    },

    // 响应修改
    '/api/headers': {
        target: 'http://localhost:4000',
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
        onProxyRes(proxyRes, req, res, ctx) {
            // 添加响应头
            proxyRes.headers['x-proxy-server'] = 'egg-http-proxy-plus'
            proxyRes.headers['x-proxy-time'] = Date.now()
            console.log('[Proxy] Response status:', proxyRes.statusCode)
        }
    },

    // 错误处理
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

    // 超时设置
    '/api/slow': {
        target: 'http://localhost:4000',
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
        proxyTimeout: 5000 // 5秒超时
    },

    // 文件上传
    '/api/upload': {
        target: 'http://localhost:4000',
        pathRewrite: { '^/api': '' },
        changeOrigin: true
    }
}

// 安全配置
exports.security = {
    csrf: {
        enable: false // 测试环境关闭 CSRF
    }
}

// 日志配置
exports.logger = {
    level: 'INFO',
    consoleLevel: 'DEBUG'
}