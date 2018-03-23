---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---


## webpack.config.js 基础配置

```js
// ${app_root}/webpack.config.js
module.exports = {
   // framework 支持 `js`,`html`, `vue`, `react`, `weex`
  framework: 'html' 
  entry:{
    // src/page 目录下的 js 文件将作为 Webpack entry 入口
    include: [/src\/page\/**.js/],
  },
  template: 'view/layout.html' 
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

- framework: html 表示 `easywebpack-cli` 使用 `easywebpack-html` 构建解决方案, 目前 framework 支持 `js`, `html`, `vue`, `react`, `weex` 五种.
- entry 是必须配置, loaders, plugins, done 等非必须
- 更多参数配置请见 [参数特性配置](http://hubcarl.github.io/easywebpack/webpack/feature) 配置文档 


## 常用配置

#### 1. Egg框架配置

**config.egg** : {Boolean} 特殊参数。

>**使用条件**:只有在使用 Egg 框架进行 Server Side Render 特殊配置, 需要设置为 true, 表示 Webpack 构建的服务端文件放到 `app/view` 目录.

#### 2. 构建框架配置

**config.framework** : {String} 结合 `easywebpack-cli` 使用时 **必须配置**, 支持 `vue`,`react`, `weex`, `html`, `js` 五种配置,  cli 根据 framework 配置获取对应解决方案动态创建 Webpack 配置.

>**使用条件**: 使用 `easywebpack-cli` 构建时, 才需要配置该参数.

- html 解决方案 : easywebpack-html
- vue 解决方案 : easywebpack-vue
- react 解决方案 : easywebpack-react
- weex 解决方案 : easywebpack-weex
- js 解决方案 : easywebpack-js


#### 3. 环境配置 

**config.env** : {String} **非必须**, 目前支持 `dev`, `test`, `prod` 三种环境, 默认 `dev` 

>**使用条件**: 使用 `easywebpack-cli` 构建时, 无需配置该参数. 更多请见 [配置项](http://hubcarl.github.io/easywebpack/webpack/config/)

#### 4. 构建 HTML 模板配置

**config.template** : {String} **非必须** HTML 模板路径地址。

>**使用条件**: 只需要构建 HTML 页面时才需要配置, 比如 Vue, React 前端渲染模式。 

#### 5. 构建目录配置

**config.buildPath** :  {String} **非必须**, Webpack 的 `output.path` . easywebpack 已默认 `${app_root}/public`, 无需配置. 

#### 6. 访问路径配置

**config.publicPath** :  {String} **非必须**, Webpack 的 `output.publicPath` . easywebpack 已默认 `/public/`, 无需配置. 

#### 7. 配置 devtool

**config.devtool** :   {String} **非必须**, 开启 source-map, 默认无。 也就是 Webpack 的 `devtool`。 

```js
module.exports = {
  devtool:'source-map'
}
```

#### 8. alias 别名配置

**config.alias** :  {Object} **非必须**，也就是 Webpack的 `resolve.alias`，但这里有两点简化：
 
- 这里的 alias 会根据项目根目录自动转换为绝对路径，无需自己写项目的根目录。 
- 如果要为 node_modules 添加 alias,可以采用 require.resovle('react') 或者显示指定 node_modules 'node_modules/react'

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

#### 9. commonsChunk 配置

**config.lib** : {Array/Object} **非必须**, Array／Object, 配置需要打包出 webpack commonsChunk 的库或者公共 js 文件

**使用条件：**

- `easywebpack` ^3.5.1 版本开始支持,  默认提取的文件为 `runtime.js` 和 `common.js`
- `easywebpack-cli` 需要 ^3.5.1

**举例：**

```js
module.exports = {
  lib: ['react', 'react-dom']
}
```

#### 10. dll 配置支持

**config.dll** :  {Array/Object} **非必须**，Array／Object, 配置需要打包出 webpack dll 的库或者公共 js 文件。

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


#### 11. 本地开发启用图片hash

**config.imageHash**:  {Boolean} **非必须** 因本地开发时,图片没有hash。 

>**使用条件**: 如果存在相同的图片名称, 就会存在覆盖问题。目前可以通过开启本地开发图片 hash 临时解决。

```js
// ${app_root}/webpack.config.js
module.exports= {
  imageHash: true
};
```

#### 12. 启用 Webpack 编译缓存

**config.cache**: {boolean}, **非必须**。 

>**使用条件**:  easywebpack 3 默认时禁用, easywebpack 4 版本默认开启。

```js
// ${app_root}/webpack.config.js
module.exports= {
  cache: true
};
```

#### 13. 域名代理

**config.host**: {String} **非必须**。 IP地址替换成域名, 域名代理功能需要自己本地配置实现。

>**使用条件**: 本地开发启用域名访问，IP地址替换成域名, 域名代理功能需要自己本地配置实现。具体见[域名代理](http://hubcarl.github.io/easywebpack/webpack/proxy/)

```js
// ${app_root}/webpack.config.js
module.exports= {
  host: 'http://sky.dev.com'
};
```

#### 14. API 接口代理

**config.proxy**: {Object} **非必须**。 本地开发启用 API 接口代理转发解决跨域问题

>**使用条件**: easywebpack 4 版本开始支持。 具体见[域名代理](http://hubcarl.github.io/easywebpack/webpack/proxy/)

```js
// ${app_root}/webpack.config.js
module.exports = {
  proxy: {
    host:  'http://localhost:8888',   
    match: /\/api/
  }
};
```

#### 15. 使用 webpack 部分原始节点配置(非必须)

>**使用条件**:  当提供的配置不满足要求时, 可以使用 Webpack 原始配置项配置。

```js
// ${app_root}/webpack.config.js
module.exports= {
  externals: {
    jquery: 'window.$'
  },
  resolve:{
    alias:{

    },
    extensions:[]
  },
  stats: {

  },
  profile: {

  },
  performance: {

  }
};
```

#### 16. 全部配置项

更多详细配置说明请见： [easywebpack 全部配置项](http://hubcarl.github.io/easywebpack/webpack/config/)