const { egg: config } = require('eslint-config-sets')
module.exports = Object.assign(config, {
    rules: {
        semi: [2, 'never'],
        indent: [1, 4],
        'array-bracket-spacing': [1, 'never'],
        'comma-dangle': [2, 'never']
    }
})
