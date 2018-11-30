module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 6,
        "sourceType": "module"
    },
    "plugins": ["react"],

    "rules": {
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
    },
    "settings": {
        "react": {
            "createClass": "createReactClass",
            "pragma": "React",
            "version": "16.0",
            "flowVersion": "0.53"
        },
        "propWrapperFunctions": ["forbidExtraProps"]
    }
};