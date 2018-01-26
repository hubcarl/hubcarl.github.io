---
layout: webpack/html
description: "专注于技术,切不能沉迷于技术!"
---

## 基于 `easywebpack-cli` 模式构建 HTML 纯静态页面项目

### 一. 全局安装 `easywebpack-cli` 插件

```bash
npm i easywebpack-cli  -g
```

安装成功以后, 就可以在命令行中使用 `easy` 命令, 比如 `easy build`, `easy server`, `easy print` 等


### 二. 添加 `webpack.config.js` 配置

在项目根目录添加 `webpack.config.js` 文件, 添加如下配置

```js
const path = require('path');
module.exports = {
  framework: 'html', // 指定用easywebpack-html 解决方案, 请在项目中安装该依赖
  entry: 'src/page',
  template: 'src/view/layout.html', // html 模板
  alias: {
    asset: 'asset',
    component: 'component'
  },
  done(){ // 编译完成回调

  }
};

```

更多配置请见 [配置参数](http://hubcarl.github.io/easywebpack/webpack/config/)

### 三. 单独获取配置

```js
const EasyWebpack = require('easywebpack-html');
const webpackConfig = EasyWebpack.getWebpackConfig();
```

### 四. 编译文件

```bash
easy build dev

easy build test

easy build prod
```

### 五. 直接运行

```bash
easy server dev

easy server test

easy server prod
```


运行完成自动打开编译结果页面 :  http://127.0.0.1:8888/debug

![image](/img/webpack/html-build-nav.png)


### 六. 直接 `easywebpack-cli` 项目初始化

- 全局安装 `easywebpack-cli` 插件

```bash
npm i easywebpack-cli  -g
```
- 请通过 `easywebpack init` 命令初始化骨架项目, 根据提示选择对应的项目类型即可.



### 七. Github 骨架项目

[easywebpack-multiple-html-boilerplate](https://github.com/hubcarl/easywebpack-multiple-html-boilerplate)