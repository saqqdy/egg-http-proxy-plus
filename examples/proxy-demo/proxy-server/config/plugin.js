'use strict'

const path = require('path')

/** @type Egg.EggPlugin */
module.exports = {
    // Enable httpProxyPlus plugin
    httpProxyPlus: {
        enable: true,
        path: path.join(__dirname, '../../../..')
    }
}