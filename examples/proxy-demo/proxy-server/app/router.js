'use strict'

module.exports = app => {
    const { router, controller } = app

    // Home page - show proxy info
    router.get('/', controller.home.index)

    // Health check
    router.get('/health', controller.home.health)

    // Other routes handled by httpProxyPlus middleware
}