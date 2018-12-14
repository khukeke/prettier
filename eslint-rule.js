
module.exports = {
    "indent": ["error", 2],   // 缩进使用4个空格
    "quotes": ["error", "single"],   // 强制使用单引号
    "no-unused-vars": "error", // 不使用未定义的变量
    "keyword-spacing": ["error", {"after": true}],  // 关键字后面要加空格
    "eqeqeq": ["error", "always"],   //  使用 === 替代 ==
    "space-infix-ops": "error",      // 字符串拼接操作符之间要留有空格
    "comma-spacing": ["error", {"before": false, "after": true}],  // 逗号后面加空格
    "brace-style": "error", // else 关键字要与花括号保持在同一行
    "curly": "error",  // 多行 if 语句的的括号不能省。
    "operator-linebreak": ["error", "after"],  // 对于三元运算符 ? 和 : 与他们所负责的代码处于同一行
    "one-var": ["error", "never"],   // 每个 var 关键字单独声明一个变量。
    "block-spacing": ["error", "never"],   // 单行代码块两边不加空格
    "comma-dangle": ["error", "never"],   // 不允许有多余的行末逗号
    // 对于变量和函数名统一使用驼峰命名法。  ???

    "comma-style": ["error", "last"], // 始终将逗号置于行末。
    // 点号操作符须与属性需在同一行。
}