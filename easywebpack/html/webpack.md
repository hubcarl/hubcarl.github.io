---
layout: webpack/html
description: "专注于技术,切不能沉迷于技术!"
---

## 基于 Webpack 原始配置构建

### Webpack 原始配置编写

```js
// webpack.config.js
const easywebpack = require('easywebpack-html');
const webpack = easywebpack.webpack;
const merge = easywebpack.merge;
const env = process.env.BUILD_ENV;
const baseWebpackConfig = easywebpack.getWebpackConfig({
    env, // 根据环境变量生成对应配置，可以在 npm script 里面配置，支持dev, test, prod 模式
    entry: 'src/page',
    template: 'src/view/layout.html', // html 模板
    loaders: {
      eslint: false // 举例
    },
    plugins:{
      imagemini: false // 举例
    }
});

// 拿到基础配置, 可以进行二次加工
const webpackConfig = merge(baseWebpackConfig, { 
  // 自定义配置
})

module.exports = webpackConfig;
```


### `package.json`

```js
 {
   "script" :{
      "build:dev": "cross-env BUILD_ENV=dev NODE_ENV=development webpack --config webpack.config.js",
      "build:test": "cross-env BUILD_ENV=test NODE_ENV=development webpack --config webpack.config.js",
      "build": "cross-env BUILD_ENV=prod NODE_ENV=production webpack --config webpack.config.js"
   }
 }
```