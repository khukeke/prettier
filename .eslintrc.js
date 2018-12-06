module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true
    },
    extends: ['plugin:react/recommended', 'plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
            impliedStrict: true
        }
    },
    plugins: ['react'],
    rules: {
        // "prettier/prettier": "error",
        indent: ['error', 4], // 缩进使用4个空格
        'no-unused-vars': 'error', // 不使用未定义的变量
        'keyword-spacing': ['error', {after: true}], // 关键字后面要加空格
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'], // 强制使用单引号
        semi: ['error', 'always'],
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error'
    },
    settings: {
        react: {
            createClass: 'createReactClass',
            pragma: 'React',
            version: '16.0',
            flowVersion: '0.53'
        },
        propWrapperFunctions: ['forbidExtraProps']
    }
};
