/* eslint-disable quote-props */
module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    // "jest/globals": true
  },
  'extends': [
    'react-app',
    // "eslint:recommended",
    // "plugin:react/recommended"
    'plugin:jsx-a11y/recommended',
    'airbnb',
    'airbnb/hooks',
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 2018,
    'sourceType': 'module',
  },
  'plugins': [
    'react',
    'jsx-a11y',
    // "jest"
  ],
  'rules': {
    'react/jsx-filename-extension': [
      1,
      { 'extensions': ['.js', '.jsx'] },
    ],
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        'labelComponents': [],
        'labelAttributes': [],
        'controlComponents': [],
        'assert': 'either', // 'htmlFor', 'nesting', 'both'
        'depth': 25,
      },
    ],
  //     "indent": [
  //         "error",
  //         2
  //     ],
  //     "linebreak-style": [
  //         "error",
  //         "unix"
  //     ],
  //     "quotes": [
  //         "error",
  //         "single"
  //     ],
  //     "semi": [
  //         "error",
  //         "never"
  //     ],
  //     "eqeqeq": "error",
  //     "no-trailing-spaces": "error",
  //     "object-curly-spacing": [
  //         "error", "always"
  //     ],
  //     "arrow-spacing": [
  //         "error", { "before": true, "after": true }
  //     ],
  //     "no-console": 0,
  //     "react/prop-types": 0
  },
  'settings': {
    'react': {
      'version': 'detect',
    },
  },
};
