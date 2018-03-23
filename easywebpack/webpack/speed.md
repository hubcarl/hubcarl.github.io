---
title: webpack 极速编译
layout: webpack/webpack
description: "webpack 极速编译 cache-loader  多进程"
---

## easywebpack 极速编译



### DLL 公共提取


**Webpack 通过 [DLLPlugin 和 DLLReferencePlugin](https://doc.webpack-china.org/plugins/dll-plugin/) 可以实现公共类库的单独提取，能极大大提升了构建的速度.**

只需要在 `webpack.config.js` 文件添加 dll 节点配置即可完成 `dll` 整个流程。

```js
module.exports = {
  dll:['vue','vuex','axios']
}
```

相信方案：[Webpack DLL 工程化实现](http://hubcarl.github.io/easywebpack/webpack/dll/)


### 开启 cache-loader 缓存编译

easywebpack 可以通过 `config.cache` 开启 `babel-loader`c 和 `ts-loader` 缓存编译, 速度有显著提升

```js
//${app_root}/webpack.config.js
module.exports = {
  cache: true
}
```


### Egg SSR 构建多进程编译


在 Egg SSR 项目中, 我们通过 `egg-webpack` 实现本地开发模式编译，早期版本需要在 Egg 项目的 `config/config.local.js` 配置 `webpackConfigList` 配置

```js
const EasyWebpack = require('easywebpack-vue');
module.exports = {
  webpackConfigList: EasyWebpack.getWebpackConfig();
};
```

这种方式只会采用单进程编译模式，速度会慢一些， 我们可以通过去掉 `webpackConfigList` 配置即可开启 `egg-webpack` 开启多进程编译模式。 结合 `DLL 公共提取` 和 `cache-loader` 缓存编译模式, 构建速度可以从 40s 减少到 10 s 以内。
