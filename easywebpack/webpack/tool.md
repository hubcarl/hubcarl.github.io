---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

Webpack 编译辅助插件

## 特性


- 支持原生 Webpack 配置编译, 支持开发模式(热更新) 和 编译模式

- 支持 Webpack 编译结果 UI 展示 和 访问

- 该插件可以独立使用.

## Install

```bash
$ npm i webpack-tool --save-dev
```

## Webpack Build and Server Tool
 
```js 

// see `webpack-tool` npm plugin
const WebpackTool = require('wepback-tool');

const webpackTool = new WebpackTool();

// webpack build file to dist
webpackTool.build(webpackConfig, options, () => {
  console.log('wepback vue build finished');
});

// webpack building file disk and start build reuslt ui navigation
webpackTool.server(webpackConfig, options, () => {
  console.log('wepback vue build finished');
});
```


## Webpack Build UI Viewer

编译完成, 自动打开编译结果页面 :  http://127.0.0.1:8888/debug

![image](/img/webpack/easywebpack-build-nav.png)