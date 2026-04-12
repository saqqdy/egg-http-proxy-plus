'use strict'

module.exports = app => {
    const { router, controller } = app

    // 首页 - 显示代理信息
    router.get('/', controller.home.index)

    // 健康检查
    router.get('/health', controller.home.health)

    // 其他路由由 httpProxyPlus 中间件处理
}
