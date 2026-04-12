'use strict'

const path = require('path')

/** @type Egg.EggPlugin */
module.exports = {
    // 启用 httpProxyPlus 插件
    httpProxyPlus: {
        enable: true,
        path: path.join(__dirname, '../../../..')
    }
}