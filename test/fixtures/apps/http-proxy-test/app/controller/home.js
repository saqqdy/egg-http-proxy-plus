const Controller = require('egg').Controller

class HomeController extends Controller {
	async index() {
		this.ctx.body = 'hi, ' + this.app.plugins.httpProxyPlus.name
	}
}

module.exports = HomeController
