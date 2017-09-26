---
layout: webpack/vue
description: "专注于技术,切不能沉迷于技术!"
---

## 基于 `easywebpack-cli` 模式构建Vue服务端和客户端渲染项目构建

在 [easywebpack-vue](http://127.0.0.1:4000/easywebpack/vue/easywebpack-vue-project/) 文章中我们完整介绍了通过 `easywebpack-vue` 编写Vue构建配置. 

我们这里也提供了更简单的 cli 模式,  插件为 [easywebpack-cli](https://github.com/hubcarl/easywebpack-cli),  使用方式如下:


### 一. 全局安装 `easywebpack-cli` 插件

```bash
npm i easywebpack-cli  -g
```

安装成功以后, 就可以在命令行中使用 `easywebpack` 命令, 比如 `easywebpack build`, `easywebpack server`, `easywebpack print` 等


### 二. 添加 `webpack.config.js` 配置

在项目根目录添加 `webpack.config.js` 文件, 添加如下配置

```js

const path = require('path');
module.exports = {
  egg: true,
  framework: 'vue', // 指定用easywebpack-vue 解决方案, 请在项目中安装该依赖
  entry: {
    include: 'app/web/page',
    exclude: ['app/web/page/html']
  },
  alias: {
    asset: 'app/web/asset',
    app: 'app/web/framework/vue/app.js',
    component: 'app/web/component',
    framework: 'app/web/framework',
    store: 'app/web/store'
  },
  create() { // 公共配置扩展

  },
  onClient(){ // client api配置扩展
     this.addEntry('vendor', ['vue', 'axios']);
  },
  onServer(){ // server api配置扩展

  },
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
easywebpack build dev

easywebpack build test

easywebpack build prod
```

### 五. 直接运行

```bash
easywebpack server dev

easywebpack server test

easywebpack server prod
```


运行完成自动打开编译结果页面 :  http://127.0.0.1:8888/debug

![image](/img/webpack/easywebpack-build-nav.png)


