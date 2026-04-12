'use strict'

const mock = require('egg-mock')
const express = require('express')

function startProxyServers() {
  const listeners = []
  const proxy1 = express()
  const proxy2 = express()
  const proxy3 = express()
  const proxy4 = express()

  // GET endpoint
  proxy1.get('/proxy1', (req, res) => {
    res.send('from proxy1')
  })

  // Path rewrite endpoint
  proxy2.get('/proxy2', (req, res) => {
    res.send('from proxy2')
  })

  // POST endpoint
  proxy3.post('/data', express.json(), (req, res) => {
    res.json({
      received: req.body,
      method: 'POST',
    })
  })

  // Custom header endpoint
  proxy4.get('/custom', (req, res) => {
    res.json({
      authorization: req.headers.authorization || null,
      custom: req.headers['x-custom'] || null,
    })
  })

  listeners.push(proxy1.listen(3000))
  listeners.push(proxy2.listen(3001))
  listeners.push(proxy3.listen(3002))
  listeners.push(proxy4.listen(3003))

  return function proxy() {
    listeners.forEach(listener => {
      listener.close()
    })
  }
}

describe('test/http-proxy.test.js', () => {
  let app,
    closeProxyServers

  before(() => {
    closeProxyServers = startProxyServers()
    app = mock.app({
      baseDir: 'apps/http-proxy-test',
    })
    return app.ready()
  })

  after(() => {
    app.close()
    closeProxyServers()
  })

  afterEach(mock.restore)

  describe('basic proxy', () => {
    it('should target proxy1', () => {
      return app.httpRequest().get('/proxy1').expect(200, 'from proxy1')
    })

    it('should target proxy2 with path rewrite', () => {
      return app.httpRequest().get('/api/proxy2').expect(200, 'from proxy2')
    })
  })

  describe('POST request with body', () => {
    it('should proxy POST request with JSON body', () => {
      return app
        .httpRequest()
        .post('/data')
        .send({ name: 'test', value: 123 })
        .expect(200)
        .expect(res => {
          if (!res.body) throw new Error('No response body')
          if (!res.body.received || res.body.received.name !== 'test') {
            throw new Error('Invalid response')
          }
          if (res.body.method !== 'POST') {
            throw new Error('Invalid method')
          }
        })
    })
  })

  describe('custom headers', () => {
    it('should forward custom headers', () => {
      return app
        .httpRequest()
        .get('/custom')
        .set('X-Custom', 'test-value')
        .expect(200)
        .expect(res => {
          if (!res.body) throw new Error('No response body')
          if (res.body.custom !== 'test-value') {
            throw new Error(`Custom header not forwarded: ${res.body.custom}`)
          }
        })
    })
  })

  describe('non-proxy requests', () => {
    it('should pass through non-matched requests', () => {
      return app.httpRequest().get('/').expect(200)
    })
  })
})
