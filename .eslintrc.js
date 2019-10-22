module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 2018,
    parser: 'babel-eslint'
  },
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended',
    'prettier/vue',
    'plugin:prettier/recommended'
  ],
  plugins: [
    'prettier'
  ],
  // add your custom rules here
  rules: {
    'arrow-parens': 'off',
    'no-console': 'off',
    'max-len': ['error', { code: 100 }],
    'no-case-declarations': 'off',
    'spaced-comment': 'error'
  }
}
