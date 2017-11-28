---
layout: webpack/qa
description: "专注于技术,切不能沉迷于技术!"
---


## 常见问题

### 1. Egg + Vue/React 启动端口修改

Egg 应用本地开发时, npm start 默认启动打开浏览器的端口是 7001, 如果要修改自动打开的端口为6001, 可以在 `config/config.local.js` 中 添加 端口配置

 
```js
// ${app_root}/config/config.local.js
exports.webpack = {
  appPort: 6001
  webpackConfigList: EasyWebpack.getWebpackConfig()
};
```

`egg-webpack` 启动打开浏览器的取端口逻辑: `this.config.webpack.appPort || process.env.PORT || 7001`


### 2. 多项目开发时, 端口占用问题

在 Egg + Webpack 项目开发过程中, 会用到 7001, 9000, 9001 三个端口

- 7001 是 Egg 应用启动的默认端口
- 9000, 9001 是 Webpack 启动 Webpack dev server 的端口, 9000 为 构建前端渲染js, 9001 构建后端渲染逻辑.

如果有两个项目同时开发, 第二个项目需要修改这三个端口, 假如 egg 应用: 5000,  Webpack 构建 9100 和 9101

- 修改 Egg 应用端口为 5000

Egg 应用默认会读取  `process.env.PORT` 变量, 这里我们新起一个环境变量或者直接写 5000

```js
// ${app_root}/index.js
require('egg').startCluster({
  baseDir: __dirname,
  port: process.env.EGG_PORT || 5000
});
```

- 修改 Webpack dev server 端口

```js
// ${app_root}/config/config.local.js
exports.webpack = {
  port: 9100, 
  appPort: 5000,
  webpackConfigList: EasyWebpack.getWebpackConfig()
};
```

- 为了让热更新生效,需要修改 `webpack.config.js` 的 port 配置

```js
// ${app_root}/webpack.config.js
exports.webpack = {
  port: 9100, 
  ......
};
```