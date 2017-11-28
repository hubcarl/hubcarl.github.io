---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---


## WebpackBaseBuilder 构造参数 `config`

```javascript
class WebpackBaseBuilder {
  constructor(config) {
    // write your code......
  }
}  
```

### 最基本的配置

如果只是简单构建出 js 文件, 只需要如下配置:

```js
module.exports = {
  entry:{
    //  src/page 目录下的 js 文件将作为 Webpack entry 入口
    include: [src/page/**.js] 
  }
}
```

### 构建出 HTML 文件

如果我们要构建出静态 HTML, 我们只需要添加 entry.template 配置即可


```js
module.exports = {
  entry:{
    //  src/page 目录下的 js 文件将作为 Webpack entry 入口
    include: [src/page/**.js],
    template: 'view/layout.html'
  }
}
```





### 采用 `easywebpack-cli` 构建

- 如果以上配置再加上 `framework` 配置(支持 `html`, `vue`, `react`, `weex`), 就可以直接通过 `easywebpack-cli` 完成构建

- 如果直接使用 `easywebpac-vue`,  `easywebpac-react`,  `easywebpac-weex` 进行配置编写, 以上配置可以通过 API 完成, 配置可以简化.  


  
## easywebpack 内置默认配置  

内置 `dev `,  `test `,  `prod` 三种环境支持, 通过 `config.env` 或者 `setEnv(env)` 设置 

### 正式环境

```js
exports.defaultConfig = {
  baseDir: process.cwd(),
  buildPath: 'public',
  publicPath: '/public/',
  alias: {},
  packs: {},
  cdn: {},
  hot: false,
  hash: true,
  miniJs: true,
  miniCss: true,
  miniImage: true,
};
```

### 开发环境

与 `defaultConfig` 进行merge操作

```js
exports.devConfig = {
  hot: true,
  hash: false,
  miniJs: false,
  miniCss: false,
  miniImage: false,
};
```

### 测试环境

与 `defaultConfig` 进行merge操作

```js
exports.testConfig = {
  hot: false,
  hash: true,
  miniJs: false,
  miniCss: false,
  miniImage: false
};
```
