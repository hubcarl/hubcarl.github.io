---
title: webpack CommonsChunk 工程化实现
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

## Webpack CommonsChunk 公共代码提取

easywebpack 3.5.0 版本支持直接 `webpack.config.js` 文件添加 lib 节点配置即可完成 `commonsChunk` 公共库的配置。

```js
module.exports = {
  lib:['vue','vuex','axios']
}
```

这样默认生成的功能代码文件名称为 `common.js`, 你可以通过如下方式进行自定义

```js
module.exports = {
  lib:{
    name: 'commonlib',
    lib: ['vue','vuex','axios']
  }
}
```