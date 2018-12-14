module.exports = {
    "block-scoped-var": "error",
    "no-console": "warn",
    "no-debugger": "error",
    "no-undef": "warn",
    "no-unused-vars": "warn",
    "object-curly-newline": "off",
    "padded-blocks": "off",
    "jsx-quotes": ["error", "prefer-double"],
    "no-lonely-if": "warn",
    "array-callback-return": "off",
    "valid-jsdoc": [
      "error",
      {
        "requireReturn": false
      }
    ],

    "comma-dangle": "off", // 禁止使用拖尾逗号
    "eol-last": ["warn", "always"], // 文件末尾空一行。
    "indent": [2, 4, {"SwitchCase": 1}],  // 4个空格缩进、switch下的case和default增加一个缩进层。
    'space-infix-ops': ['error', {'int32Hint': false}], // 要求中缀操作符周围有空格,设置 int32Hint 选项为 true (默认 false) 允许 a|0 不带空格。// 二元运算符两侧必须有一个空格
    "space-unary-ops": "error", // 一元运算符与操作对象之间不允许有空格
    // 用作代码块起始的左花括号 { 前必须有一个空格。
    "keyword-spacing": ["error", {"after": true}], // if/else/for/while/function/switch/do/try/catch/finally 关键字后，必须有一个空格。
    // 在对象创建时，属性中的 : 之后必须有空格，: 之前不允许有空格
    'no-spaced-func': 'error', // [RULE009] 函数声明、具名函数表达式、函数调用中，函数名和 ( 之间不允许有空格。
    "comma-spacing": ["error", {"before": false, "after": true}], //  , 前不允许有空格。
    //  ; 前不允许有空格。
    "space-in-parens": ["error", "never"], // 在函数调用、函数声明、括号表达式、属性访问、if/for/while/switch/catch 等语句中，() 内紧贴括号部分不允许有空格。
    "array-bracket-spacing": ["error", "never"],// 在函数调用、函数声明、括号表达式、属性访问、if/for/while/switch/catch 等语句中， [] 内紧贴括号部分不允许有空格。
    "block-spacing": ["error", "never"],// 单行声明的数组与对象，如果包含元素，[] 内紧贴括号部分不允许包含空格。
    "object-curly-spacing": ["error", "never"],// 单行声明的数组与对象，如果包含元素，{} 内紧贴括号部分不允许包含空格。
    "no-trailing-spaces": ["error", {"skipBlankLines": true}], //  [RULE013] 行尾不得有多余的空格。
    'newline-per-chained-call': ['error', { 'ignoreChainWithDepth': 2 }], //要求方法链中每个调用都有一个换行符 // 每个独立语句结束后必须换行。
    "max-len": ["error", 120],  // [RULE015] 每行不得超过 120 个字符。
    "operator-linebreak": ["error", "before"], // 运算符处换行时，运算符必须在新行的行首
    "comma-style": ["error", "last"], // [RULE017] 在函数声明、函数表达式、函数调用、对象创建、数组创建、for语句等场景中，不允许在 , 前换行。
    // [RULE017] 在函数声明、函数表达式、函数调用、对象创建、数组创建、for语句等场景中，不允许在 ; 前换行。
    "semi": "error", // [RULE021] 不得省略语句结束的分号。
    // 在 if/else/for/do/while 语句中，即使只有一行，也不得省略块 {...}。
    // 函数定义结束不允许添加分号
    // IIFE 必须在函数表达式外添加 (，非 IIFE 不得在函数表达式外添加 ( 。
    "camelcase": ["error", {"properties": "always"}], // 变量 使用 Camel命名法, 属性名称为camel
    'no-var': 'error', //用let/const代替var
    'no-const-assign': 'error', //不允许改变用const声明的变量
    'prefer-const': 'error', //如果一个变量不会被重新赋值，最好使用const进行声明。
    'no-use-before-define': 'error', //禁止定义前使用
    'no-cond-assign': 'error', // 禁止在条件语句中出现赋值操作符
    'eqeqeq': 'error', // 使用 === 和 !== 代替 == 和 !=
    "radix": ["error", "always"], // 使用 parseInt 时，必须指定进制。
    'quotes': ['error', 'single'], // [RULE089] 字符串开头和结束使用单引号 '
    'object-shorthand': ['error', 'always'],// [RULE092] 使用对象字面量 {} 创建新 Object 。
    // [RULE094] 对象创建时，如果一个对象的所有 属性 均可以不添加引号，则所有 属性 不得添加引号。
    // 对象创建时，如果任何一个 属性 需要添加引号，则所有 属性 必须添加 ' 。
    'no-prototype-builtins': 'error',// [RULE095] 不允许修改和扩展任何原生对象和宿主对象的原型。
    'no-array-constructor': 'error',// [RULE098] 使用数组字面量 [] 创建新数组，除非想要创建的是指定长度的数组。
    // 遍历数组不使用 for in。
    // 自定义事件的 事件名 必须全小写。
    // 自定义事件只能有一个 event 参数。如果事件需要传递较多信息，应仔细设计事件对象。
    'no-eval': 'warn',// 避免使用直接 eval 函数。
    // 使用 AMD 作为模块定义。
    // 模块 id 必须符合标准。
    // 全局运行环境中，require 必须以 async require 形式调用。
    // 模块定义中只允许使用 local require ，不允许使用 global require 。
    // Package在实现时，内部模块的 require 必须使用 relative id 。
    // 通过 style 对象设置元素样式时，对于带单位非 0 值的属性，不允许省略单位。
}