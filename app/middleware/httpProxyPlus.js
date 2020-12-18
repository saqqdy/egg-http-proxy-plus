const proxy = require('http-proxy-middleware')
const c2k = require('koa2-connect')
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
	return async function httpProxyPlus(ctx, next) {
		const path = ctx.request.originalUrl || ctx.request.url
		const optType = getType(options)
		if (optType === 'array') {
			options.forEach(context => {
				let proxyOptions = context.options || {}
				if (typeof proxyOptions === 'string') proxyOptions = { target: proxyOptions }
				const { onProxyReq = null, onProxyRes = null } = Object.assign({}, proxyOptions)
				if (onProxyReq) proxyOptions.onProxyReq = (...args) => onProxyReq.call(null, ctx, ...args)
				if (onProxyRes) proxyOptions.onProxyRes = (...args) => onProxyRes.call(null, ctx, ...args)
				if (getType(context.origin) === 'function') {
					// custom matching
					const isMatch = context.origin(path.split('?')[0], ctx.req)
					isMatch && c2k(proxy(context.origin, proxyOptions))(ctx, next)
					return isMatch
				}
				// context.origin配置的数组、字符串
				const match = pathMatching({ match: context.origin })
				const isMatch = match({ path })
				if (isMatch) {
					c2k(proxy(context.origin, proxyOptions))(ctx, next)
				}
				return isMatch
			})
		} else if (optType === 'object') {
			;[('enable', 'match', 'ignore')].forEach(el => {
				if (options.hasOwnProperty(el)) delete options[el]
			})
			Object.keys(options).some(async context => {
				const match = pathMatching({ match: context })
				const isMatch = match({ path })
				if (isMatch) {
					let proxyOptions = options[context]
					if (typeof proxyOptions === 'string') proxyOptions = { target: proxyOptions }
					const { onProxyReq = null, onProxyRes = null } = Object.assign({}, proxyOptions)
					if (onProxyReq) proxyOptions.onProxyReq = (...args) => onProxyReq.call(null, ctx, ...args)
					if (onProxyRes) proxyOptions.onProxyRes = (...args) => onProxyRes.call(null, ctx, ...args)
					await c2k(proxy(context, proxyOptions))(ctx, next)
				}
				return isMatch
			})
		}
		await next()
	}
}
