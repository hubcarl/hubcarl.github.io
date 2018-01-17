---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

## easywebpack 获取原生 Webpack 配置

在 [配置文件](http://127.0.0.1:4000/easywebpack/webpack/js/) 章节已经说明: **webpack.config.js 这份配置不是 Webpack 原生的配置文件, 这是专门给 easywebpack-cli 使用的配置文件**

如果你有需求需要获取原生配置, 可以通过下面介绍的方式获取解决方案获取原生 Webpack 配置,  支持 `getWebpackConfig` 和 `create` 方式.


**EasyWebpack.getWebpackConfig(config)**

这种获取方式是指通过解决方案获取配置, 参数 `config` 支持如下三种配置:

- config 为 `null` 或 `undefined` 时, 目前读取项目根目录下的 `webpack.config.js`
- config 为 `object` 时, 也就是直接传入 `webpack.config.js` 的配置
- config 为 `string` 时, 表示指定  `webpack.config.js` 自定义配置文件路径


**WebpackBuilder.create方式**

除了通过解决方案提供 `EasyWebpack.getWebpackConfig` 方式, 我们可以直接通过获取 Builder 获取配置


```js
const EasyWebpack = require('easywebpack-html');
const webpackConfig = new EasyWebpack.WebpackClientBuilder(config).create();
```

### HTML解决方案

- 内置方法

```js
const EasyWebpack = require('easywebpack-html');
const webpackConfig = EasyWebpack.getWebpackConfig(config);
```

- builder方式

```js
const EasyWebpack = require('easywebpack-html');
const webpackConfig = new EasyWebpack.WebpackClientBuilder(config).create();
```

### Vue 解决方案

- 内置方法

默认是获取的配置是前端构建 Webpack 配置 和  Node 构建 Webpack 配置，总共两个配置

```js
const EasyWebpack = require('easywebpack-vue');
const webpackConfig = EasyWebpack.getWebpackConfig(config);
```

- 简化方式

只获取前端一个 Webpack  构建配置

```js
// target: web 表示只获取前端构建 Webpack 配置
const easywebpack = require('easywebpack-vue');
const webpack = easywebpack.webpack;
const merge = easywebpack.merge;
const baseWebpackConfig = easywebpack.getWebpackConfig({
    env, // 根据环境变量生成对应配置，可以在 npm script 里面配置，支持dev, test, prod 模式
    target : 'web', // target: web 表示只获取前端构建 Webpack 配置
    entry:{
        app: 'src/index.js'
    }
});
// 拿到基础配置, 可以进行二次加工
module.exports = merge(baseWebpackConfig, {
   
})
```

- builder方式


```js
const EasyWebpack = require('easywebpack-vue');
// 浏览器前端运行配置
const webpackConfig = new EasyWebpack.WebpackClientBuilder(config).create();
// Node端运行配置
const webpackConfig = new EasyWebpack.WebpackServerBuilder(config).create();
```



### React 解决方案


- 内置方法

默认是获取的配置是前端构建 Webpack 配置 和  Node 构建 Webpack 配置，总共两个配置

```js
const EasyWebpack = require('easywebpack-react');
const webpackConfigList = EasyWebpack.getWebpackConfig(config);
```

- 简化方式

只获取前端一个 Webpack  构建配置

```js
// target: web 表示只获取前端构建 Webpack 配置
const easywebpack = require('easywebpack-react');
const webpack = easywebpack.webpack;
const merge = easywebpack.merge;
const baseWebpackConfig = easywebpack.getWebpackConfig({
    env, // 根据环境变量生成对应配置，可以在 npm script 里面配置，支持dev, test, prod 模式
    target : 'web', // target: web 表示只获取前端构建 Webpack 配置
    entry:{
        app: 'src/index.js'
    }
});
// 拿到基础配置, 可以进行二次加工
module.exports = merge(baseWebpackConfig, {
   
})
```

- builder方式

```js
const EasyWebpack = require('easywebpack-react');
// 浏览器前端运行配置
const webpackConfig = new EasyWebpack.WebpackClientBuilder(config).create();
// Node端运行配置
const webpackConfig = new EasyWebpack.WebpackServerBuilder(config).create();
```


### Weex 解决方案

- 内置方法
```js
const EasyWebpack = require('easywebpack-weex');
const webpackConfig = EasyWebpack.getWebpackConfig();
```

- builder方式

```js
const EasyWebpack = require('easywebpack-weex');
// Weex Native App Webpack编译配置
const webpackConfig = new EasyWebpack.WebpackWeexBuilder(config).create();
// Weex Web Webpack编译配置
const webpackConfig = new EasyWebpack.WebpackWebBuilder(config).create();
```
