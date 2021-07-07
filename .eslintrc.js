module.exports = {
  "root": true,
  "env": {
    "node": true,
    "jest": true,
    "es6": true,
  },
  "extends": [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  "rules": {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'linebreak-style': 'off',
    'no-restricted-syntax': 'off',
    'import/prefer-default-export': 'off',
    'prefer-destructuring': 'off',
    'max-len': 'off'
  },
  "parserOptions": {
    parser: 'babel-eslint',
  },
};
