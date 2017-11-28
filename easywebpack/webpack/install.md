---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

## 1. 安装

```bash
$ npm i easywebpack --save-dev
```


## 2. API


easywebpack 暴露了 WebpackBaseBuilder, WebpackClientBuilder, WebpackServerBuilder 三个对象.

![image](/img/webpack/WebpackBuilder.png)

可以通过继承扩展的方式实现前端框架的构建: 

- 继承 WebpackClientBuilder 创建前端浏览器渲染模式 Webpack 构建配置
- 继承 WebpackServerBuilder 创建 Node 渲染(Server Side Render)模式 Webpack 构建配置


#### 2.1 Webpack Class Builder 

```js
const EasyWebpack = require('easywebpack');
const WebpackBaseBuilder = EasyWebpack.WebpackBaseBuilder;
const WebpackClientBuilder = EasyWebpack.WebpackClientBuilder;
const WebpackServerBuilder = EasyWebpack.WebpackServerBuilder;
```

#### 2.2 Webpack 辅助对象 webpack, merge, Utils
  

```js  
const webpack = EasyWebpack.webpack;
const merge = EasyWebpack.merge;
const Utils = EasyWebpack.Utils;
```

#### 2.3 Webpack 辅助构建 WebpackTool对象, build 方法 和 server 方法
 
```js 

// see `webpack-tool` npm plugin
const WebpackTool = EasyWebpack.WebpackTool;

// webpack build file to dist
const build = EasyWebpack.build;
build([clientConfig, serverConfig], (),  () => {
  console.log('wepback vue build finished');
});

// webpack building memory and start build reuslt ui navigation
const server = EasyWebpack.server;
server([clientConfig, serverConfig], (),  () => {
  console.log('wepback vue build finished');
});
```

## 3. 扩展实现

- `config` 参数可以根据解决方案需求内置部分配置, 用户配置最终会与默认配置进行 merge 操作.
- 具体扩展请见 [API](/easywebpack/webpack/api/) 文档. 下面扩展部分相同的代码可以抽离成基类,这里仅作为演示.

####  3.1 继承 `WebpackClientBuilder` 创建前端浏览器渲染模式 Webpack 构建配置

```js
// ${root}/build/client.js
const EasyWebpack = require('easywebpack');
class WebpackClientBuilder extends EasyWebpack.WebpackClientBuilder {
  constructor(config) {
    super(config);
    // call below api custom client builder, this use vue example
    // 添加.vue 文件 extendsion
    this.setExtensions('.vue'); 
    // 添加框架node_modules 到 Webpack node_modules 查找路径
    this.setResolveLoader({ modules: [path.join(__dirname, '../node_modules')] }); 
    // 添加框架内置的 vue-loader 配置
    this.mergeLoader(require('../config/loader'));
    // 为 vue 添加别名
    this.setAlias('vue', 'vue/dist/vue.common.js', false);
  }
}
module.exports = WebpackClientBuilder;
```

>获取 Webpack 原生配置: `new WebpackClientBuilder(config).create()`


#### 3.2 继承 `WebpackServerBuilder` 创建 Node 渲染(Server Side Render)模式 Webpack 构建配置

该步骤非必需, 除非你要实现 Node Server Side Render 渲染

```js
// ${root}/build/server.js
const EasyWebpack = require('easywebpack');
class WebpackServerBuilder extends EasyWebpack.WebpackServerBuilder {
  constructor(config) {
    super(config);
    // call below api custom server builder
    // 添加.vue 文件 extendsion
    this.setExtensions('.vue'); 
    // 添加框架node_modules 到 Webpack node_modules 查找路径
    this.setResolveLoader({ modules: [path.join(__dirname, '../node_modules')] }); 
    // 添加框架内置的 vue-loader 配置
    this.mergeLoader(require('../config/loader'));
    // 为 vue 添加别名
    this.setAlias('vue', 'vue/dist/vue.runtime.common.js', false);
  }
}
module.exports = WebpackServerBuilder;
```

>获取 Webpack 原生配置: `new WebpackServerBuilder(config).create()`


## 4. 使用构建扩展方案

#### 4.1 定义 WebpackBuilder `config` 参数

```js
module.exports = {
  env: process.env.BUILD_ENV, // 打包模式
  entry:{
    //  src/page 目录下的 js 文件将作为 Webpack entry 入口
    include: [src/page/**.js] 
  }
}
```

#### 4.2 编写构建入口执行文件


```js
// ${root}/build/index.js
const EasyWebpack = require('easywebpack');
const clientConfig = require('./build/client');
const serverConfig = require('./build/server');

// Webpack 开发模式, 启动 Webpack dev server构建,
EasyWebpack.server([clientConfig, serverConfig]);


// Webpack构建编译文件到磁盘
EasyWebpack.build([clientConfig, serverConfig], () => {
  console.log('wepback build finished');
});
```


#### 4.3 运行构建

- package.json:

```bash
{
  "scripts": {
    "build:dev": "BUILD_ENV=dev node build",
    "build:prod": "BUILD_ENV=prod node build"
  }
}
```

- bash run

```bash
npm run build:dev
npm run build:prod
```


## 5. 现有解决方案

- [easywebpack-vue](/easywebpack/vue/easywebpack-vue/)
- [easywebpack-react](/easywebpack/react/easywebpack-react/)
- [easywebpack-weex](/easywebpack/weex/easywebpack-weex/)
- [easywebpack-html](/easywebpack/html/easywebpack-html/)

**在实现一个全新的解决方案时, 建议先把 `easywebpack` 文档熟悉一遍, 同时阅读已有解决方案实现方式**