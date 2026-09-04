// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')
const prettierConfig = require('eslint-config-prettier')
const simpleImportSort = require('eslint-plugin-simple-import-sort')

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    ignores: ['dist/*'],
  },
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Framework (react, react-native, expo-*)
            ['^react$', '^react-native$', '^expo'],
            // Third-party
            ['^@?\\w'],
            // Local (@/*)
            ['^@/'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
])
