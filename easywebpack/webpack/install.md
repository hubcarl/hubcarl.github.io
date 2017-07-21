---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

## 1. 安装

```bash
$ npm i easywebpack --save-dev
```


## 2. API


```js
const EasyWebpack = require('easywebpack');
```

#### 2.1 Webpack Class Builder 

```js
const WebpackBaseBuilder = EasyWebpack.WebpackBaseBuilder;
const WebpackClientBuilder = EasyWebpack.WebpackClientBuilder;
const WebpackServerBuilder = EasyWebpack.WebpackServerBuilder;
```

#### 2.2 Webpack Utils
  

```js  
const webpack = EasyWebpack.webpack;
const merge = EasyWebpack.merge;
const Utils = EasyWebpack.Utils;
const Loader = EasyWebpack.Loader;
```

#### 2.3 Webpack Building
 
```js 

// see `webpack-tool` npm plugin
const WebpackTool = EasyWebpack.WebpackTool;

// webpack build file to dist
const build = EasyWebpack.build;
build([clientConfig, serverConfig], () => {
  console.log('wepback vue build finished');
});

// webpack building memory and start build reuslt ui navigation
const server = EasyWebpack.server;
server([clientConfig, serverConfig]);
```

### 3. 扩展实现

####  3.1 extends `WebpackClientBuilder` (`WebpackClientBuilder extends WebpackBaseBuilder`) custom webpack client(browser) build config.

```js
const EasyWebpack = require('easywebpack');
class WebpackClientBuilder extends EasyWebpack.WebpackClientBuilder {
  constructor(config) {
    super(config);
    // call below api custom client builder
  }
}
module.exports = WebpackClientBuilder;
```

Webpack Client Config: `new WebpackClientBuilder(config).create()`


#### 3.2 extends `WebpackServerBuilder` (`WebpackServerBuilder extends WebpackBaseBuilder`) custom webpack server(node) build config

```js
const EasyWebpack = require('easywebpack');
class WebpackServerBuilder extends EasyWebpack.WebpackServerBuilder {
  constructor(config) {
    super(config);
    // call below api custom server builder
  }
}
module.exports = WebpackServerBuilder;
```
Webpack Server Config: `new WebpackServerBuilder(config).create()`


#### 3.3 Webpack Build and Server

- bash command build `build.js`


```js
const EasyWebpack = require('easywebpack');
const clientConfig = require('./build/client');
const serverConfig = require('./build/server');

// Webpack开发模式, 启动Server构建,
EasyWebpack.server([clientConfig, serverConfig]);


// Webpack构建编译文件到磁盘
EasyWebpack.build([clientConfig, serverConfig], () => {
  console.log('wepback vue build finished');
});
```

- package.json:

```bash
{
  "scripts": {
      "build-dev": "NODE_ENV=development node build",
      "build-prod": "NODE_ENV=production node build"
   }
}
```

- bash run

```bash
npm run build-dev
npm run build-prod
```

### 4. Configuration


[easywebpack-vue](https://github.com/hubcarl/easywebpack-vue.git) and [easywebpack-weex](https://github.com/hubcarl/easywebpack-weex.git)
