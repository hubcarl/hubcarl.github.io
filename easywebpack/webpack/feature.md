---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

## 特性扩展支持

### 1. 分离css文件

**config.cssExtract** : 非必需，{boolean}. 是否分离样式为独立css文件

- vue ssr 开发模式(dev)默认为 false， 发布模式（test or prod）为 true
- react ssr 开发模式和发布模式都为 true


### 2. css module

**config.cssModule** : 非必需，{boolean,object} 开启 css module 特效

- css module 特性与普通 css 的loader 配置是冲突, 所以如果部分开启css module, 必须指定配置需要 css module 的样式文件. 

```js
module.exports = {
  cssModule: {
    include: 'app/web/page/css/module'
  }
}
```

- 如果全站都使用 css module 特性, 可以这样配置

```js
module.exports = {
  cssModule: true
}
```

### 3. 开启 loader 和 plugin 插件自动检测功能

**config.install** : 非必需，默认配置如下。

```js
module.exports = {
  install:{
    check: false // 默认禁用检测 loader 和 plugin 是否安装
    npm: 'npm'   // 动态安装时，默认采用 npm。 你可以使用 cnpm，tnpm等等 
  }
}
```

`easywebpack` 本身内置比较常用的 loader 和 plugin npm 插件， 但并没有显示的把依赖写到 `dependencies`. 

- 当 `install.check=true` 时, 当运行 npm start 或 easy 命令时，会自动检查开启的 loader 和 plugin 是否已安装，如果没有安装，则自动安装， 并把配置依赖写到 devDependencies 
- 当 `install.check=false` (也就是默认不配置)时, 如果没有安装指定的 loader 或 plugin 运行会报错。 如果 loader 没有安装，会提示对应的文件不能处理； 如果 plugin 未安装，则会出现如下错误：

>dynamic create plugin[progress] error, please check the npm module [progress-bar-webpack-plugin] whether installed. if not installed, please execute the command [npm install progress-bar-webpack-plugin --save-dev] in command line

这个时候，你需要自己手动安装缺失的插件。


### 4. js单独打包

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

### 5. 构建类型配置

**config.type** :  需要结合 `easywebpack-cli` 使用的, 目前支持 `client`, `server`, `web`, `weex`, 其中 `client` 和 `server` 配对使用, `web` 和 `weex` 配对使用.

>**easywebpack-cli构建纯前端构建需要配置:  `type: 'client' `**

- client : 客户端(Browser)模式, 比如 `Vue` 和 `React` 前端渲染
- server : 客户端(Browser)模式, 比如 `Vue` 和 `React` 服务端渲染
- web    : Weex 客户端(Browser)模式, 构建 `Web` 页面
- weex   : Weex Native(App)模式, 构建Native运行的 `jsbundle` 文件

>**使用条件**: 使用 `easywebpack-cli` 构建非 SSR 和 非 Weex 双端方案时, 才需要配置该参数. 包括如下场景:

- Vue/React 纯前端渲染构建时, 配置 `type:client`, 
- Weex 只构建时 Weex Native(App)模式时, 配置 `type:weex`
- 只构建 Weex Web模式时, 配置 `type:web`


### 6. 回调函数

**config.done**: {Function} 编译完成回调方法

**config.create**: {Function} 扩展方法, 调用`create`方法之前调用.

**根据 `config.type` 提供对应的 `on[this.type]` (type首字母大写)方法**

- `easywebpack-vue` 和 `easywebpack-react` 提供 `onClient` 和 `onServer` 方法
- `easywebpack-weex` 提供 `onWeb` 和 `onWeex` 方法


### 7. 更多配置

[webpack.config.js配置项](/easywebpack/webpack/config)