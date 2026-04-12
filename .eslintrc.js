'use strict'

module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        commonjs: true,
        es2020: true
    },
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020
    },
    extends: 'eslint-config-egg',
    rules: {
        'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
        'no-debugger': 1,
        semi: [2, 'never'],
        'comma-dangle': 'off',
        'one-var': [
            'warn',
            {
                var: 'always',
                let: 'always',
                const: 'never'
            }
        ],
        'no-throw-literal': 0,
        'no-new-wrappers': 2,
        'no-useless-escape': 0,
        'no-redeclare': 2,
        'no-tabs': 0,
        'no-mixed-spaces-and-tabs': 1,
        'space-before-function-paren': [0, 'always'],
        'object-shorthand': 2,
        'no-unused-vars': [
            2,
            { ignoreRestSiblings: true, argsIgnorePattern: '^h$' }
        ],
        'no-dupe-keys': 2,
        'no-func-assign': 2,
        'valid-typeof': 2,
        'no-shadow': 0,
        'no-prototype-builtins': 0,
        'no-undef': 2,
        'no-irregular-whitespace': 1,
        indent: [1, 4],
        'array-bracket-spacing': [1, 'never']
    },
    globals: {
        h: true
    }
}
