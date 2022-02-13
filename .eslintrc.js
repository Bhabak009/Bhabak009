module.exports = {
  root: false,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs', 'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    'comma-dangle': [2, 'never'],
    'no-inline-styles': 0,
    'prettier/prettier': 0,
    semi: [2, 'never'],
    'no-debugger': [0, 2],
    'array-element-newline': ['error',
      {
        multiline: true,
        minItems: 3
      }]
  }
}
