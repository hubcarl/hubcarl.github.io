---
title: 前端工程化脚手架easywebpack-cli
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

## 1. 概述

现如今，前端技术发展非常快，技术，框架，工具也多了起来，比如现如今基于Vue/React/Angular等框架的SPA应用，多页面应用，Server Side Render等技术。 当你想快速学习一下某一个框架或者基于某一框架的解决方案时，网上的资料也非常多，但会发现会遇到各种各样的问题，例如工具框架版本问题，Webpack构建问题，Vuex项目怎么搭建，SPA应用该怎么搭建等等问题，学习成本较高。基于这些问题，实现了一个基于Webpack构建的脚手架 [easywebpack-cli](https://github.com/hubcarl/easywebpack-cli)， 通过该脚手架能够帮助你快速初始化基于Vue/React/Weex框架的项目骨架，包括SPA应用，多页面应用，Server Side Render(Egg). 初始化的项目可以直接用于正式项目开发，支持本地开发模式和发布模式。


## 2. `easywebpack-cli` 介绍

基于 [easywebpack](https://github.com/hubcarl/easywebpack) 前端工程化解决方案构建的脚手架 [easywebpack-cli](https://github.com/hubcarl/easywebpack-cli) 支持一下特性：

- 支持 Vue/React/Weex 框架项目的初始化，包括 SPA应用，多页面应用，Server Side Render(Egg)项目
- 支持命令行 Webpack 构建，包括Webpack配置信息打印(调试)和获取
- 提供构建结果 UI 导航展现和访问。 

目前支持如下三种框架构建，Angular 或其他框架支持也非常简单，有兴趣的可以找我沟通参与实现。

- `vue` [easywebpack-vue](https://github.com/hubcarl/easywebpack-vue.git) 
- `react` [easywebpack-react](https://github.com/hubcarl/easywebpack-react.git)
- `weex` [easywebpack-weex](https://github.com/hubcarl/easywebpack-weex.git)
- `html` [easywebpack-html](https://github.com/hubcarl/easywebpack-html.git)

其中 `Vue` 和 `React` 支持客户端运行模式构建和服务端模式构建, `Weex` 支持Native模式和Web模式构建.

- 支持 `Vue`,`React`, `Weex` Webpack 编译和Server功能
- 支持 `Vue`,`React`, `Weex` easywepback-cli 配置初始化[easywebpack-cli-template](https://github.com/hubcarl/easywebpack-cli-template.git)
- 支持 `Vue`,`React`, `Weex` webpack config build 配置初始化[easywebpack-cli-template](https://github.com/hubcarl/easywebpack-cli-template.git)
- 支持 `Vue`,`React`, `Weex` client render boilerplate 项目初始化[easywebpack-cli-template](https://github.com/hubcarl/easywebpack-cli-template.git)
- 支持 `Vue`,`React` server side render boilerplate 项目初始化[egg-vue-webpack-boilerplate](https://github.com/hubcarl/egg-vue-webpack-boilerplate.git), [egg-react-webpack-boilerplate](https://github.com/hubcarl/egg-react-webpack-boilerplate.git)


备注：easywebpack 最新版本基于 Webpack3 实现，也就是通过 `easywebpack-cli` 的项目都是基于 Webpack3 构建的。


## 3. `easywebpack-cli` 使用

### 3.1. 运行

```bash
npm i easywebpack-cli  -g
```

安装成功以后, 就可以在命令行中使用 `easywebpack` 命令, 比如 `easywebpack init`, `easywebpack build`, `easywebpack server`, `easywebpack print` 等


### 3.2. 运行


```bash
easywebapck -h
```

Usage: easywebpack [command] [options]


  Options:

    -V, --version          output the version number
    -f, --filename [path]  webpack config file name, default webpack.config.js
    -w, --watch            webpack watch and hot-update
    -m, --hash             webpack md5 hash js/css/image
    -c, --compress         webpack compress js/css/image
    -b, --build [option]   w(watch), m(hash) , c(compress), ex: wm/wc/mc/wmc
    -h, --help             output usage information


  Commands:
  
    init [options]         init webpack config or boilerplate for Vue/React/Weex
    install                npm install
    print  [env] [options] print webpack config, support print by env or config node key
    build  [env]           webpack building
    server [env]           webpack building and start server



### 3.3. 命令介绍

#### 3.3.1 配置模板和Boilerplate初始化

- easywebpack init

> step one:

![image](/img/webpack/cli-init-step-one.png)

> step two:

![image](/img/webpack/cli-init-step-two.png)

初始化模板项目源代码：[easywebpack-cli-template](https://github.com/hubcarl/easywebpack-cli-template.git)

#### 3.3.2 编译举例

- easywebpack build

- easywebpack build -f build/webpack.config.js

- easywebpack build -c

- easywebpack build dev

- easywebpack build test

- easywebpack build prod

- easywebpack build -b wmc 

默认读取项目根目录下的 `webpack.config.js` 配置

#### 3.3.3  编译和启动服务举例

- easywebpack server

- easywebpack server -f build/webpack.config.js

- easywebpack server dev

- easywebpack server test

- easywebpack server prod

- easywebpack server -b wmc 

默认读取项目根目录下的 `webpack.config.js` 配置

运行完成自动打开编译结果页面 :  http://127.0.0.1:8888/debug

![image](/img/webpack/easywebpack-build-nav.png)

#### 3.3.4 动态安装

`easywebpack` 解决方案只内置了必须的几个常用 loader 和 plugin, 其他 loader (比如 less, stylus) 和 plugin (imagemini) 都是需要项目自己根据需要安装。
如果你自己搭建项目，遇到依赖缺失错误，除了手动 npm install 安装以外, 可以使用 `easy install` 命令，安装所有缺失的依赖，默认是 `npm` 方式

```bash
easy install
```

通过 `mode` 参数指定 `cnpm` 方式安装依赖(前提是你全局安装了cnpm)

```bash
easy install --mode cnpm
```

#### 3.3.5 清除缓存

```bash
easy clean
```

#### 3.3.6 打开缓存目录

```bash
easy open
```

#### 3.3.7 杀进程(3.6.0)

```bash
easy kill 7001
easy kill 7001,9000,9001
```

#### 3.3.8 构建大小分析(3.6.0)

通过 `-s` 参数启动构建大小分析工具, 支持 `analyzer`(webpack-bundle-analyzer)  和 `stats`(stats-webpack-plugin) ,  默认用 `analyzer`插件。

```bash
easy build -s 
```

使用 `stats`(stats-webpack-plugin) 构建大小分析工具

```bash
easy build -s stats
```

#### 3.3.9 打印配置

```bash
easywebpack print -h
```

 Usage: print [env] [options]

  print webpack config, support print by env or config node key


  Options:

    -n, --node [key]  print webpack config info by config node key, example: [module/module.rules/plugins] and so on
    -h, --help        output usage information

- easywebpack print -n module

- easywebpack print dev -n entry

- easywebpack print test -n module.rules

- easywebpack print prod -n module.rules[0]

- easywebpack print -n plugins

- easywebpack print -n plugins[0]

- easywebpack print -n output

- easywebpack print -n resolve

默认读取项目根目录下的 `webpack.config.js` 配置
