---
layout: webpack/vue
description: "专注于技术,切不能沉迷于技术!"
---

## 基于 `easywebpack-cli` 模式构建Vue前端渲染项目

### 一. 全局安装 `easywebpack-cli` 插件

```bash
npm i easywebpack-cli  -g
```

安装成功以后, 就可以在命令行中使用 `easy` 或 `easywebpack` 命令, 比如 `easy build`, `easy server`, `easy print` 等


### 二. 添加 `webpack.config.js` 配置

在项目根目录添加 `webpack.config.js` 文件, 添加如下配置

```js
const path = require('path');
module.exports = {
  type:'client',  // 只构建前端渲染模式, 如果要同时构建Node运行文件, 这里不用配置
  framework: 'vue', // 指定用 easywebpack-vue 解决方案, 请在项目中安装该依赖
  entry: {
    include: 'src/page', // 自动遍历 src/page 下面的所有 js 文件
    exclude: ['src/page/test']
  },
  template: 'src/view/layout.html', // html 模板
  lib: ['vue/dist/vue.common.js', 'axios'], // commonsChunk 
  done(){ // 编译完成回调

  }
};

```

更多配置请见 [配置参数](http://hubcarl.github.io/easywebpack/webpack/config/)

### 三. 单独获取配置

```js
const VueEasyWebpack = require('easywebpack-vue');
const webpackConfig = VueEasyWebpack.getWebpackConfig();
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

![image](/img/webpack/easywebpack-build-nav.png)


### 六. 前端项目初始化

- 全局安装 `easywebpack-cli` 插件

```bash
npm i easywebpack-cli  -g
```
- 请通过 `easy init` 命令初始化骨架项目, 根据提示选择对应的项目类型即可.