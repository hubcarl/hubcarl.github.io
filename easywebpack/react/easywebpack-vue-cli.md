---
layout: webpack/react
description: "专注于技术,切不能沉迷于技术!"
---

## 基于 `easywebpack-cli` 模式构建React服务端和客户端渲染项目构建


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
  framework: 'react',
  commonsChunk: ['vendor'],
  entry: {
    include: 'app/web/page',
    exclude: ['app/web/page/test'],
    loader: {
      client: 'app/web/framework/entry/loader.js'
    }
  },
  alias: {
    asset: 'app/web/asset',
    component: 'app/web/component',
    framework: 'app/web/framework',
    store: 'app/web/store'
  },
  create(){
    if (this.type === 'server') {
      this.addEntry('layout', path.join(this.config.baseDir, 'app/web/view/layout.jsx'));
    }
  }
};

```

更多配置请见 [配置参数](http://hubcarl.github.io/easywebpack/webpack/config/)

### 三. 单独获取配置

```js
const ReactEasyWebpack = require('easywebpack-react');
const webpackConfig = ReactEasyWebpack.getWebpackConfig();
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


