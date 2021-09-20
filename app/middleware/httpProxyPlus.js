const { createProxyMiddleware } = require('http-proxy-middleware')
const c2k = require('koa-connect')
const pathMatching = require('egg-path-matching')
const getType = require('js-cool/lib/getType')

module.exports = options => {
    return async (ctx, next) => {
        const path = ctx.request.originalUrl || ctx.request.url
        const optType = getType(options)
        if (optType === 'object') {
            options = Object.keys(options).map(context => ({
                origin: context,
                options: options[context]
            }))
        }
        for (const context of options) {
            let proxyOptions = context.options || {},
                isMatch
            if (typeof proxyOptions === 'string') proxyOptions = { target: proxyOptions }
            const { onProxyReq = null, onProxyRes = null } = proxyOptions
            proxyOptions = {
                ...proxyOptions,
                // eslint-disable-next-line no-unused-vars
                onProxyReq(proxyReq, req, res, context = ctx) {
                    if (onProxyReq && typeof onProxyReq === 'function') {
                        onProxyReq(proxyReq, req, res, ctx)
                    }
                    const { rawBody, body: requestBody } = ctx.request
                    if (requestBody && rawBody) {
                        proxyReq.setHeader('Content-Length', Buffer.byteLength(rawBody))
                        proxyReq.write(rawBody)
                        proxyReq.end()
                    }
                    return proxyReq
                },
                // eslint-disable-next-line no-unused-vars
                onProxyRes(proxyRes, req, res, context = ctx) {
                    if (onProxyRes && typeof onProxyRes === 'function') {
                        onProxyRes(proxyRes, req, res, ctx)
                    }
                    return proxyRes
                }
            }
            if (getType(context.origin) === 'function') {
                // custom matching
                isMatch = context.origin(path.split('?')[0], ctx.req)
            } else {
                // context.origin配置的数组、字符串
                const match = pathMatching({ match: context.origin })
                isMatch = match({ path })
            }
            isMatch && (await c2k(createProxyMiddleware(context.origin, proxyOptions))(ctx, next))
        }
        await next()
    }
}
