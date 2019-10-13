module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    "ecmaVersion": 2018
  },
  env: {
    "es6": true
  },
  extends: [
    'prettier',
    'plugin:prettier/recommended'
  ],
  plugins: [
    'prettier'
  ],
  // add your custom rules here
  rules: {
    'arrow-parens': "off",
    'no-console': 'off',
    'max-len': ['error', { code: 100 }]
  }
}
