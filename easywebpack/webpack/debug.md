---
title: 前端工程化脚手架easywebpack-cli
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

## 开发调试

## `easywebpack-cli` 使用

### 运行

```bash
npm i easywebpack-cli  -g
```

安装成功以后, 就可以在命令行中使用 `easywebpack` 命令, 比如 `easywebpack init`, `easywebpack build`, `easywebpack server`, `easywebpack print` 等


### 运行


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

#### 3.3.4 打印配置

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
