---
layout: webpack/html
description: "专注于技术,切不能沉迷于技术!"
---

## nunjucks 模板构建为纯静态页面项目

在 [HTML + Webpack构建开发指南](easywebpack/html/dev/)中, 已实现纯静态 HTML 模板的构建支持.
但 HTML 模板构建时, 有一个不好的地方就是不能以组件的方式复用, 如是考虑通过渲染模版编译成HTML静态模版. 
目前常见的模板引擎有 nunjucks 等渲染模板, 而且社区也有对应的 Webpack loader 支持. 
同时 easywebpack-html 也内置支持了, 我们执行只需要打开开关即可. 

在项目根目录添加 `webpack.config.js` 文件中启动 nunjucks loader.

```js
const path = require('path');
module.exports = {
  framework: 'html', // 指定用easywebpack-html 解决方案, 请在项目中安装该依赖
  entry: {
    include: 'page'
  },
  alias: {
    asset: 'asset',
    component: 'component',
    framework: 'framework',
    store: 'store'
  },
  loaders: {
      nunjucks: {
        enable: true,
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

