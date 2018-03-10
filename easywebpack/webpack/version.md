---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

# easywebpack 版本发布说明

## ^4.0.0

**Webpack 升级为 ^4.1.0 版本**,  相关插件和解决方案使用 Webpack 4 版本说明

### 支持 Webpack 4 插件版本

- easywebpack: ^4.0.0
- easywebpack-cli: ^3.8.0
- easywebpack-vue: ^4.0.0
- easywebpack-react: ^4.0.0
- easywebpack-html: ^4.0.0
- easywebpack-js: ^4.0.0(待升级)
- egg-webpack: ^4.0.2
- webpack-tool: ^4.0.0
- webpack-manifest-resource-plugin: ^4.0.0

### 功能说明

#### easywebpack 相关

- webpack 3 升级为 webpack 4
- easywebpack 内置 babel-core, babel-eslint, babel-loader, postcss-loader, progress-bar-webpack-plugin, webpack-manifest-resource-plugin, service-worker-precache-webpack-plugin 插件，项目无需安装
- easywebpack sass-loader 默认开启改为禁用
- easywebpack 内置 eslint-loader 升级 2.0.0
- easywebpack 内置 file-loader 升级 1.1.10
- easywebpack 设置 mode 配置
- easywebpack runtime 和 splitChunk 支持
- easywebpack-vue 内置 vue-loader 升级 14.1.1
- easywebpack-vue 内置 { transformToRequire: { img: ['url', 'src'] } } 配置
- easywebpack 内置 extract-text-webpack-plugin 升级 4.0.0-beta.0
- 升级 webpack-hot-middleware 为最新版本
- hack webapck4 code node ssr build, 待 Webpack 发布 [6681](https://github.com/webpack/webpack/issues/6681)
- webpack-tool 支持 koa-proxy 代理设置
- easywebpack config 合并重构
- easywebpack 移除历史兼容代码


### 升级说明

#### Egg + Vue 项目

- easywebpack-vue: ^4.0.0
- egg-webpack: ^4.0.2
- 项目 package.json 删除 easywebpack 内置 babel-core, babel-eslint, babel-loader, postcss-loader, progress-bar-webpack-plugin, webpack-manifest-resource-plugin 插件
- [egg-vue-webpack-boilerplate 项目 webpack4 分支](https://github.com/hubcarl/egg-vue-webpack-boilerplate/tree/webpack4)
- hack webpack[NodeMainTemplatePlugin.js](https://github.com/hubcarl/egg-vue-webpack-boilerplate/blob/webpack4/script/webpack4/webpack/lib/node/NodeMainTemplatePlugin.js), 
please see issue [6681](https://github.com/webpack/webpack/issues/6681), 同时需要在 `package.json` script 中加入：`"postinstall": "node ./script/postinstall.js"`
- 如果 webpack.config.js 配置了 loaders.vue 的 transformToRequire 配置, 请去掉, 以内置

#### Egg + React 项目

- easywebpack-react: ^4.0.0
- egg-webpack: ^4.0.2
- 项目 package.json 删除 easywebpack 内置 babel-core, babel-eslint, babel-loader, postcss-loader, progress-bar-webpack-plugin, webpack-manifest-resource-plugin 插件
- [egg-react-webpack-boilerplate 项目 webpack4 分支](https://github.com/hubcarl/egg-react-webpack-boilerplate/tree/webpack4)
- Hack webpack4 code[NodeMainTemplatePlugin.js](https://github.com/hubcarl/egg-react-webpack-boilerplate/blob/webpack4/script/webpack4/webpack/lib/node/NodeMainTemplatePlugin.js), please see issue [6681](https://github.com/webpack/webpack/issues/6681), 同时需要在 `package.json` script 中加入：`"postinstall": "node ./script/postinstall.js"`

### 纯静态页面构建

- easywebpack-html: ^4.0.0
- 项目 package.json 删除 easywebpack 内置 babel-core, babel-eslint, babel-loader, postcss-loader, progress-bar-webpack-plugin, webpack-manifest-resource-plugin 插件
- [multiple-html-boilerplate 项目 webpack4 分支](https://github.com/hubcarl/easywebpack-multiple-html-boilerplate/tree/webpack4)


## ^3.7.0

- easywebpack: ^3.7.0
- service-worker-register: ^1.2.0
- egg-serviceworker: ^1.0.0
- service-worker-precache-webpack-plugin: ^1.2.0

支持创建 service-worker.js 文件和 service worker 注册  

## ^3.6.0

- easywebpack-vue: ^3.6.0
- easywebpack-react: ^3.6.0

### 新增 typescript 构建支持

支持通过 Webpack 构建 typescript 项目, 默认开启 tslint 检查

#### 启用 typescript 编译

```js
// webpack.config.js
module.exports = {
  loaders:{
    typescript: true
  }
}
```

#### 启用 tslint 

自动修复功能，tslint 默认启用, 自动修复默认禁用，可以通过如下方式开启

```js
// webpack.config.js
module.exports = {
  loaders:{
    tslint:{
      options: {
        fix: true
      }
    }
  }
}
```

### 支持本地开发域名代理转发

**前提：**

- 代理域名能够映射到本机ip地址的功能需要你自己在电脑上面配置。如果是实际的存在的域名，理论上面就不需要自己配置域名映射。

- 该功能只在 Egg 应用构建本地开发使用。

```js
// webpack.config.js
module.exports = {
  host: 'http://app.debug.com'
}
```

- 应用访问的地址是： 'http://app.debug.com'
- HMR地址是：http://app.debug.com:9000/__webpack_hmr
- 如何在本地通过 nginx 和 dnsmasq 在本地搭建域名服务：[nginx 和 dnsmasq 在本地搭建域名服务](/easywebpack/webpack/nginx)

 
### 支持 Webpack 配置扩展使用

可以直接基于 `easywebpack` 以及解决方案进行原生 Webpack 编写

#### 直接基于 easyewbpack 编写配置

```js
// webpack.config.js
const easywebpack = require('easywebpack');
const webpack = easywebpack.webpack;
const merge = easywebpack.merge;
const env = process.env.BUILD_ENV; 
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

#### 命令行执行

```bash
webpack --config webpack.config.js
```



#### 直接基于解决方案编写配置

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

#### 命令行执行

```bash
webpack --config webpack.config.js
```

### easywebpack-cli 新增杀端口功能

在本地开发时, 时不时遇到端口占用问题, 特别时 windows 平台, 杀进程很繁琐, 通过 `easy kill` 可以快速实现杀掉端口占用进程。

```bash
easy kill 7001
easy kill 7001,9000,9001
```

### easywebpack-cli 构建大小分析

在项目开发时， 当页面构建的文件太大, 我们可以直接通过 cli 提供功能进行构建大小分析


- 通过 -s 参数启动构建大小分析工具, 支持 analyzer(webpack-bundle-analyzer) 和 stats(stats-webpack-plugin) , 默认用 analyzer插件。

```bash
easy build -s 
```

- 使用 stats(stats-webpack-plugin) 构建大小分析工具

```bash
easy build -s stats
```

## ^3.5.0

#### 1. easywebpack-cli ^1.3.0

- 新增 webpack dll 构建支持
- 新增 `easy clean`  和 `easy open` 命令，用于 dll 缓存清理和打开dll缓存目录功能

#### 2. manifest 插件切换

新增 webpack-manifest-resource-plugin(^2.0.2) 替换 webpack-manifest-plugin。 

之前的 manifest 依赖关系是在运行期间解析的，现在改为构建期组装好资源依赖关系

- webpack-manifest-plugin

```json
// ${app_root}/config/manifest.json
{
    "app/app.js": "/public/js/app/app.2cf6dfd1.js",
    "app/app.css": "/public/css/app/app.cda9bc64.css",
    "common.js": "/public/js/common.b59f7169.js",
    "common.css": "/public/css/common.cda9bc64.css"
}
```

- webpack-manifest-resource-plugin

```json
// ${app_root}/config/manifest.json
{
    "app/app.js": "/public/js/app/app.2cf6dfd1.js",
    "app/app.css": "/public/css/app/app.cda9bc64.css",
    "common.js": "/public/js/common.b59f7169.js",
    "common.css": "/public/css/common.cda9bc64.css",
    "deps": {
        "app/app.js": {
        "js": [
            "/public/js/vendor.337ab787.js",
            "/public/js/common.b59f7169.js",
            "/public/js/app/app.2cf6dfd1.js"
        ],
        "css": [
            "/public/css/common.cda9bc64.css",
            "/public/css/app/app.cda9bc64.css"
        ]
    }
}
```

#### 3. 新增 webpack-node-externals

node externals 改为 webpack-node-externals 插件实现: [https://github.com/hubcarl/easywebpack/issues/10](https://github.com/hubcarl/easywebpack/issues/10)

#### 4. 新增 webpack-bundle-analyzer

内置构建大小分析插件，默认禁用， 通过 plugins.analyzer = true 开启

#### 5. 新增 stats-webpack-plugin

内置构建大小分析插件，默认禁用， 通过 plugins.stats = true 开启



## 3.4.2

- easywebpack-cli ^1.2.0
- webpack-manifest-plugin ^2.0.2


发布历史:[https://github.com/hubcarl/easywebpack/blob/next/History.md](https://github.com/hubcarl/easywebpack/blob/next/History.md)
