---
layout: post
title: koa和egg项目webpack内存编译和热更新实现
date: 2017-04-15
categories: blog
tags: [koa,egg,webpack,hot-reload,webpack-hot-middleware,webpack-dev-middleware]
description:

---

## 背景

在用Node.js+Webpack构建的方式进行开发时,  我们希望能实现修改代码能实时刷新页面UI的效果.
这个特性webpack本身是支持的, 而且基于koa也有现成的koa-webpack-hot-middleware 和 koa-webpack-dev-middleware 封装好的组件支持.
不过这里如果需要支持Node.js服务器端修改代码自动重启webpack自动编译功能就需要cluster来实现.

今天这里要讲的是如何在koa和egg应用实现Node.js应用重启中的webpack热更新功能. 要实现egg项目中webpack友好的开发体验, 需要解决如下三个问题.


## 问题

- 如何解决Node.js服务器端代码修改应用重启避免webpack重新编译.
- 如何访问js,css,image等静态资源.
- 如何处理本地开发webpack热更新内存存储读取和线上应用本机文件读取逻辑分离.


## 基于koa的webpack编译和热更新实现


在koa项目中, 通过koa-webpack-dev-middleware和koa-webpack-hot-middleware可以实现webpack编译内存存储和热更新功能, 代码如下:

```js
const compiler = webpack(webpackConfig);
const devMiddleware = require('koa-webpack-dev-middleware')(compiler, options);
const hotMiddleware = require('koa-webpack-hot-middleware')(compiler, options);
app.use(devMiddleware);
app.use(hotMiddleware);
```

如果按照上面实现, 可以满足修改修改客户端代码实现webpack自动变编译和UI界面热更新的功能, 但如果是修改Node.js服务器端代码重启后就会发现webpack会重新编译,
这不是我们要的效果.原因是因为middleware是依赖app的生命周期, 当app销毁时, 对应webpack compiler实例也就没有了, 重启时会重新执行middleware初始化工作.
针对这个我们可以通过Node.js cluster实现, 大概思路如下:


#### 通过cluster worker 启动App应用


```js
if (cluster.isWorker) {
  const koa = require('koa');
	app.listen(8888, () =>{
		app.logger.info('The server is running on port: 9999');
	});
}
```

#### 通过cluster master 启动一个新的koa应用, 并启动 webpack 编译.

```js
const cluster = require('cluster');
const chokidar = require('chokidar');

if (cluster.isMaster) {
  const koa = require('koa');
  const app = koa();
  const compiler = webpack([clientWebpackConfig,serverWebpackConfig]);
  const devMiddleware = require('koa-webpack-dev-middleware')(compiler);
  const hotMiddleware = require('koa-webpack-hot-middleware')(compiler);
  app.use(devMiddleware);
  app.use(hotMiddleware);

  let worker = cluster.fork();
  chokidar.watch(config.dir, config.options).on('change', path =>{
    console.log(`${path} changed`);
    worker.kill();
    worker = cluster.fork().on('listening', (address) =>{
      console.log(`[master] listening: worker ${worker.id}, pid:${worker.process.pid} ,Address:${address.address } :${address.port}`);
    });
  });
}
```

#### 通过chokidar库监听文件夹的文件修改, 然后重启worker, 这样就能保证webpack compiler实例不被销毁.

```js
const watchConfig = {
		dir: [ 'controller', 'middleware', 'lib', 'model', 'app.js', 'index.js' ],
		options: {}
	};
	let worker = cluster.fork();
	chokidar.watch(watchConfig.dir, watchConfig.options).on('change', path =>{
		console.log(`${path} changed`);
		worker && worker.kill();
		worker = cluster.fork().on('listening', (address) =>{
			console.log(`[master] listening: worker ${worker.id}, pid:${worker.process.pid} ,Address:${address.address } :${address.port}`);
		});
});
```

#### worker 通过`process.send` 向 master 发现消息, `process.on` 监听 master返回的消息

- 首先我们看看本地文件读取的实现, 在context上面挂载readFile方法, 进行view render时, 调用`app.context.readFile` 方法.

```js
app.context.readFile = function(fileName){
  const filePath = path.join(config.baseDir, config.staticDir, fileName);
  return new Promise((resolve, reject) =>{
    fs.readFile(filePath, CHARSET, function(err, data){
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
```

- 通过覆写worker `app.context.readFile` 方法, 这样进行本地开发时,开启该插件就可以无缝的从webpack编译内存系统里面读取文件

```js
app.context.readFile = (fileName) =>{
  return new Promise((resolve, reject) =>{
    process.send({ action: Constant.EVENT_FILE_READ, fileName });
    process.on(Constant.EVENT_MESSAGE, (msg) =>{
      resolve(msg.content);
    });
  });
};
```

#### master 通过监听worker发过来的消息, 获取webpack编译进度和读取webpack compiler内存系统文件内容

```js
cluster.on(Constant.EVENT_MESSAGE, (worker, msg) =>{
		switch (msg.action) {
			case Constant.EVENT_WEBPACK_BUILD_STATE: {
				const data = {
					action: Constant.EVENT_WEBPACK_BUILD_STATE,
					state: app.webpack_client_build_success && app.webpack_server_build_success
				};
				worker.send(data);
				break;
			}
			case Constant.EVENT_FILE_READ: {
				const fileName = msg.fileName;
				try {
					const compiler = app.compiler;
					const filePath = path.join(compiler.outputPath, fileName);
					const content = app.compiler.outputFileSystem.readFileSync(filePath).toString(Constant.CHARSET);
					worker.send({ fileName, content });
				} catch (e) {
					console.log(`read file ${fileName} error`, e.toString());
				}
				break;
			}
			default:
				break;
		}
});
```


## 基于egg的webpack编译和热更新实现

通过上面koa的实现思路, egg实现就更简单了. 因为egg已经内置了worker和agent通信机制以及自动重启功能.

- worker和agent通信机制: https://eggjs.org/zh-cn/core/cluster-and-ipc.html
- 实现egg项目服务器代码修改项目自动重启的功能可以使用[egg-development](https://github.com/eggjs/egg-development)插件.


#### app.js (worker) 通过 检测webpack 编译进度

- 通过`app.messenger.sendToAgent` 向agent发送消息

- 通过`app.messenger.on` 监听agent发送过来的消息

```js
app.use(function* (next) {
  if (app.webpack_server_build_success && app.webpack_client_build_success) {
    yield* next;
  } else {
    const serverData = yield new Promise(resolve => {
      this.app.messenger.sendToAgent(Constant.EVENT_WEBPACK_SERVER_BUILD_STATE, {
        webpackBuildCheck: true,
      });
      this.app.messenger.on(Constant.EVENT_WEBPACK_SERVER_BUILD_STATE, data => {
        resolve(data);
      });
    });
    app.webpack_server_build_success = serverData.state;

    const clientData = yield new Promise(resolve => {
      this.app.messenger.sendToAgent(Constant.EVENT_WEBPACK_CLIENT_BUILD_STATE, {
        webpackBuildCheck: true,
      });
      this.app.messenger.on(Constant.EVENT_WEBPACK_CLIENT_BUILD_STATE, data => {
        resolve(data);
      });
    });

    app.webpack_client_build_success = clientData.state;

    if (!(app.webpack_server_build_success && app.webpack_client_build_success)) {
      if (app.webpack_loading_text) {
        this.body = app.webpack_loading_text;
      } else {
        const filePath = path.resolve(__dirname, './lib/template/loading.html');
        this.body = app.webpack_loading_text = fs.readFileSync(filePath, 'utf8');
      }
    } else {
      yield* next;
    }
  }
});

app.messenger.on(Constant.EVENT_WEBPACK_SERVER_BUILD_STATE, data => {
  app.webpack_server_build_success = data.state;
});

app.messenger.on(Constant.EVENT_WEBPACK_CLIENT_BUILD_STATE, data => {
  app.webpack_client_build_success = data.state;
});
```

#### agent.js 启动koa实例和webpack编译流程

这里client和server编译单独启动koa实例, 而不是一个是因为在测试时发现编译会导致热更新冲突.

- 启动webpack client 编译模式, 负责编译browser运行文件(js,css,image等静态资源)


```js
'use strict';

const webpack = require('webpack');
const koa = require('koa');
const cors = require('kcors');
const app = koa();
app.use(cors());
const Constant = require('./constant');
const Utils = require('./utils');

module.exports = agent => {

  const config = agent.config.webpack;
  const webpackConfig = config.clientConfig;
  const compiler = webpack([webpackConfig]);

  compiler.plugin('done', compilation => {
    // Child extract-text-webpack-plugin:
    compilation.stats.forEach(stat => {
      stat.compilation.children = stat.compilation.children.filter(child => {
        return child.name !== 'extract-text-webpack-plugin';
      });
    });
    agent.messenger.sendToApp(Constant.EVENT_WEBPACK_CLIENT_BUILD_STATE, { state: true });
    agent.webpack_client_build_success = true;
  });

  const devMiddleware = require('koa-webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      children: true,
      modules: false,
      chunks: false,
      chunkModules: false,
    },
    watchOptions: {
      ignored: /node_modules/,
    },
  });

  const hotMiddleware = require('koa-webpack-hot-middleware')(compiler, {
    log: false,
    reload: true,
  });

  app.use(devMiddleware);
  app.use(hotMiddleware);

  app.listen(config.port, err => {
    if (!err) {
      agent.logger.info(`start webpack client build service: http://127.0.0.1:${config.port}`);
    }
  });

  agent.messenger.on(Constant.EVENT_WEBPACK_CLIENT_BUILD_STATE, () => {
    agent.messenger.sendToApp(Constant.EVENT_WEBPACK_CLIENT_BUILD_STATE, { state: agent.webpack_client_build_success });
  });

  agent.messenger.on(Constant.EVENT_WEBPACK_READ_CLIENT_FILE_MEMORY, data => {
    const fileContent = Utils.readWebpackMemoryFile(compiler, data.filePath);
    if (fileContent) {
      agent.messenger.sendToApp(Constant.EVENT_WEBPACK_READ_CLIENT_FILE_MEMORY_CONTENT, {
        fileContent,
      });
    } else {
      agent.logger.error(`webpack client memory file[${data.filePath}] not exist!`);
      agent.messenger.sendToApp(Constant.EVENT_WEBPACK_READ_CLIENT_FILE_MEMORY_CONTENT, {
        fileContent: '',
      });
    }
  });
};

```

- 启动webpack server 编译模式, 负责编译服务器端Node运行文件


```js
'use strict';

const webpack = require('webpack');
const koa = require('koa');
const cors = require('kcors');
const app = koa();
app.use(cors());
const Constant = require('./constant');
const Utils = require('./utils');

module.exports = agent => {
  const config = agent.config.webpack;
  const serverWebpackConfig = config.serverConfig;
  const compiler = webpack([serverWebpackConfig]);

  compiler.plugin('done', () => {
    agent.messenger.sendToApp(Constant.EVENT_WEBPACK_SERVER_BUILD_STATE, { state: true });
    agent.webpack_server_build_success = true;
  });

  const devMiddleware = require('koa-webpack-dev-middleware')(compiler, {
    publicPath: serverWebpackConfig.output.publicPath,
    stats: {
      colors: true,
      children: true,
      modules: false,
      chunks: false,
      chunkModules: false,
    },
    watchOptions: {
      ignored: /node_modules/,
    },
  });

  app.use(devMiddleware);

  app.listen(config.port + 1, err => {
    if (!err) {
      agent.logger.info(`start webpack server build service: http://127.0.0.1:${config.port + 1}`);
    }
  });

  agent.messenger.on(Constant.EVENT_WEBPACK_SERVER_BUILD_STATE, () => {
    agent.messenger.sendToApp(Constant.EVENT_WEBPACK_SERVER_BUILD_STATE, { state: agent.webpack_server_build_success });
  });

  agent.messenger.on(Constant.EVENT_WEBPACK_READ_SERVER_FILE_MEMORY, data => {
    const fileContent = Utils.readWebpackMemoryFile(compiler, data.filePath);
    if (fileContent) {
      agent.messenger.sendToApp(Constant.EVENT_WEBPACK_READ_SERVER_FILE_MEMORY_CONTENT, {
        fileContent,
      });
    } else {
      // agent.logger.error(`webpack server memory file[${data.filePath}] not exist!`);
      agent.messenger.sendToApp(Constant.EVENT_WEBPACK_READ_SERVER_FILE_MEMORY_CONTENT, {
        fileContent: '',
      });
    }
  });
};
```

- 挂载 webpack 内存读取实例到`app`上面, 方便业务扩展实现, 代码如下:


我们通过worker向agent发送消息, 就可以从webpack内存获取文件内容, 下面简单封装一下:

```js
class FileSystem {

  constructor(app) {
    this.app = app;
  }

  readClientFile(filePath, fileName) {
    return new Promise(resolve => {
      this.app.messenger.sendToAgent(Constant.EVENT_WEBPACK_READ_CLIENT_FILE_MEMORY, {
        filePath,
        fileName,
      });
      this.app.messenger.on(Constant.EVENT_WEBPACK_READ_CLIENT_FILE_MEMORY_CONTENT, data => {
        resolve(data.fileContent);
      });
    });
  }

  readServerFile(filePath, fileName) {
    return new Promise(resolve => {
      this.app.messenger.sendToAgent(Constant.EVENT_WEBPACK_READ_SERVER_FILE_MEMORY, {
        filePath,
        fileName,
      });
      this.app.messenger.on(Constant.EVENT_WEBPACK_READ_SERVER_FILE_MEMORY_CONTENT, data => {
        resolve(data.fileContent);
      });
    });
  }
}

```

在app/extend/application.js 挂载webpack实例

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


#### 本地开发webpack热更新内存存储读取和线上应用文件读取逻辑分离

基于上面编译流程实现和webpack实例, 我们很容易实现koa方式的本地开发和线上运行代码分离. 下面我们就以vue 服务器渲染render实现为例:

在egg-view插件开发规范中,我们会在ctx上面挂载render方法, render方法会根据文件名进行文件读取, 模板与数据编译, 从而实现模板的渲染.如下就是controller的调用方式:

```js
exports.index = function* (ctx) {
  yield ctx.render('index/index.js', Model.getPage(1, 10));
};
```

其中最关键的一步是根据文件名进行文件读取, 只要view插件设计时, 把文件读取的方法暴露出来(例如上面的koa的readFile),就可以实现本地开发webpack热更新内存存储读取.

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



## egg+webpack+vue工程解决方案

- [egg-vue-webpack-boilerplate](https://github.com/hubcarl/egg-vue-webpack-boilerplate)基于Vue多页面和单页面服务器渲染同构工程骨架项目
- [egg-view-vue](https://github.com/hubcarl/egg-view-vue) egg view plugin for vue
- [egg-view-vue-ssr](https://github.com/hubcarl/egg-view-vue-ssr) vue server side render solution for egg-view-vue
- [egg-webpack](https://github.com/hubcarl/egg-webpack) webpack dev server plugin for egg, support read file in memory and hot reload
- [egg-webpack-vue](https://github.com/hubcarl/egg-webpack-vue) egg webpack building solution for vue
- [easywebpack](https://github.com/hubcarl/easywebpack) programming instead of configuration, webpack is no longer complex Edit
