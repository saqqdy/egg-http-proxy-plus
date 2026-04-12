'use strict'

const { createProxyMiddleware } = require('http-proxy-middleware')
const c2k = require('koa-connect')
const pathMatching = require('egg-path-matching')
const getType = require('js-cool/lib/getType')

/**
 * Normalize proxy options configuration
 * @param {Object|Array} options - Proxy configuration
 * @return {Array} Normalized configuration array
 */
function normalizeOptions(options) {
    if (getType(options) === 'object') {
        return Object.keys(options).map(context => ({
            origin: context,
            options: options[context]
        }))
    }
    return options
}

/**
 * Build proxy options with event handlers
 * @param {Object|string} proxyOptions - Proxy options or target string
 * @param {Object} ctx - Koa context
 * @return {Object} Processed proxy options
 */
function buildProxyOptions(proxyOptions, ctx) {
    if (typeof proxyOptions === 'string') {
        proxyOptions = { target: proxyOptions }
    }

    const { onProxyReq = null, onProxyRes = null } = proxyOptions

    return {
        ...proxyOptions,
        /**
         * Handle proxy request event
         * @param {Object} proxyReq - Proxy request object
         * @param {Object} req - Original request
         * @param {Object} res - Response object
         */
        onProxyReq(proxyReq, req, res) {
            if (onProxyReq && typeof onProxyReq === 'function') {
                onProxyReq(proxyReq, req, res, ctx)
            }
            // Handle request body for POST/PUT methods
            const { rawBody, body: requestBody } = ctx.request
            if (requestBody && rawBody) {
                proxyReq.setHeader('Content-Length', Buffer.byteLength(rawBody))
                proxyReq.write(rawBody)
                proxyReq.end()
            }
        },
        /**
         * Handle proxy response event
         * @param {Object} proxyRes - Proxy response object
         * @param {Object} req - Original request
         * @param {Object} res - Response object
         */
        onProxyRes(proxyRes, req, res) {
            if (onProxyRes && typeof onProxyRes === 'function') {
                onProxyRes(proxyRes, req, res, ctx)
            }
        }
    }
}

/**
 * Check if path matches the context
 * @param {Object} context - Context configuration
 * @param {string} path - Request path
 * @param {Object} ctx - Koa context
 * @return {boolean} Match result
 */
function isPathMatch(context, path, ctx) {
    if (getType(context.origin) === 'function') {
        // Custom matching function
        return context.origin(path.split('?')[0], ctx.req)
    }
    // String or array matching via egg-path-matching
    const match = pathMatching({ match: context.origin })
    return match({ path })
}

/**
 * Egg.js HTTP proxy middleware
 * @param {Object|Array} options - Proxy configuration
 * @return {Function} Koa middleware
 */
module.exports = options => {
    // Pre-normalize options for better performance
    const normalizedConfigs = normalizeOptions(options)

    return async (ctx, next) => {
        const path = ctx.request.originalUrl || ctx.request.url

        for (const context of normalizedConfigs) {
            if (isPathMatch(context, path, ctx)) {
                const proxyOptions = buildProxyOptions(context.options, ctx)
                // http-proxy-middleware v3: pass context as part of options
                const middleware = createProxyMiddleware({
                    ...proxyOptions,
                    context: context.origin
                })
                await c2k(middleware)(ctx, next)
                // Return early to prevent double next() call
                return
            }
        }

        await next()
    }
}
