---
layout: webpack/webpack 
description: "专注于技术,切不能沉迷于技术!"
---
## easywebpack 是什么

easywebpack 是基于 webpack 的前端工程化解决方案。旨在解决 webpack 项目构建复杂,使用成本高,复用低,维护成本高等工程效率问题。基于 easywebpack 工程化方案, 你能非常简单容易的对各种前端项目进行工程化建设，及时享受最新的特性, 同时你能享受诸如热更新, 多进程极速编译, 性能优化, 惰性加载, TypeScript构建, 单页面构建, 多页面构建, 前端渲染构建, 服务端渲染构建等一体化解决方案. 


## easywebpack 介绍

首先, 使用 easywebpack 之前, 你需要了解一下 easywebpack 提供的能力:

- easywebpack 是对 Webpack 配置进行封装简化, 是 Webpack 的上层框架, 有自己的一套简单的配置规则, 让开发者从复杂的各种具体 loader, plugin 中解脱出来.
- easywebpack 本身不提供任何前端框架的构建能力, 需要你基于 easywebpack 扩展出对应前端框架的构建解决方案, 目前已扩展出 Vue/React/Weex/HTML解决方案, 你可以直接使用这些解决方案.
- easywebpack ^3.5.0 版本开始，兼容 Webpack 原生节点配置。


## easywebpack 基础能力

easywebpack 在 Webpack 的基础上, 主要做了以下三件事情:

- 内置与构建框架无关的基础配置, 包括通用基础配置, 通用 loader, 通用 plugin. 详情请见 [内置loader](/easywebpack/webpack/loader/) 和 [内置plugin](/easywebpack/webpack/plugin/)   
- 内置热更新, image/javascript/css压缩, sass, less, stylus, postcss, eslint, babel等基础能力, 通过开关即可开启和禁用
- 内置开发, 测试, 正式三种环境, 简化开发者配置


![image](/img/webpack/easywebpack.png)


## easywebpack 构建解决方案

![image](/img/webpack/easywebpack.solution.png)

![image](/img/webpack/WebpackBuilder.png)

- [easywebpack-vue](https://github.com/hubcarl/easywebpack-vue.git) Vue 前端和服务端构建解决方案 
- [easywebpack-react](https://github.com/hubcarl/easywebpack-react.git) React 前端和服务端构建解决方案
- [easywebpack-weex](https://github.com/hubcarl/easywebpack-weex.git) Weex Native 端和Web端构建解决方案
- [easywebpack-html](https://github.com/hubcarl/easywebpack-html.git) 纯静态 HTML/Nunjucks 页面构建解决方案



## 基于 easywebpack 构建的项目骨架

>**项目骨架, 你可以通过 [easywebpack-cli](https://github.com/hubcarl/easywebpack-cli) 命令行工具进行初始化和构建.**

- [egg-vue-webpack-boilerplate](https://github.com/hubcarl/egg-vue-webpack-boilerplate) 基于 Egg + Vue + Webpack 服务端和客户端渲染项目骨架

- [egg-react-webpack-boilerplate](https://github.com/hubcarl/egg-react-webpack-boilerplate) Egg + React + Webpack  服务端和客户端渲染项目骨架

- [easywebpack-weex-boilerplate](https://github.com/hubcarl/easywebpack-weex-boilerplate) 基于 Weex Native 端和 Web 端构建解决方案渲染项目骨架

- [easywebpack-multiple-html-boilerplate](https://github.com/hubcarl/easywebpack-multiple-html-boilerplate)  纯静态 Webpack + HTML + 页面构建项目骨架

- [easywebpack-vue-client-render-boilerplate](https://github.com/hubcarl/easywebpack-cli-template/tree/master/boilerplate/vue) 基于 Vue + Webpack 前端渲染的项目骨架

- [easywebpack-react-client-render-boilerplate](https://github.com/hubcarl/easywebpack-cli-template/tree/master/boilerplate/react) 基于 React + Webpack 前端渲染的项目骨架
