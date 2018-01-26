---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---


## 常见问题

### 1. 禁用 node-sass 安装

目前 easywebpack 默认是 开启了 sass 功能，但安装 `node-sass` 时, 会出现安装不成功(二进制本地编译)的情况，这个时候可以按照如下方式禁用 node-sass

- 确保代码引用里面没有用 sass 编写样式
- 删除 `package.json` 里面的  `node-sass` 依赖
- 禁用 webpack 引用 `node-sass` 编译

```js
// ${app_root}/webpack.config.js
module.exports= {
  loaders :{
    sass: false
  }
};
```


### 2. 禁用图片压缩插件 imagemin-webpack-plugin 安装

目前 easywebpack 默认是打正式包时开启了图片压缩功能，但在某些部分机器安装 `imagemin-webpack-plugin` 时, 会出现安装不成功的情况(二进制本地编译, 系统缺少某些本地库)，这个时候可以按照如下方式禁用 node-sass

- 删除 `package.json` 里面的  `imagemin-webpack-plugin` 依赖
- 禁用 webpack 引用 `imagemin-webpack-plugin` 编译

```js
// ${app_root}/webpack.config.js
module.exports= {
  plugins :{
    imagemini: false
  }
};
```


### 3. 引入 node_modules 下 vue 组件报找不到对应的 loader 错误

`easywebpack-vue` 默认的 `vue-loader` 配置排除了 `node_moudles` 目录, 主要目的是避免 `node_moudles` 被扫描，加快构建速度。如果你需要 引入 `node_moudles` 下 vue 组件, 请把对应的组件加入 `include` 配置 或者 用 `exclude` 覆盖默认配置，建议`include` 配置.


#### `include` 配置

例如： 代码在 app/web 目录，  引入 node_modules 下 vue 组件为

```js
// ${app_root}/webpack.config.js
module.exports= {
  loaders :{
    vue: {
      include: [/app\/web/, /node_module\/vue-datepicker-local/]
    }
  }
};
```

相关issue: [import 外部模块失败](https://github.com/hubcarl/egg-vue-webpack-boilerplate/issues/53)

#### `exclude` 配置

```js
// ${app_root}/webpack.config.js
module.exports= {
  loaders :{
    vue: {
      exclude: []
    }
  }
};
```

### 4. Egg + Vue/React 修改静态资源 publicPath 路径

在 Egg + Vue/React 解决方案中, Webpack publicPath 使用的是默认 `publicPath: '/public/'` 配置。


如果要修复默认的publicPath，比如要修改 `/static/`，需要修改两个地方：


#### 首先版本要求

- easywebpack: ^3.5.1
- egg-webpack: ^3.2.5

#### 配置修改

- Webpack `webpack.config.js` 配置添加 `publicPath` 配置覆盖默认配置

```js
// ${app_root}/webpack.config.js
 module.exports = {
    .....
    publicPath: '/static/' 
  };
```

- Egg 配置 `config.default.js` 添加静态资源

```js
// ${app_root}/config/config.local.js
 exports.static = {
    prefix: '/static/',
    dir: path.join(app.baseDir, 'public')
  };
```


### 5. `npm install` 安装后, `npm start` 启动失败

在使用 `easywebpack` 体系构建时, 在首次 `npm start` 时, `easywebpack` 会检查开启的 loader, plugin 插件是否已经安装, 如果没有安装则自动安装.
在这个过程会打印动态安装的 `npm` 模块, 如果安装失败则会导致启动失败, 这个时候你可以手动安装动态安装的 `npm` 模块 或者通过 `easy install` 自动动态安装缺失的依赖, 同时把依赖写入 `package.json` 的 `devDependencies`中. 
然后重新启动. 


`easywebpack` 解决方案只内置了必须的几个常用 loader 和 plugin, 其他 loader (比如 less, stylus) 和 plugin (imagemini) 都是需要项目自己根据需要安装。如果你自己搭建项目，遇到依赖缺失错误，除了手动 npm install 安装以外, 可以使用 `easy install` 命令，安装所有缺失的依赖，默认是 `npm` 方式

```bash
easy install
```

通过 `mode` 参数指定 `cnpm` 方式安装依赖(前提是你全局安装了cnpm)

```bash
easy install --mode cnpm
```

**这里采用动态安装是因为如果把所有插件都内置, 会导致安装很多无用的 `npm` 模块, 安装缓慢, 更严重的是有些 `loader`, `plugin` 如果出现问题, 则导致整个 `easywebpack` 体系不能用.**


### 6. Egg + Vue/React 启动端口修改

Egg 应用本地开发时, npm start 默认启动打开浏览器的端口是 7001, 如果要修改自动打开的端口为6001, 可以在 `config/config.local.js` 中 添加 端口配置

 
```js
// ${app_root}/config/config.local.js
exports.webpack = {
  appPort: 6001
  webpackConfigList: EasyWebpack.getWebpackConfig()
};
```

`egg-webpack` 启动打开浏览器的取端口逻辑: `this.config.webpack.appPort || process.env.PORT || 7001`


### 7. 多项目开发时, 端口占用问题

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
module.exports = {
  port: 9100, 
  ......
};
```

### 8. 骨架项目中前端使用 `async/await` 特性时, 报错：regeneratorRuntime is not defined。

目前骨架前端是没有用 `async/await`，所以没有内置。有需要的自己可以在 .bablerc 文件加 `transform-runtime`，同时安装对应依赖到 `devDependencies` 中即可。

```bash
npm install babel-plugin-transform-runtime --save-dev
```

```js
// ${app_root}/.bablerc
{
  'plugins':['transform-runtime']
}
```

### 9. 本地开发时, 相同的图片名称存在覆盖问题

因本地开发时,图片没有hash,如果存在相同的图片名称, 就会存在覆盖问题。目前可以通过开启本地开发图片 hash 临时解决。

```js
// ${app_root}/webpack.config.js
module.exports= {
  imageHash: true
};
```