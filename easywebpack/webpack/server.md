---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

## Install

```bash
$ npm i easywebpack --save-dev
```


## Usage

### extends `WebpackClientBuilder` (`WebpackClientBuilder extends WebpackBaseBuilder`) custom webpack client(browser) build config.

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


### extends `WebpackServerBuilder` (`WebpackServerBuilder extends WebpackBaseBuilder`) custom webpack server(node) build config

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


### Webpack Build and Server

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

## Configuration


[easywebpack-vue](https://github.com/hubcarl/easywebpack-vue.git) and [easywebpack-weex](https://github.com/hubcarl/easywebpack-weex.git)
