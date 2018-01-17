---
layout: webpack/react
description: "专注于技术,切不能沉迷于技术!"
---

## 基于 `easywebpack-react` 自定义 Webpack 构建



### Webpack 原始配置编写

```js
// webpack.config.js
const easywebpack = require('easywebpack-react');
const webpack = easywebpack.webpack;
const merge = easywebpack.merge;
const env = process.env.BUILD_ENV;
const baseWebpackConfig = easywebpack.getWebpackConfig({
    env, // 根据环境变量生成对应配置，可以在 npm script 里面配置，支持dev, test, prod 模式
    target : 'web', // target: web 表示只获取前端构建 Webpack 配置
    entry:{
        app: 'src/index.js'
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

### 功能说明

这样一份简单的配置具备以下能力

- 支持方式启动 Webpack dev server
- 支持 dev, test, prod 三种环境构建
- 支持es6, babel, postcss, eslint 能力
- 支持开发期热更新能力,同时Webpack 构建文件不落地磁盘
- 支持 图片压缩,js压缩, css压缩, extract能力
