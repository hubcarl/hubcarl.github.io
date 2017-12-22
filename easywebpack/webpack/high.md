---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

## js单独打包

**config.packs**: 可选, {Object} key:value 形式, 其中 key 为生成的文件名, value为要打包的文件

在进行 Webpack 构建, 默认会分离公共的 commonsChunk. 如果需要单独构建一个完整的js文件, 需要 commonsChunk 排除单独打包的chunk 文件, 所以这里对单独打包的文件进行单独配置, 然后 commonsChunk 根据 packs 排除这个单独文件.

```js
module.exports = {
  packs: {
    'sdk': ['app/web/framework/sdk-base.js', 'app/web/framework/sdk-biz.js']
  },
}
```

这样 Webpack 构建的 `sdk.js` 文件是一个完整的 javascript 文件.

## 构建类型配置

**config.type** : 需要结合 `easywebpack-cli` 使用的, 目前支持 `client`, `server`, `web`, `weex`, 其中 `client` 和 `server` 配对使用, `web` 和 `weex` 配对使用.

- client : 客户端(Browser)模式, 比如 `Vue` 和 `React` 前端渲染
- server : 客户端(Browser)模式, 比如 `Vue` 和 `React` 服务端渲染
- web    : Weex 客户端(Browser)模式, 构建 `Web` 页面
- weex   : Weex Native(App)模式, 构建Native运行的 `jsbundle` 文件

>**使用条件**: 使用 `easywebpack-cli` 构建非 SSR 和 非 Weex 双端方案时, 才需要配置该参数. 包括如下场景:

- Vue/React 纯前端渲染构建时, 配置 `type:client`, 
- Weex 只构建时 Weex Native(App)模式时, 配置 `type:weex`
- 只构建 Weex Web模式时, 配置 `type:web`


## 回调函数

**config.done**: {Function} 编译完成回调方法

**config.create**: {Function} 扩展方法, 调用`create`方法之前调用.

**根据 `config.type` 提供对应的 `on[this.type]` (type首字母大写)方法**

- `easywebpack-vue` 和 `easywebpack-react` 提供 `onClient` 和 `onServer` 方法
- `easywebpack-weex` 提供 `onWeb` 和 `onWeex` 方法


## 更多配置

[完整配置参数](/easywebpack/webpack/config/)