const { createProxyMiddleware } = require('http-proxy-middleware')
const c2k = require('koa2-connect')
const pathMatching = require('egg-path-matching')
const omit = require('lodash/omit')

module.exports = options => {
	return async function httpProxyPlus(ctx, next) {
		const proxyTable = omit(options, ['enable', 'match', 'ignore'])
		const path = ctx.request.originalUrl || ctx.request.url

		Object.keys(proxyTable).some(context => {
			const match = pathMatching({ match: context })
			const isMatch = match({ path })

			if (isMatch) {
				let proxyOptions = proxyTable[context]
				if (typeof proxyOptions === 'string') {
					proxyOptions = { target: proxyOptions }
				}
				c2k(createProxyMiddleware(context, proxyOptions))(ctx, next)
			}

			return isMatch
		})

		await next()
	}
}
