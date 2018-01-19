---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---


## webpack.config.js 基础配置

```js
// ${app_root}/webpack.config.js
module.exports = {
   // framework 支持 `html`, `vue`, `react`, `weex`
  framework: 'html' 
  entry:{
    // src/page 目录下的 js 文件将作为 Webpack entry 入口
    include: [/src\/page\/**.js/],
    template: 'view/layout.html' 
  },
  loaders:{
    // 默认可以不用配置, 添加或扩展请见配置loaders章节  
  },
  pugins:{
    // 默认可以不用配置, 添加或扩展请见配置loaders章节  
  },
  done(){
    // Webpack 编译完成回调, 默认可以不用配置,当你需要编译完成做某某事情(比如上传cdn)才需要配置
  }
}
```

- framework: html 表示 `easywebpack-cli` 使用 `easywebpack-html` 构建解决方案, 目前 framework 支持 `html`, `vue`, `react`, `weex` 四种.
- entry 是必须配置, loaders, plugins, done 等非必须
- 更多参数配置请见 [参数特性配置](/easywebpack/webpack/feature) 配置文档 


## 常用基础配置项

### 1. 配置devtool

这个配置只会在 `env: dev` 生效

```js
module.exports = {
  devtool:'source-map'
}
```

### 2. alias别名配置

**config.alias** : 非必需，也就是 Webpack的 `resolve.alias`，但这里有两点简化：
 
- 这里的 alias 会根据项目根目录自动转换为绝对路径，无需自己写项目的根目录。 
- 如果要为 node_modules 添加 alias,可以采用 require.resovle('react') 或者显示制定node_modules 'node_modules/react'

```js
module.exports = {
  alias:{
   asset: 'app/web/asset',
   component: 'app/web/component',
   framework: 'app/web/framework',
   store: 'app/web/store'
  }
}
```

### 3. commonsChunk 配置

**config.lib** : 非必需, Array／Object, 配置需要打包出 webpack commonsChunk 的库或者公共 js 文件

**使用条件：**

- `easywebpack` ^3.5.1 版本开始支持,  默认提取的文件为 `runtime.js` 和 `common.js`
- `easywebpack-cli` 需要 ^3.5.1

**举例：**

```js
module.exports = {
  lib: ['react', 'react-dom']
}
```

### 4. dll 配置支持

**config.dll** : 非必需，Array／Object, 配置需要打包出 webpack dll 的库或者公共 js 文件

**使用条件：**

- `easywebpack` ^3.5.1 版本开始支持, 默认提取的文件为 `vendor.js`. 
- `easywebpack-cli` 需要 ^3.5.1

**举例：**

```js
module.exports = {
  dll: ['react', 'react-dom']
}
```

- 当配置了 `dll` 节点时， npm start 或者 easy build 构建时，会检查 dll 文件是否存在，不存在则会先构建dll文件，构建完成后再接着构建页面，一步完成。 
- 当构建的工程较大或引入的第三方组件较多时，`dll` 方案相比  `commonsChunk` 时， 能明显的提高构建速度(通过一个实际项目测试发现，构建速度减少了2/3)。
