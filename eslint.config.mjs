import js from '@eslint/js'
import globals from 'globals'

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.browser,
                ...globals.commonjs,
                h: 'writable'
            }
        },
        rules: {
            'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
            'no-debugger': 'warn',
            semi: ['error', 'never'],
            'comma-dangle': 'off',
            'one-var': [
                'warn',
                {
                    var: 'always',
                    let: 'always',
                    const: 'never'
                }
            ],
            'no-throw-literal': 'off',
            'no-new-wrappers': 'error',
            'no-useless-escape': 'off',
            'no-redeclare': 'error',
            'no-tabs': 'off',
            'no-mixed-spaces-and-tabs': 'warn',
            'space-before-function-paren': 'off',
            'object-shorthand': 'error',
            'no-unused-vars': [
                'error',
                { ignoreRestSiblings: true, argsIgnorePattern: '^h$' }
            ],
            'no-dupe-keys': 'error',
            'no-func-assign': 'error',
            'valid-typeof': 'error',
            'no-shadow': 'off',
            'no-prototype-builtins': 'off',
            'no-undef': 'error',
            'no-irregular-whitespace': 'warn',
            indent: ['warn', 4],
            'array-bracket-spacing': ['warn', 'never']
        },
        ignores: [
            'node_modules/**',
            'coverage/**',
            'dist/**',
            'examples/**/node_modules/**',
            'test/fixtures/**/logs/**',
            'test/fixtures/**/run/**'
        ]
    }
]
