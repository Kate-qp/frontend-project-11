import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/*.min.js'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/indent': ['error', 2],
      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/brace-style': ['error', 'allman', { allowSingleLine: false }],
      '@stylistic/block-spacing': 'error',
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/comma-spacing': 'error',
      '@stylistic/comma-dangle': ['error', 'never'],
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^__webpack|^__unused',
          args: 'none',
        },
      ],
      'no-redeclare': 'off',
    },
  },
]
