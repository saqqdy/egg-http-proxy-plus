'use strict'

module.exports = {
	write: true,
	prefix: '^',
	plugin: 'autod-egg',
	test: ['test', 'benchmark'],
	devdep: ['egg', 'egg-ci', 'egg-bin', 'egg-path-matching', 'autod', 'autod-egg', 'eslint', 'eslint-config-egg', 'http-proxy-middleware', 'koa2-connect', 'lodash', 'webstorm-disable-index'],
	exclude: ['./test/fixtures', './docs', './coverage']
}
