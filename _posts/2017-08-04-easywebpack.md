---
layout: default/post
title: webpack工程化解决方案easywebpack
date: 2017-08-04
categories: blog
tags: [koa, egg, webpack, vue, react, weex, webpack工程化解决方案]
description:

---

## 背景

随着越来越多的项目采用vue, react, weex进行业务开发, 在前端构建方面大多数是用webpack进行构建。但存在以下问题：

- 各个项目都是自己从零编写webpack配置，存在很多定制性的配置，无法复用，大多都是复制拷贝。
- webpack配置项多，当需要满足开发环境，测试环境，压缩，cdn，单页面，多页面， 热更新, 客户端渲染，服务器渲染等特性时，配置非常复杂。

在前端工程构建方面迫切需要一套基于webpack的通用且可扩展性强的前端工程化解决方案.


## 我们要解决什么问题

针对背景里面提到的一些问题, 基于webpack + egg项目的工程化, 当初想到和后面实践中遇到问题, 主要有如下问题需要解决:

- Vue服务端渲染性能如何?

- webpack 客户端(browser)运行模式打包支持

- webpack 服务端(node)运行模式打包支持

- 如何实现服务端和客户端代码修改webpack热更新功能

- webpack打包配置太复杂(客户端,服务端), 如何简化和多项目复用

- 开发, 测试, 正式等多环境支持, css/js/image的压缩和hash, cdn等功能如何配置, 页面依赖的css和js如何加载

- 如何快速扩展出基于vue, react前端框架服务端和客户端渲染的解决方案


## Webpack工程化设计

我们知道webpack是一个前端打包构建工具, 功能强大, 意味的配置也会复杂. 我们可以通过针对vue, react等前端框架,采用不同的配置构建不同的解决方案.
虽然这样能实现, 但持续维护的成本大, 多项目使用时就只能采用拷贝的方式, 另外还有一些优化和打包技巧都需要各自处理.

基于以上的一些问题和想法, 我希望基于webpack的前端工程方案大概是这个样子:

- webpack太复杂, 项目可重复性和维护性低, 是不是可以把基础的配置固化, 然后基于基础的配置扩展出具体的解决方案(vue/react等打包方案).

- webpack配置支持多环境配置, 根据环境很方便的设置是否开启source-map, hash, 压缩等特性.

- webpack配置的普通做法是写配置, 是不是可以采用面向对象的方式来编写配置.

- 能够基于基础配置很简单的扩展出基于vue, react 服务端渲染的解决方案

- 针对egg + webpack内存编译和热更新功能与框架无关, 可以抽离出来, 做成通用的插件

## 设计实现


### 1. webpack基础配置固化


在使用webpack对不同的前端框架进行打包和处理时, 有些配置是公共的, 有些特性是共性的, 我们把这些抽离出来, 并提供接口进行设置和扩展.


#### 1.1 公共配置

- option: entry读取, output, extensions 等基础配置

- loader: babel-loader, json-loader, url-loader, style-loader, css-loader, sass-loader, less-loader, postcss-loader, autoprefixer 等

- plugin: webpack.DefinePlugin(process.env.NODE_ENV), CommonsChunkPlugin等


#### 1.2 公共特性

- js/css/image 是否hash

- js/css/image 是否压缩

- js/css commonChunk处理


#### 1.3 开发辅助特性

- 编译进度条插件 ProgressBarPlugin

- 资源依赖表  ManifestPlugin

- 热更新处理  HotModuleReplacementPlugin

- ......


以上一些公共特性是初步梳理出来的, 不与具体的前端框架耦合. 针对这些特性可以单独写成一个npm组件, 并提供扩展接口进行覆盖, 删除和扩展功能.

在具体实现时, 可以根据 `env` 默认开启或者关闭一些特性. 比如本地开发时, 关闭 js/css/image 的hash和压缩,开启热更新功能.


### 2. Webpack配置面向对象实现

- 针对上面梳理的公共基础配置, 可以把webpack配置分离成三部分: option, loader, plugin

- 针对客户端和服务端打包的差异性, 设计成三个类 `WebpackBaseBuilder`, `WebpackClientBuilder`, `WebpackServerBuilder`




最终形成Webpack构建解决方案easywebpack

## 基于easywebpack 扩展 easywebpack-vue实现

GitHub: [https://github.com/hubcarl/easywebpack-vue](https://github.com/hubcarl/easywebpack-vue)

### 公共配置

```js
'use strict';
const EasyWebpack = require('easywebpack');
const WebpackBaseBuilder = WebpackBuilder => class extends WebpackBuilder {
  constructor(config) {
    super(config);
    this.setExtensions('.vue');
    this.setStyleLoaderName('vue-style-loader');
    this.addLoader(/\.vue$/, 'vue-loader', () => ({
      options: EasyWebpack.Loader.getStyleLoaderOption(this.getStyleConfig())
    }));
    this.addLoader(/\.html$/, 'vue-html-loader');
  }
};
module.exports = WebpackBaseBuilder;

```

### 浏览器(Browser)模式配置

```js
'use strict';
const EasyWebpack = require('easywebpack');
const WebpackBaseBuilder = require('./base');

class WebpackClientBuilder extends WebpackBaseBuilder(EasyWebpack.WebpackClientBuilder) {
  constructor(config) {
    super(config);
    this.setAlias('vue', 'vue/dist/vue.common.js', false);
  }
}
module.exports = WebpackClientBuilder;
```


### 服务端(Node)配置


```js
'use strict';
const EasyWebpack = require('easywebpack');
const webpack = EasyWebpack.webpack;
const WebpackBaseBuilder = require('./base');
class WebpackServerBuilder extends WebpackBaseBuilder(EasyWebpack.WebpackServerBuilder) {
  constructor(config) {
    super(config);
    this.setAlias('vue', 'vue/dist/vue.runtime.common.js', false);
    this.addPlugin(webpack.DefinePlugin, { 'process.env.VUE_ENV': '"server"' });
  }
}
module.exports = WebpackServerBuilder;
```
## 基于 `easywebpack-vue` 项目构建实现

### 一. 安装 `easywebpack-vue` 插件

```bash
npm i easywebpack-vue --save-dev
```

### 二. 项目构建目录结构


![image](/img/webpack/easywebpack-build.png)

看似复杂, 其实文件名里面都是空, 这里只是说明一个完整的构建. client表示浏览器运行模式,  server表示Node端运行模式(服务器渲染).
项目地址:[egg-vue-webpack-boilerplate](https://github.com/hubcarl/egg-vue-webpack-boilerplate)


### 三. 配置实现

### 1. config 配置编写 `config.js`

```js
const BUILD_ENV = process.env.BUILD_ENV;
const path = require('path');
const baseDir = path.join(__dirname, '..');

module.exports = {
  baseDir,
  env: BUILD_ENV,
  commonsChunk: ['vendor'],
  entry: {
    include: 'app/web/page',
    exclude: ['app/web/page/test', 'app/web/page/html']
  }
};

```

### 2. 编写公共配置

#### 2.1 编写全局公共配置 `build/base/index.js`

```js
'use strict';
const path = require('path');
const merge = require('easywebpack').merge;
const webpackConfig = require('../config');
const WebpackBaseBuilder = WebpackBuilder => class extends WebpackBuilder {
  constructor(config) {
    super(merge(webpackConfig, config));
    this.setAlias('asset', 'app/web/asset');
    this.setAlias('component', 'app/web/component');
    this.setAlias('framework', 'app/web/framework');
    this.setAlias('store', 'app/web/store');
    this.setAlias('app', 'app/web/framework/vue/app.js');
    this.setStyleLoaderOption({
      sass: {
        options: {
          includePaths: [path.join(this.config.baseDir, 'app/web/asset/style')],
        }
      }
    });
  }
};
module.exports = WebpackBaseBuilder;

```


#### 2.2 编写Web端公共配置 `build/web/base/index.js`

```js
'use strict';
const WebpackWebBaseBuilder = WebpackBuilder => class extends WebpackBuilder {
  constructor(config) {
    super(config);
    this.setDefine({ PROD: true });
  }
};
module.exports = WebpackWebBaseBuilder;
```


### 3. client客户端配置


#### 3.1 编写Web端 client公共配置 `build/web/client/base/index.js`


```js
'use strict';
const path = require('path');
const VueWebpack = require('easywebpack-vue');
const WebpackBaseBuilder = require('../../base');
const WebpackWebBaseBuilder = require('../base');
class WebpackWebClientBaseBuilder extends WebpackWebBaseBuilder(WebpackBaseBuilder(VueWebpack.WebpackClientBuilder)) {
  constructor(config) {
    super(config);
    this.setDefine({ isBrowser: true });
    this.addEntry('vendor', ['vue', 'axios']);
    this.addPack('pack/inline', 'app/web/framework/inject/pack-inline.js');
  }
}
module.exports = WebpackWebClientBaseBuilder;
```


#### 3.2 编写Web端 client开发环境配置 `build/web/client/dev.js`


```js
'use strict';
const path = require('path');
const WebpackClientBaseBuilder = require('./base');
class ClientDevBuilder extends WebpackClientBaseBuilder {
  constructor(config) {
    super(config);
    this.setProxy(true);
    this.setDefine({ PROD: false });
    this.addEntry('vendor', ['vconsole']);
  }
}
module.exports = new ClientDevBuilder().create();
```


#### 3.3 编写Web端 client测试环境配置 `build/web/client/test.js`


```js
'use strict';
const WebpackClientBaseBuilder = require('./base');
class ClientDevBuilder extends WebpackClientBaseBuilder {
  constructor(config) {
    super(config);
    this.setDevTool(false);
    this.setDefine({ PROD: false });
    this.addEntry('vendor', ['vconsole']);
  }
}
module.exports = new ClientDevBuilder().create();
```



#### 3.4 编写Web端 client正式环境配置 `build/web/client/prod.js`


```js
'use strict';
const WebpackClientBaseBuilder = require('./base');
class ClientProdBuilder extends WebpackClientBaseBuilder {
  constructor(config) {
    super(config);
    this.setMiniJs({ globalDefs: { isBrowser: true, PROD: true } });
  }
}
module.exports = new ClientProdBuilder().create();
```


### 4. server服务端配置



#### 4.1 编写Web端 server公共配置 `build/web/server/base.js`


```js
'use strict';
const VueWebpack = require('easywebpack-vue');
const WebpackBaseBuilder = require('../../base');
const WebpackWebBaseBuilder = require('../base');
class WebpackWebServerBaseBuilder extends WebpackWebBaseBuilder(WebpackBaseBuilder(VueWebpack.WebpackServerBuilder)) {
  constructor(config) {
    super(config);
    this.setPrefix('');
    this.setBuildPath('app/view');
    this.setPublicPath('client', false);
    this.setMiniImage(false);
    this.setDefine({ isBrowser: false });
  }
}
module.exports = WebpackWebServerBaseBuilder;
```


#### 4.2 编写Web端 server开发环境配置 `build/web/server/dev.js`


```js
'use strict';
const WebpackServerBaseBuilder = require('./base');
class ServerDevBuilder extends WebpackServerBaseBuilder {
  constructor(config) {
    super(config);
    this.setProxy(true);
    this.setDefine({ PROD: false });
  }
}
module.exports = new ServerDevBuilder().create();

```


#### 4.3 编写Web端 server测试环境配置 `build/web/server/test.js`


```js
'use strict';
const WebpackServerBaseBuilder = require('./base');
class ServerTestBuilder extends WebpackServerBaseBuilder {
  constructor(config) {
    super(config);
    this.setDefine({ PROD: false });
  }
}
module.exports = new ServerTestBuilder().create();
```



#### 4.4 编写Web端 server正式环境配置 `build/web/server/prod.js`


```js
'use strict';
const WebpackServerBaseBuilder = require('./base');
class ServerProdBuilder extends WebpackServerBaseBuilder {
  constructor(config) {
    super(config);
    this.setMiniJs({
      globalDefs: {
        isBrowser: false,
        PROD: true
      }
    });
  }
}

module.exports = new ServerProdBuilder().create();
```


### 四. 编译和运行 

- `build/index.js`

```js
'use strict';
const easyWebpack = require('easywebpack-vue');
const clientConfig = require('./web/client');
const serverConfig = require('./web/server');
const webpackConfig = [clientConfig, serverConfig];

if(process.env.NODE_SERVER){
  // 编译和运行
  easyWebpack.server(webpackConfig);
}else{
  // 编译
  easyWebpack.build(webpackConfig, () => {
    console.log('build success');
  });
}

```


- `package.json`


```js
"build": "cross-env BUILD_ENV=prod NODE_ENV=production node build",
"build-dev": "cross-env BUILD_ENV=dev NODE_ENV=development node build",
"build-test": "cross-env BUILD_ENV=test NODE_ENV=development node build",
"dev": "cross-env BUILD_ENV=test NODE_ENV=development NODE_SERVER=true node build",
```

- 运行 `npm run dev`

编译完成, 自动打开编译结果页面 :  http://127.0.0.1:8888/debug



- [easywebpack-vue](https://github.com/hubcarl/easywebpack-vue.git) 
- [easywebpack-react](https://github.com/hubcarl/easywebpack-react.git)
- [easywebpack-weex](https://github.com/hubcarl/easywebpack-weex.git)

## 命令行工具

[easywebpack-cli](https://github.com/hubcarl/easywebpack-cli.git) Webpack Building Command Line And Boilerplate Init Tool for easywebpack
## 前端渲染工程骨架

- [egg-vue-webpack-boilerplate](https://github.com/hubcarl/egg-vue-webpack-boilerplate) support vue server side render and client render

- [egg-react-webpack-boilerplate](https://github.com/hubcarl/egg-react-webpack-boilerplate) support react server side render and client render

- [easywebpack-weex-boilerplate](https://github.com/hubcarl/easywebpack-weex-boilerplate) support weex native build and web build

## Webpack工程化整体方案





