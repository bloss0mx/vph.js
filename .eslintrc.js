module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2017,
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            1,
            2,
            { SwitchCase: 1 }
        ],
        "linebreak-style": [
            1,
            "unix"
        ],
        "quotes": [
            1,
            "single"
        ],
        "semi": [
            1,
            "always"
        ],
        "no-eval": [
            2,
            { "allowIndirect": true }//允许间接调用
        ],
        "no-unused-vars": [
            1
        ],
        "no-console": [
            1
        ],
        "no-empty": [
            1
        ]
    }
};