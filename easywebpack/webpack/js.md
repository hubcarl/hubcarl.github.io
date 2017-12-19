---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---


## 配置文件: webpack.config.js

**注意: 首先, 这所讲的 `webpack.config.js` 这份配置不是 Webpack 原生的配置文件, 这是专门给 `easywebpack-cli` 使用的配置文件.
这份配置简化了 Webpack 原生配置, 隐藏众多基础，loader, plugin 等细节, 只提供5个左右的基本配置项, 其中 loader, plugin 通过开关开启就可以使用其功能.在构建时, `easywebpack-cli` 最终会这份简化的配置转换为 Webpack 原生配置.**

<div style="border: 1px solid #cecece; font-weight:bold; margin-bottom:20px;padding: 8px 8px">
easywebpack >=3.5.0版本已兼容原生 Webpack 配置项，比如 entry, target, node, resolve, externals, module.noParse, module.alias, module.rules, devtool,performance等
</div>

目前这里我们仅仅讲解通过 `easywebpack-cli` 的配置编写和构建, 直接基于 `easywebpakc-vue`, `easywebpakc-react`, `easywebpakc-html` ,`easywebpakc-weex` 
解决方案的配置请见解决方案对应章节介绍. 


**要使用 `easywebpack-cli` 进行项目构建和开发, 只需要简单的两步**
 
- 全局安装 [easywebpack-cli](https://github.com/hubcarl/easywebpack-cli)

```bash
npm install -g easywebpack-cli
```

- 编写一份 `easywebpack-cli` 配置文件 `webpack.config.js` 放到要构建项目根目录


开始之前, 我们首先来看看一份最简单的基于easywebpack构建的 `webpack.config.js` 配置


```js
// ${app_root}/webpack.config.js
module.exports = {
  framework: 'html'
  entry:{
    //  src/page 目录下的 js 文件将作为 Webpack entry 入口
    include: [src/page/**.js],
    template: 'view/layout.html' 
  }
}
```


**这份配置能够帮我们完成以下几件事情:**

- framework: 'html' 表示 `easywebpack-cli` 使用 `easywebpack-html` 构建解决方案, 目前 framework 支持 `html`, `vue`, `react`, `weex` 四种.
- 自动读取 src/page 目录的所有 js 文件作为 Webpack Entry 入口, template 为 构建 HTML 的模板(html-webpack-plugin)


**这样一份简单的配置具备以下能力**

- 支持 `easy start` 方式启动 Webpack dev server
- 支持 easy build dev/test/prod 三种环境构建
- 支持纯静态 HTML Webpack构建
- 支持es6, babel, postcss, eslint 能力
- 支持开发期热更新能力,同时Webpack 构建文件不落地磁盘
- 支持编译结果UI展示和访问
- 支持 图片压缩,js压缩, css压缩, extract能力
- 通过 `easy build prod` 即可构建发布模式