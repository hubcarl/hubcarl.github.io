---
layout: webpack/html
description: "专注于技术,切不能沉迷于技术!"
---

## nunjucks 模板构建为纯静态页面项目

### 基于 easywebpack-cli 方式构建

在 [HTML + Webpack构建开发指南](easywebpack/html/dev/) 中, 已实现纯静态 HTML 模板的构建支持.
但 HTML 模板构建时, 有一个不好的地方就是不能以组件的方式复用, 如是考虑通过渲染模版编译成HTML静态模版. 
目前常见的模板引擎有 nunjucks 等渲染模板, 而且社区也有对应的 Webpack loader 支持. 
同时 easywebpack-html 也内置支持了, 我们执行只需要打开开关即可. 

在项目根目录添加 `webpack.config.js` 文件中启动 nunjucks loader.

```js
const path = require('path');
module.exports = {
  framework: 'html', // 指定用easywebpack-html 解决方案, 请在项目中安装该依赖
  entry: 'src/page',
  template: 'src/view/layout.html', // html 模板
  alias: {
    asset: 'asset'
  },
  loaders: {
      nunjucks: {
        options: {
          searchPaths: ['./widget'] // 配置查找模板路径
        }
      }
    }
  },  
  done(){ // 编译完成回调

  }
};

```

Github 骨架项目 [easywebpack-multiple-html-boilerplate](https://github.com/hubcarl/easywebpack-multiple-html-boilerplate) 已提供 nunjucks 实现例子.


### 基于 Webpack 原始配置构建

#### Webpack 原始配置编写

```js
// webpack.config.js
const easywebpack = require('easywebpack-html');
const webpack = easywebpack.webpack;
const merge = easywebpack.merge;
const env = process.env.BUILD_ENV;
const baseWebpackConfig = easywebpack.getWebpackConfig({
    env, // 根据环境变量生成对应配置，可以在 npm script 里面配置，支持dev, test, prod 模式
    entry: 'src/page',
    template: 'src/view/layout.html', // html 模板
    loaders: {
      nunjucks: {
        options: {
          searchPaths: ['./widget'] // 配置查找模板路径
        }
      }
    }
});

// 拿到基础配置, 可以进行二次加工
const webpackConfig = merge(baseWebpackConfig, { 
  // 自定义配置
})

module.exports = webpackConfig;
```


#### `package.json`

```js
 {
   "script" :{
      "build:dev": "cross-env BUILD_ENV=dev NODE_ENV=development webpack --config webpack.config.js",
      "build:test": "cross-env BUILD_ENV=test NODE_ENV=development webpack --config webpack.config.js",
      "build": "cross-env BUILD_ENV=prod NODE_ENV=production webpack --config webpack.config.js"
   }
 }
```