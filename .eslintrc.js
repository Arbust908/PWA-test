module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'plugin:vue/vue3-recommended',
        'eslint:recommended',
        '@vue/typescript/recommended',
        // Add under other rules
        '@vue/prettier',
        '@vue/prettier/@typescript-eslint',
    ],
    // parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
    },
    plugins: ['@typescript-eslint'],
    rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'css.lint.unknownAtRules': 'off',
        'consistent-return': 'off',
        'import/no-cycle': 'off',
        'import/prefer-default-export': 'off',
        'no-param-reassign': [2, { props: false }],
        'padding-line-between-statements': [
            'error',
            { blankLine: 'always', prev: '*', next: 'if' },
            { blankLine: 'always', prev: '*', next: 'return' },
            { blankLine: 'always', prev: '*', next: 'function' },
            { blankLine: 'always', prev: '*', next: 'try' },
        ],
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        'class-methods-use-this': 'off',
        'lines-between-class-members': 'off',
        curly: 'error',
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
            typescript: {
                project: __dirname,
            },
        },
    },
};
