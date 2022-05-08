module.exports = {
  extends: 'airbnb',
  parser: '@babel/eslint-parser',
  env: {
    jest: true,
  },
  rules: {
    'no-use-before-define': 'off',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    'comma-dangle': 'off'
  },
  globals: {
    fetch: false
  }
};
