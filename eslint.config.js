// eslint.config.js
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      '@stylistic': stylistic,
      prettier: prettierPlugin
    },
    rules: {
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/indent': ['error', 2],
      'prettier/prettier': [
        'error',
        {
          printWidth: 100,
          singleQuote: true,
          trailingComma: 'none',
          arrowParens: 'avoid'
        }
      ]
    }
  },
  js.configs.recommended,
  prettierConfig,
  {
    ignores: ['node_modules/**', '*.min.js']
  }
]
