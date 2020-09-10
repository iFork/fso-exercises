/* eslint-disable quote-props */
module.exports = {
    'env': {
        'commonjs': true,
        'es2021': true,
        'node': true,
    },
    // 'extends': 'eslint:recommended',
    'extends': 'airbnb-base',
    'parserOptions': {
        'ecmaVersion': 12,
    },
    'rules': {
        'indent': [
            'error',
            4,
        ],
        'linebreak-style': [
            'error',
            'unix',
        ],
        'quotes': [
            'error',
            'single',
        ],
        'semi': [
            'error',
            'always',
        ],
        'eqeqeq': 'error',
        'no-trailing-spaces': 'error',
        'object-curly-spacing': [
            'error', 'always',
        ],
        'arrow-spacing': [
            'error',
            { 'before': true, 'after': true },
        ],
        'no-unused-vars': [
            'error',
            { 'argsIgnorePattern': '^_' },
        ],
    },
};
