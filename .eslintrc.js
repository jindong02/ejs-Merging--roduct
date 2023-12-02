module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    eqeqeq: 0,
    radix: 0,
    'no-continue': 0,
    'no-multi-assign': 0,
    'prefer-destructuring': 0,
    'for-direction': 0,
    'no-console': 0,
    'no-unused-expressions': 0,
    'no-useless-escape': 0,
    'default-param-last': 0,
    'no-restricted-globals': 0,
    'max-len': 0,
    'consistent-return': 0,
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-param-reassign': 0,
    'linebreak-style': 0,
    'no-underscore-dangle': 0,
  },
};
/* eslint  */
// 'max-len': ['error', { code: 200 }],
