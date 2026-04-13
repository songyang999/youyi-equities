module.exports = {
    env: { node: true },
    globals: { uni: true, wx: true, my: true, swan: true },
    parser: 'vue-eslint-parser',
    parserOptions: { parser: '@typescript-eslint/parser', sourceType: 'module' },
    extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'prettier'],
    plugins: ['vue', '@typescript-eslint'],
    rules: {
        'vue/multi-word-component-names': 0,
        'no-unused-vars': 'off',
        'used-before-define': 'off',
    },
    overrides: [
        {
            files: ['*.ts', '*.vue'],
            rules: {
                'no-undef': 'off',
            },
        },
        {
            files: ['*.vue'],
            parser: 'vue-eslint-parser',
            parserOptions: {
                parser: '@typescript-eslint/parser',
                extraFileExtensions: ['.vue'],
                ecmaVersion: 'latest',
                ecmaFeatures: {
                    jsx: true,
                },
            },
            rules: {
                'no-undef': 'off',
            },
        },
    ],
}
