---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---


## webpack.config.js 基础配置

```js
// ${app_root}/webpack.config.js
module.exports = {
  framework: 'html'
  entry:{
    //  src/page 目录下的 js 文件将作为 Webpack entry 入口
    include: [src/page/**.js],
    template: 'view/layout.html' 
  },
  options:{
    // 这里可以编写原生的 Webpack 配置文件
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
- entry是必须配置, options, loaders, plugins  done 等非必须
- 更多参数配置请见 [webpack.config.js](/easywebpack/webpack/config) 配置文档 


## 扩展配置

### 配置devtool

这个配置只会在 `env: dev` 生效

```js
module.exports = {
  devtool:'source-map'
}
```

## alias别名配置

**config.alias** : 非必需, Webpack的 `resolve.alias`

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


### 配置css module

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

