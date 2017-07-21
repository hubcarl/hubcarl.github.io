---
layout: default/post
title: 基于webpack的前端工程解决方案和egg+vue服务端客户端渲染项目实践
date: 2017-04-15
categories: blog
tags: [koa,egg,webpack,vue,hot-reload,webpack-hot-middleware,webpack-dev-middleware]
description:

---

## 背景

2016年, Vue框架在社区中逐渐活跃了起来, 同时公司也有更多的产品线启动, 这时很多团队需要做运营类管理后台, 而此时前端人力稀缺. 为了不重复建设和解放前端人力,
团队就准备基于webpack+vue框架做一个针对运营后台的前端打包和工程的解决方案, 然后进行公司内推广和培训, 让后端同学参与进来. 前端同学负责工程的建设和组件的开发, 后端同学负责具体业务开发.
到目前为止, 有5个以上团队采用这套前端解决方案进行运营后台或者工具项目开发, 极大的释放了前端人力, 效果不错. 在不断的演进中, 整个前端的客户的技术栈也逐渐由scrat+zepto 转型webpack+vue的开发方式.
因为是针对运营后台的设计初衷, 对性能和seo没有要求以及其他语言(java)的支持,采用是vue前端渲染方式进行设计的. 但随着新业务的发展, 加上vue支持服务端渲染的特性, 我们想在服务端渲染技术做一下研究和实践.

如下就针对webpack+vue服务端渲染进行相关研究和实践. 目前公司所有的前端新项目都是采用egg框架进行开发, 接下来主要讲的是基于egg项目如何实现webpack+vue工程化构建和服务端客户端渲染技术落地.


## 我们要解决什么问题

针对背景里面提到的一些问题, 基于webpack + egg项目的工程化, 当初想到和后面实践中遇到问题, 主要有如下问题需要解决:

- Vue服务端渲染性能如何?

- webpack 客户端(browser)运行模式打包支持

- webpack 服务端(node)运行模式打包支持

- 如何实现服务端和客户端代码修改webpack热更新功能

- webpack打包配置太复杂(客户端,服务端), 如何简化和多项目复用

- 开发, 测试, 正式等多环境支持, css/js/image的压缩和hash, cdn等功能如何配置, 页面依赖的css和js如何加载

- 如何快速扩展出基于vue, react前端框架服务端和客户端渲染的解决方案


## webpack工程设计

我们知道webpack是一个前端打包构建工具, 功能强大, 意味的配置也会复杂. 我们可以通过针对vue, react等前端框架,采用不同的配置构建不同的解决方案.
虽然这样能实现, 但持续维护的成本大, 多项目使用时就只能采用拷贝的方式, 另外还有一些优化和打包技巧都需要各自处理.

基于以上的一些问题和想法, 我希望基于webpack的前端工程方案大概是这个样子:

- webpack太复杂, 项目可重复性和维护性低, 是不是可以把基础的配置固化, 然后基于基础的配置扩展出具体的解决方案(vue/react等打包方案).

- webpack配置支持多环境配置, 根据环境很方便的设置是否开启source-map, hash, 压缩等特性.

- webpack配置的普通做法是写配置, 是不是可以采用面向对象的方式来编写配置.

- 能够基于基础配置很简单的扩展出基于vue, react 服务端渲染的解决方案

- 针对egg + webpack内存编译和热更新功能与框架无关, 可以抽离出来, 做成通用的插件



## 设计实现

### webpack基础配置固化


在使用webpack对不同的前端框架进行打包和处理时, 有些配置是公共的, 有些特性是共性的, 我们把这些抽离出来, 并提供接口进行设置和扩展.


#### 公共配置

- option: entry读取, output, extensions 等基础配置

- loader: babel-loader, json-loader, url-loader, style-loader, css-loader, sass-loader, less-loader, postcss-loader, autoprefixer 等

- plugin: webpack.DefinePlugin(process.env.NODE_ENV), CommonsChunkPlugin等

#### 公共特性

- js/css/image 是否hash

- js/css/image 是否压缩

- js/css commonChunk处理


#### 开发辅助特性

- 编译进度条插件 ProgressBarPlugin

- 资源依赖表  ManifestPlugin

- 热更新处理  HotModuleReplacementPlugin


以上一些公共特性是初步梳理出来的, 不与具体的前端框架耦合. 针对这些特性可以单独写成一个npm组件, 并提供扩展接口进行覆盖, 删除和扩展功能.

在具体实现时, 可以根据环境变量 `process.env.NODE_ENV` 默认开启或者关闭一些特性. 比如本地开发时, 关闭 js/css/image 的hash和压缩,
开启热更新功能.


### webpack配置面向对象实现

- 针对上面梳理的公共基础配置, 可以把webpack配置分离成三部分: option, loader, plugin

- 针对客户端和服务端打包的差异性, 设计成三个类 `WebpackBaseBuilder`, `WebpackClientBuilder`, `WebpackServerBuilder`

基于以上的想法, 大概代码实现:

#### `WebpackBaseBuilder.js` 公共配置

```js
class WebpackBaseBuilder {
  constructor(config) {
    this.config = config;
    this.initConfig();
    this.initOption();
    this.initConfigLoader();
    this.initConfigPlugin();
  }

  initConfig() {
    this.prod = process.env.NODE_ENV === 'production';
    this.options = {};
    this.loaders = [];
    this.plugins = [];
    this.setUglifyJs(this.prod);
    this.setFileNameHash(this.prod);
    this.setImageHash(this.prod);
    this.setCssHash(this.prod);
    this.setCssExtract(false);
  }

  initOption() {
    this.options = {
      entry: Utils.getEntry(this.config.build.entry),
      resolve: {
        extensions: ['.js']
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        })
      ]
    };
  }

  initConfigLoader() {
    // default custom loader config list, call createWebpackLoader to webpack loader
    this.configLoaders = [
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: require.resolve('url-loader'),
        query: {
          limit: 1024
        },
        dynamic: () => {
          return {
            query: {
              name: this.imageName
            }
          }
        },
      }
    ];
  }

  initConfigPlugin() {
    // default custom plugin config list, call createWebpackPlugin to webpack plugin
    this.configPlugins = [
    {
      enable: () => {
        return this.isUglifyJS;
      },
      clazz: webpack.optimize.UglifyJsPlugin,
      args: () => {
        return {
          compress: {
            warnings: false,
            dead_code: true,
            drop_console: true,
            drop_debugger: true
          }
        }
      }
    }];
  }

  setOption(option) {
    this.options = merge(this.options, option);
  }

  setPublicPath(publicPath) {
    this.options = merge(this.options, { output: { publicPath } });
  }

  setDevTool(devtool, force) {
    if (!this.prod || force) {
      this.options = merge(this.options, { devtool });
    }
  }

  setConfigLoader(loader, isHead) {

  }


  setConfigPlugin(plugin, isHead) {

  }

  setLoader(loader, isHead) {

  }

  setPlugin(plugin, isHead) {

  }

  createWebpackLoader() {
    // ......
    return this.loaders;
  }

  createWebpackPlugin() {
    // ......
    return this.plugins;
  }

  create() {
    this.createWebpackLoader();
    this.createWebpackPlugin();
    return this.getWebpackConfig();
  }

  getWebpackConfig() {
    return merge({
        module: {
          rules: this.loaders
        },
        plugins: this.plugins
      },
      this.options);
  }

  setMiniCss(isMiniCss) {
    this.isMiniCss = isMiniCss;
  }

  setUglifyJs(isUglifyJS) {
    this.isUglifyJS = isUglifyJS
  }

  setFileNameHash(isHash, len = 7) {
    if (isHash) {
      this.filename = Utils.assetsPath(this.config, `js/[name].[hash:${len}].js`);
      this.chunkFilename = Utils.assetsPath(this.config, `js/[id].[chunkhash:${len}].js`);
    } else {
      this.filename = Utils.assetsPath(this.config, 'js/[name].js');
      this.chunkFilename = Utils.assetsPath(this.config, 'js/[id].js');
    }
  }

  setImageHash(isHash, len = 7) {
    if (isHash) {
      this.imageName = Utils.assetsPath(this.config, `img/[name].[hash:${len}].[ext]`);
    } else {
      this.imageName = Utils.assetsPath(this.config, `img/[name].[ext]`);
    }
  }

  setCssHash(isHash, len = 7) {
    if (isHash) {
      this.cssName = Utils.assetsPath(this.config, `css/[name].[contenthash:${len}].css`);
    } else {
      this.cssName = Utils.assetsPath(this.config, `img/[name].css`);
    }
  }

  setCssExtract(isExtract) {
    this.config.extractCss = isExtract;
  }
}
module.exports = WebpackBaseBuilder;
```

#### `WebpackServerBuilder.js` 客户端打包公共配置

```js
class WebpackClientBuilder extends WebpackBaseBuilder {
  constructor(config) {
    super(config);
    this.initClientOption();
    this.initClientConfigPlugin();
    this.initHotEntry();
    this.setCssExtract(this.prod);
    this.setMiniCss(this.prod);
  }

  initHotEntry() {

  }

  initClientOption() {

  }

  initClientConfigPlugin() {
    this.configPlugins.push({
      enable: () => {
        return !this.prod;
      },
      clazz: webpack.HotModuleReplacementPlugin
    });
  }
}
module.exports = WebpackClientBuilder;
```


#### `WebpackClientBuilder.js` 服务端打包公共配置


```js
class WebpackServerBuilder extends WebpackBaseBuilder {
  constructor(config) {
    super(config);
    this.initServerOption();
    this.setCssExtract(false);
  }

  initServerOption() {
    this.setOption({
      target: 'node',
      output: {
        libraryTarget: 'commonjs2',
        path: path.join(this.config.baseDir, 'app/view')
      },
      externals: Utils.loadNodeModules()
    });
  }
}

module.exports = WebpackServerBuilder;
```


以上是正对webpack公共基础配置进行初步的设计, 还需不断完善, 目前已经基于此设想开发了 [easywebpack](https://github.com/hubcarl/easywebpack) 插件.


### 针对具体前端框架vue的打包方案实现

上面已经采用面向对象的方式实现了webpack的基础配置[easywebpack](https://github.com/hubcarl/easywebpack)插件, 接下来我们在easywebpack的基础上扩展出
webpack+vue前端构建解决方案.

vue构建里面与vue相关主要有vue-style-loader和vue-html-loader, extensions,  process.env.VUE_ENV 环境变量, 我们在easywebpack上面扩展此特性即可.


#### Vue客户端和服务端打包公共配置`config.js`


```js
const EasyWebpack = require('easywebpack');
const webpack = EasyWebpack.webpack;
const merge = EasyWebpack.merge;

exports.getLoader = config => {
  return [
    {
      test: /\.vue$/,
      loader: require.resolve('vue-loader'),
      dynamic: () => {
        return {
          options: EasyWebpack.Loader.getStyleLoaderOption(config)
        };
      }
    },
    {
      test: /\.html$/,
      loader: require.resolve('vue-html-loader')
    }
  ];
};

exports.initBase = options => {
  return merge({
    resolve: {
      extensions: ['.vue']
    }
  }, options);
};

exports.initClient = options => {
  return merge(exports.initBase(options), {
    resolve: {
      alias: {
        vue: 'vue/dist/vue.common.js'
      }
    }
  }, options);
};

exports.initServer = options => {
  return merge(exports.initBase(options), {
    resolve: {
      alias: {
        vue: 'vue/dist/vue.runtime.common.js'
      }
    },
    plugins: [
      // 配置 vue 的环境变量，告诉 vue 是服务端渲染，就不会做耗性能的 dom-diff 操作了
      new webpack.DefinePlugin({
        'process.env.VUE_ENV': '"server"'
      })
    ]
  }, options);
};
```

这些基础配置不复杂, 没有对所有的属性提供单独的方法进行设置, 直接通过setOption方法统一设置.


#### Vue客户端打包配置`client.js`

```js
'use strict';
const EasyWebpack = require('easywebpack');
const baseConfig = require('./config');
class WebpackClientBuilder extends EasyWebpack.WebpackClientBuilder {
  constructor(config) {
    super(config);
    this.setOption(baseConfig.initClient());
    this.setConfigLoader(baseConfig.getLoader(this.config), true);
  }

  create() {
    return super.create();
  }
}
module.exports = WebpackClientBuilder;
```

#### Vue服务端打包配置`server.js`

```js
'use strict';
const EasyWebpack = require('easywebpack');
const baseConfig = require('./config');
class WebpackServerBuilder extends EasyWebpack.WebpackServerBuilder {
  constructor(config) {
    super(config);
    this.setOption(baseConfig.initServer());
    this.setConfigLoader(baseConfig.getLoader(this.config), true);
  }
}
module.exports = WebpackServerBuilder;
```


#### 命令行运行编译 `build.js`

- 编译入口脚本

```js
'use strict';
const EasyWebpack = require('easywebpack');
const clientConfig = require('./client')(config);
const serverConfig = require('./server')(config);
EasyWebpack.build([clientConfig, serverConfig]);
```

- 命令行运行

```bash
NODE_ENV=development && node build.js
NODE_ENV=production && node build.js
```

目前已经基于此实现开发了 [egg-webpack-vue](https://github.com/hubcarl/egg-webpack-vue) 插件.


### egg + webpack内存编译和热更新

webpack基础配置和vue打包插件已完成, 那如何在本地开发实现修改代码自动编译功能呢?

webpack提供了很好的内存编译和热更新机制, 极大提高了编译效率和开发效率.

如果你仅仅是进行webpack编译客户端运行文件, 可以很方便的做到热更新机制: 修改代码, 不需要手动刷新界面, UI马上会自动更新.
这种更新不会刷新页面, 而是webpack通过监听文件修改, 通过socket建立客户端的连接, 把修改的内容通过socket发给浏览器,通过动态执行js达到页面更新的效果.

如果是修改Node.js服务端端代码想要项目自动重启和webpack编译内存继续存在而不是重新编译, 就需要借助egg框架的agent机制.

egg已经内置了worker和agent通信机制以及自动重启功能.

- 实现egg项目服务端代码修改项目自动重启的功能可以使用[egg-development](https://github.com/eggjs/egg-development)插件.
- worker和agent通信机制: https://eggjs.org/zh-cn/core/cluster-and-ipc.html

当egg自动重启时, agent是不会销毁的, 这样就可以让webpack实例继续保持, 我们需要解决的是如何从webpack编译内存里面编译的文件内容.
内容包括webpack编译的服务端渲染文件和客户端用到js, css, image等静态资源. 这些内容我们都可以通过worker发现消息给agent, 然后读取内容,
再通过agent发送消息给worker. js, css, image等静态资源也这样处理的话就需要读取文件流,然后根据文件类型返回给对应的响应内容.
这里采用一种更简单的方式, 直接在agent里面启动一个koa的webpack编译服务, 这样就可以通过http的方式访问js, css, image等静态资源.


#### 首先在agent中启动koa服务

针对webpack server 编译模式, 在egg agent里面单独启动koa编译服务, 同时开启跨域功能. `agent.js` 代码如下:

```js
const webpack = require('webpack');
const koa = require('koa');
const cors = require('kcors');
const app = koa();
app.use(cors());
const Constant = require('./constant');
const Utils = require('./utils');

module.exports = agent => {
  const config = agent.config.webpack;
  const webpackConfig = config.webpackConfig;
  const compiler = webpack(webpackConfig);
  const devMiddleware = require('koa-webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    watchOptions: {
      ignored: /node_modules/,
    },
  });

  app.use(devMiddleware);

  app.listen(config.port + 1, err => {
    if (!err) {
      agent.logger.info(`start webpack build service: http://127.0.0.1:${config.port}`);
    }
  });
};
```

koa服务启动以后, 就可以通过 `http://127.0.0.1:port` 方式访问js, css, image等静态资源.


#### agent中监听worker发送的消息


在`agent.js` 增加如下监听的代码:

- 通过`agent.messenger.on` 监听app worker发送过来的消息

```js
agent.messenger.on(Constant.EVENT_WEBPACK_READ_FILE_MEMORY, data => {
  const fileContent = Utils.readWebpackMemoryFile(compiler, data.filePath);
  if (fileContent) {
    agent.messenger.sendToApp(Constant.EVENT_WEBPACK_READ_FILE_MEMORY_CONTENT, {
      fileContent,
    });
  } else {
    // agent.logger.error(`webpack server memory file[${data.filePath}] not exist!`);
    agent.messenger.sendToApp(Constant.EVENT_WEBPACK_READ_FILE_MEMORY_CONTENT, {
      fileContent: '',
    });
  }
});
```

在worker view 渲染文件读取里面调用如下方法, 获取webpack的编译内容

- 通过`app.messenger.sendToAgent` 向agent发送消息
- 通过`app.messenger.on` 监听agent发送过来的消息

```js
function readFile(filePath){
  return new Promise(resolve => {
    this.app.messenger.sendToAgent(Constant.EVENT_WEBPACK_READ_FILE_MEMORY_CONTENT, {
      filePath,
    });
    this.app.messenger.on(Constant.EVENT_WEBPACK_READ_FILE_MEMORY_CONTENT, data => {
      resolve(data.fileContent);
    });
  });
}
```

在app/extend/application.js 挂载webpack实例, 以便进行扩展.

```js
const WEBPACK = Symbol('Application#webpack');
module.exports = {
  get webpack() {
    if (!this[WEBPACK]) {
      this[WEBPACK] = new FileSystem(this);
    }
    return this[WEBPACK];
  },
};
```

- 针对此方案实现基于了egg的开发webpack server编译[egg-webpack](https://github.com/hubcarl/egg-webpack)插件
- 关于koa的实现热编译和重启, 可以参考[koa和egg项目webpack内存编译和热更新实现](http://hubcarl.github.io/blog/2017/04/15/egg-webpack/)


### 本地开发内存文件读取与线上运行文件读取分离实现


在egg-view插件开发规范中,我们会在ctx上面挂载render方法, render方法会根据文件名进行文件读取, 模板与数据编译, 从而实现模板的渲染.如下就是controller的调用方式:

```js
exports.index = function* (ctx) {
  yield ctx.render('index/index.js', Model.getPage(1, 10));
};
```

那我们如何处理从webpack内存读取还是从本地文件读取呢? 其中最关键的一步是根据文件名进行文件读取, 只要view插件设计时, 把文件读取的方法暴露出来,就可以实现本地开发webpack热更新内存存储读取.

- vue view engine设计实现:

```js
const Engine = require('../../lib/engine');
const VUE_ENGINE = Symbol('Application#vue');

module.exports = {

  get vue() {
    if (!this[VUE_ENGINE]) {
      this[VUE_ENGINE] = new Engine(this);
    }
    return this[VUE_ENGINE];
  },
};
```

```js
class Engine {
  constructor(app) {
    this.app = app;
    this.config = app.config.vue;
    this.cache = LRU(this.config.cache);
    this.fileLoader = new FileLoader(app, this.cache);
    this.renderer = vueServerRenderer.createRenderer();
    this.renderOptions = Object.assign({
      cache: this.cache,
    }, this.config.renderOptions);
  }

  createBundleRenderer(code, renderOptions) {
    return vueServerRenderer.createBundleRenderer(code, Object.assign({}, this.renderOptions, renderOptions));
  }

  * readFile(name) {
    return yield this.fileLoader.load(name);
  }

  render(code, data = {}, options = {}) {
    return new Promise((resolve, reject) => {
      this.createBundleRenderer(code, options.renderOptions).renderToString(data, (err, html) => {
        if (err) {
          reject(err);
        } else {
          resolve(html);
        }
      });
    });
  }
}
```


- ctx.render 方法

```js
class View {
  constructor(ctx) {
    this.app = ctx.app;
  }

  * render(name, locals, options = {}) {
    // 我们通过覆写app.vue.readFile即可改变文件读取逻辑
    const code = yield this.app.vue.readFile(name);
    return this.app.vue.render(code, { state: locals }, options);
  }

  renderString(tpl, locals) {
    return this.app.vue.renderString(tpl, locals);
  }
}

module.exports = View;
```

服务器view渲染插件实现 [egg-view-vue](https://github.com/hubcarl/egg-view-vue)


- 通过webpack实例覆写app.vue.readFile 改变从webpack内存读取文件内容.

```js
if (app.vue) {
  app.vue.readFile = fileName => {
    const filePath = path.isAbsolute(fileName) ? fileName : path.join(app.config.view.root[0], fileName);
    if (/\.js$/.test(fileName)) {
      // webpack 实例是有[egg-webpack]插件挂载上去的.
      return app.webpack.fileSystem.readServerFile(filePath, fileName);
    }
    return app.webpack.fileSystem.readClientFile(filePath, fileName);
  };
}

app.messenger.on(app.webpack.Constant.EVENT_WEBPACK_CLIENT_BUILD_STATE, data => {
  if (data.state) {
    const filepath = app.config.webpackvue.build.manifest;
    const promise = app.webpack.fileSystem.readClientFile(filepath);
    promise.then(content => {
      fs.writeFileSync(filepath, content, 'utf8');
    });
  }
});
```

webpack + vue 编译插件实现 [egg-webpack-vue](https://github.com/hubcarl/egg-webpack-vue)


说明: 在最开始的实现时,一直在摸索, 为了尽快满足项目, 整个功能是在一个插件[egg-vue-webpack-dev](https://github.com/hubcarl/egg-vue-webpack-dev)中实现的. 
随着业务稳定下来, 就对这边个插件进行了分离和重新实现, 才有了上面的三个插件, 目地是让webpack编写更简单, 扩展更容易.


## egg+webpack+vue项目实战

用egg-init 初始化一个项目和安装依赖后, 我们添加 `@hubcarl/egg-view-vue` 和 `egg-view-vue-ssr`依赖, 添加`egg-webpack` 和 `egg-webpack-vue` 开发依赖

### 安装依赖

```bash
npm i @hubcarl/egg-view-vue --save
npm i @hubcarl/egg-view-vue --save
npm i egg-webpack --save-dev
npm i egg-webpack-vue --save-dev
```

### 增加配置

- config/plugin.js 

```js
exports.vue = {
  enable: true,
  package: '@hubcarl/egg-view-vue'
};

exports.vuessr = {
  enable: true,
  package: 'egg-view-vue-ssr'
};

exports.webpack = {
  enable: true,
  package: 'egg-webpack'
};

exports.webpackvue = {
  enable: true,
  package: 'egg-webpack-vue'
};
```

- config.default.js 

```js
  exports.view = {
    cache: false
  };

  exports.static = {
    router: '/public', // 请求进来的前缀，避免和应用的 router 冲突，默认是 `/public`
    // maxAge: 3600 * 24 * 180, // maxAge 缓存，默认 1 年
    dir: path.join(app.baseDir, 'public') // 静态文件目录，默认是 `${baseDir}/app/pulbic`
  };
```

- config.local.js
  
  
```js
  const webpackConfig = {
     baseDir: path.resolve(__dirname, '../'),
     build: {
       port: 8090,
       path: 'public',
       publicPath: '/public/',
       prefix: 'static',
       entry: [path.join(baseDir, 'app/web/page')],
       commonsChunk: ['vendor']
     },
     webpack: {
       styleLoader: 'vue-style-loader',
       loaderOption: {
         sass: {
           includePaths: [path.join(baseDir, 'app/web/asset/style')]
         }
       }
     }
  };
  exports.webpack = {
    port: webpackConfig.webpackvue.build.port,
    clientConfig: require(path.join(app.baseDir, 'build/client')),
    serverConfig: require(path.join(app.baseDir, 'build/server'))
  };

  exports.webpackvue = webpackConfig.webpackvue;
```

- package.json 增加如下命令

```js
"scripts": {
    "build-dev": "NODE_ENV=development node build",
    "build-prod": "NODE_ENV=production node build",
    "start": "WORKERS=1 NODE_ENV=development node index.js",
    "start-prod": "WORKERS=1 && NODE_ENV=production node index.js",
}
```

### 编写webpack配置

在项目根目录下增加build文件夹, 然后分别编写client和server webpack配置文件

- client/dev.js

```js
const ClientBaseBuilder = require('./base');
class ClientDevBuilder extends ClientBaseBuilder {
  constructor() {
    super();
    this.setEggWebpackPublicPath();
    this.setDevTool('eval-source-map');
    this.setCssExtract(false);
  }
}

module.exports = new ClientDevBuilder().create();
```

- sever/dev.js

```js
const ServerBaseBuilder = require('./base');
class ServerDevBuilder extends ServerBaseBuilder {
  constructor() {
    super();
    this.setEggWebpackPublicPath();
  }
}

module.exports = new ServerDevBuilder().create();
```

- 命令行编译文件到磁盘 

增加 build.js 文件

```js
const EggWebpackVue = require('egg-webpack-vue');
const clientConfig = require('./client');
const serverConfig = require('./server');
EggWebpackVue.EasyWebpack.build([clientConfig, serverConfig]);
```

```bash
npm run build-dev
npm run build-prod
```

client 文件默认编译到`public`目录下,  server 编辑结果默认到 `app/view`` 目录下

- 运行项目

```bash
npm start
```

`npm start` 会自动通过`egg-webpack` 启动编译流程, 无需单独运行`npm run build-dev` 或 `npm run build-prod`. 启动流程效果如下:


![npm start启动](https://raw.githubusercontent.com/hubcarl/hubcarl.github.io/master/_posts/images/webpack/webpack.png)

访问: http://127.0.0.1:7001


## 基于Vue多页面和单页面服务端渲染同构工程骨架项目[egg-vue-webpack-boilerplate](https://github.com/hubcarl/egg-vue-webpack-boilerplate)

- 基于vue + axios 多页面服务器客户端同构入口: http://127.0.0.1:7001

![多页面服务器渲染](https://raw.githubusercontent.com/hubcarl/hubcarl.github.io/master/_posts/images/webpack/vue-mutil-page.png)


- 基于vue + vuex + vue-router + axios 单页面服务器客户端同构入口: http://127.0.0.1:7001/app

![单页面服务器](https://raw.githubusercontent.com/hubcarl/hubcarl.github.io/master/_posts/images/webpack/vue-single-page.png)


## 关于性能和优化以及问题 (单独总结)


## egg+webpack+vue 依赖

- [egg-view-vue](https://github.com/hubcarl/egg-view-vue) egg view plugin for vue
- [egg-view-vue-ssr](https://github.com/hubcarl/egg-view-vue-ssr) vue server side render solution for egg-view-vue
- [egg-webpack](https://github.com/hubcarl/egg-webpack) webpack dev server plugin for egg, support read file in memory and hot reload
- [egg-webpack-vue](https://github.com/hubcarl/egg-webpack-vue) egg webpack building solution for vue
- [easywebpack](https://github.com/hubcarl/easywebpack) programming instead of configuration, webpack is no longer complex
