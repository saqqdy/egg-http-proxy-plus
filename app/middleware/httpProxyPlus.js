const { createProxyMiddleware } = require('http-proxy-middleware')
const c2k = require('koa-connect')
const pathMatching = require('egg-path-matching')

const getType = obj => {
	const type = {
		'[object Array]': 'array',
		'[object Boolean]': 'boolean',
		'[object Date]': 'date',
		'[object Function]': 'function',
		'[object Number]': 'number',
		'[object Object]': 'object',
		'[object RegExp]': 'regexp',
		'[object String]': 'string'
	}
	if (obj === null) return obj + ''
	return typeof obj === 'object' || typeof obj === 'function' ? type[Object.prototype.toString.call(obj)] || 'object' : typeof obj
}

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
