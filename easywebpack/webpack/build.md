---
title: 前端工程化脚手架easywebpack-cli
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

## 打包构建

在使用 `easywebpack` 工程化方式时， 我们会经常用到 `easy build dev`, `easy build test`, `easy build prod` 三个命令。 
从字面意思我们初步大概知道各自的含义，分别对应开发模式构建， 测试环境模式模式构建，正式环境模式构建， 那这三种模式有什么具体差别呢？


### 构建配置

在 `easywebpack` 解决方案里面， 默认支持了通过 env 参数支持了三套环境(`dev`, `test`, `prod`), 根据环境控制是否开启 Webpack 构建配置选项。

**config.env** : 非必需, 目前支持 `dev`, `test`, `prod` 三种环境, 默认 `dev` 

>使用 `easywebpack-cli` 构建时,无需配置该参数.环境变量配置从 `easy build [env]` env 参数获取。

### 环境说明

#### 开发环境

- 开启 HMR 热更新,构建文件不落地磁盘
- js, css, image 禁用压缩
- js, css, image 禁用 Hash


#### 测试环境

- 禁用 HMR 热更新, 构建文件落地磁盘
- js, css, image 禁用压缩
- js, css, image 开启 Hash
- css 分离出独立的 css 文件

#### 正式环境

- 禁用 HMR 热更新, 构建文件落地磁盘
- js, css, image 开启压缩
- js, css, image 开启 Hash
- css 分离出独立的 css 文件

### 打包部署

一般我们推进把 `easy build dev`, `easy build test`, `easy build prod` 配置到 项目的 `package.json` 的 script 中去, 然后通过 npm run [command] 的方式使用。

- 通过 `npm run [command]` 方式使用 easy 命令时，不需要全局安装 `easywepback-cli` 命令行工具, 只需要把 `easywepback-cli` 安装到项目 `devDependencies` 即可。
- 在命令行直接使用 `easy` 命令时，需要全局安装 `easywepback-cli` 命令行工具。如果不安装, 可以通过 npm5 支持的 `npx easy` 方式运行。

```js
{
   "scripts": {
    "clean": "cross-env easy clean",
    "build": "cross-env easy build prod",
    "build:dev": "cross-env easy build dev",
    "build:test": "cross-env easy build test",
    "build:prod": "cross-env easy build prod"
   }
}
```
项目开发完成以后，我们要部署上线, 一般如下步骤:

#### 清除缓存

```bash
npm run clean
```

#### 开始构建

```bash
npm run build
```

#### 打包上传

>备注： 打成 zip 或 tar 包功能 `easywebpack-cli` 正在开发中, 近期期待。

```bash
这里需要你自己实现把构建好的文件和项目问题一起打成 zip 或 tar 包，然后上传到部署平台进行部署。
```

