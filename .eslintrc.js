module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true
    },
    extends: [
        'plugin:react/recommended',
        'plugin:prettier/recommended',
        'prettier/react'
    ],
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

        eqeqeq: 'error',
        'block-scoped-var': 'error',
        'comma-dangle': 'off',
        'no-eval': 'warn',
        'no-console': 'warn',
        'no-debugger': 'error',
        'no-undef': 'warn',
        'no-unused-vars': 'warn',
        'operator-linebreak': ['error', 'before'],
        indent: [2, 4, {SwitchCase: 1}],
        'max-len': ['error', 120],
        'object-curly-spacing': ['error', 'never'],
        'object-curly-newline': 'off',
        'padded-blocks': 'off',
        'jsx-quotes': ['error', 'prefer-double'],
        'no-lonely-if': 'warn',
        'array-callback-return': 'off',
        'valid-jsdoc': [
            'error',
            {
                requireReturn: false
            }
        ],

        semi: ['error', 'always'], // 始终都要有分号
        'operator-linebreak': ['error', 'before'], // 换行时换行符放在操作符前面
        'max-len': ['error', 120] // 最大长度120
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
