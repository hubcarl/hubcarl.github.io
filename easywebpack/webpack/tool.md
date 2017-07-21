---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---


## Webpack Build and Server Tool
 
```js 

// see `webpack-tool` npm plugin
const WebpackTool = require('wepback-tool');

const webpackTool = new WebpackTool();

// webpack build file to dist
webpackTool.build([clientConfig, serverConfig], () => {
  console.log('wepback vue build finished');
});

// webpack building memory and start build reuslt ui navigation
webpackTool.server([clientConfig, serverConfig]);
```


## Webpack Build UI Viewer

编译完成, 自动打开编译结果页面 :  http://127.0.0.1:8888/debug

![image](/img/webpack/easywebpack-build-nav.png)