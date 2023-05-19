const mock = require('egg-mock')
const express = require('express')

function startProxyServers() {
	const listeners = []
	const proxy1 = express()
	const proxy2 = express()

	proxy1.get('/proxy1', (req, res) => {
		res.send('from proxy1')
	})

	proxy2.get('/proxy2', (req, res) => {
		res.send('from proxy2')
	})

	listeners.push(proxy1.listen(3000))
	listeners.push(proxy2.listen(3001))

	return function proxy() {
		listeners.forEach(listener => {
			listener.close()
		})
	}
}

describe('test/http-proxy.test.js', () => {
	let app, closeProxyServers

	before(() => {
		closeProxyServers = startProxyServers()
		app = mock.app({
			baseDir: 'apps/http-proxy-test'
		})
		return app.ready()
	})

	after(() => {
		app.close()
		closeProxyServers()
	})

	afterEach(mock.restore)

	it('should target proxy1', () => {
		return app.httpRequest().get('/proxy1').expect(200, 'from proxy1')
	})

	it('should target proxy2 with path rewrite', () => {
		return app.httpRequest().get('/api/proxy2').expect(200, 'from proxy2')
	})
})
