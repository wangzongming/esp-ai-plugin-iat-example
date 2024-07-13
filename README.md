# esp-ai-plugin-iat-example [![npm](https://img.shields.io/npm/v/esp-ai-plugin-iat-example.svg)](https://www.npmjs.com/package/esp-ai-plugin-iat-example) [![npm](https://img.shields.io/npm/dm/esp-ai-plugin-iat-example.svg?style=flat)](https://www.npmjs.com/package/esp-ai-plugin-iat-example)

ESP-AI 语音识别插件开发案例

# 安装
在你的 `ESP-AI` 项目中执行下面命令
```
npm i esp-ai-plugin-iat-example
```

# 使用 
```
const espAi = require("esp-ai"); 

espAi({
    ... 

    plugins: [ 
        require("esp-ai-plugin-iat-example")
    ]
});
```
 