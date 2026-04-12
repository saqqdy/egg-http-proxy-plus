import eslintConfig from '@eslint-sets/eslint-config'

export default eslintConfig({
  type: 'lib',
  ignores: ['examples/**', '**/*.d.ts'],
  markdown: false,
  rules: {
    'test/expect-expect': 'off',
  },
  stylistic: true,
  vue: true,
  typescript: false,
  overrides: [
    {
      files: ['test/**/*.js'],
      languageOptions: {
        globals: {
          describe: 'readonly',
          it: 'readonly',
          before: 'readonly',
          after: 'readonly',
          beforeEach: 'readonly',
          afterEach: 'readonly',
        },
      },
    },
  ],
})
