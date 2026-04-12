'use strict'

const Controller = require('egg').Controller

class HomeController extends Controller {
    async index() {
        const { ctx } = this
        ctx.body = {
            message: 'Egg.js Proxy Server',
            proxy: 'http-proxy-plus',
            timestamp: Date.now(),
            endpoints: {
                'GET/ POST /api/users/*': 'Proxy to target server',
                'GET /api/headers': 'View proxy headers',
                'GET /api/slow?delay=N': 'Test timeout',
                'GET /api/error': 'Test error handling',
                'POST /api/upload': 'Test file upload'
            }
        }
    }

    async health() {
        const { ctx } = this
        ctx.body = { status: 'ok', timestamp: Date.now() }
    }
}

module.exports = HomeController
