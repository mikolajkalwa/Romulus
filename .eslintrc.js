module.exports = {
    env: {
        es6: true,
        node: true
    },
    extends: [
        'airbnb-typescript/base'
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: './tsconfig.json'
    },
    plugins: [
        "@typescript-eslint"
    ],
    rules: {
        'no-console': 0,
        'linebreak-style': 0,
        'class-methods-use-this': 0
    }
};