module.exports = {
	root: true,
	env: {
		node: true
	},
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
		'no-unused-vars': [0, { ignoreRestSiblings: true, argsIgnorePattern: '^h$' }],
		'no-dupe-keys': 2,
		'no-func-assign': 2,
		'valid-typeof': 2,
		'no-shadow': 0,
		'no-prototype-builtins': 0,
		'no-undef': 2,
		'no-irregular-whitespace': 1,
		'array-bracket-spacing': [1, 'never'],
		indent: [1, 'tab'],
		strict: ['error', 'safe'],
		'prefer-const': 1,
		'one-var-declaration-per-line': [0, 'always']
	},
	globals: {
		h: true
	},
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module'
		// ecmaVersion: 6,
		// parser: 'babel-eslint'
	},
	extends: 'eslint-config-egg'
}
