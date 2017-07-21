---
layout: webpack/vue
description: "专注于技术,切不能沉迷于技术!"
---

## 基于`easywebpack-vue` 服务端和客户端渲染项目构建


### 一. 安装 `easywebpack-vue` 插件

```bash
npm i easywebpack-vue --save-dev
```

### 二. 项目构建目录结构


![image](/img/webpack/easywebpack-build.png)

看似复杂, 其实文件名里面都是空, 这里只是说明一个完整的构建. client表示浏览器运行模式,  server表示Node端运行模式(服务器渲染), 后面会支持cli生成.
项目地址:[egg-vue-webpack-boilerplate](https://github.com/hubcarl/egg-vue-webpack-boilerplate)


### 三. 配置实现

### 1. config 配置编写 `config.js`

```js
const BUILD_ENV = process.env.BUILD_ENV;
const path = require('path');
const baseDir = path.join(__dirname, '..');

module.exports = {
  baseDir,
  env: BUILD_ENV,
  commonsChunk: ['vendor'],
  entry: {
    include: 'app/web/page',
    exclude: ['app/web/page/test', 'app/web/page/html']
  },
  html: {
    template: 'app/web/view/layout.html',
    buildDir: 'html',
    include: ['app/web/page/html'],
    exclude: []
  },
  logger: {
    enable: false,
    all: false,
    keyword: false,
    config: true,
    option: false,
    loader: false,
    plugin: false
  }
};

```

### 2. 编写公共配置

#### 2.1 编写全局公共配置 `build/base/index.js`

```js
'use strict';
const path = require('path');
const merge = require('easywebpack').merge;
const webpackConfig = require('../config');
const WebpackBaseBuilder = WebpackBuilder => class extends WebpackBuilder {
  constructor(config) {
    super(merge(webpackConfig, config));
    this.setAlias('asset', 'app/web/asset');
    this.setAlias('component', 'app/web/component');
    this.setAlias('framework', 'app/web/framework');
    this.setAlias('store', 'app/web/store');
    this.setAlias('app', 'app/web/framework/vue/app.js');
    this.setStyleLoaderOption({
      sass: {
        options: {
          includePaths: [path.join(this.config.baseDir, 'app/web/asset/style')],
        }
      }
    });
  }
};
module.exports = WebpackBaseBuilder;

```


#### 2.2 编写Web端公共配置 `build/web/base/index.js`

```js
'use strict';
const WebpackWebBaseBuilder = WebpackBuilder => class extends WebpackBuilder {
  constructor(config) {
    super(config);
    this.setDefine({ PROD: true });
  }
};
module.exports = WebpackWebBaseBuilder;
```



### 3. client客户端配置


#### 3.1 编写Web端 client公共配置 `build/web/client/base/index.js`


```js
'use strict';
const path = require('path');
const VueWebpack = require('easywebpack-vue');
const WebpackBaseBuilder = require('../../base');
const WebpackWebBaseBuilder = require('../base');
class WebpackWebClientBaseBuilder extends WebpackWebBaseBuilder(WebpackBaseBuilder(VueWebpack.WebpackClientBuilder)) {
  constructor(config) {
    super(config);
    this.setDefine({ isBrowser: true });
    this.addEntry('vendor', ['vue', 'axios']);
    this.addPack('pack/inline', 'app/web/framework/inject/pack-inline.js');
  }
}
module.exports = WebpackWebClientBaseBuilder;
```


#### 3.2 编写Web端 client开发环境配置 `build/web/client/dev.js`


```js
'use strict';
const path = require('path');
const WebpackClientBaseBuilder = require('./base');
class ClientDevBuilder extends WebpackClientBaseBuilder {
  constructor(config) {
    super(config);
    this.setProxy(true);
    this.setDefine({ PROD: false });
    this.addEntry('vendor', ['vconsole']);
  }
}
module.exports = new ClientDevBuilder().create();
```


#### 3.3 编写Web端 client测试环境配置 `build/web/client/test.js`


```js
'use strict';
const WebpackClientBaseBuilder = require('./base');
class ClientDevBuilder extends WebpackClientBaseBuilder {
  constructor(config) {
    super(config);
    this.setDevTool(false);
    this.setDefine({ PROD: false });
    this.addEntry('vendor', ['vconsole']);
  }
}
module.exports = new ClientDevBuilder().create();
```



#### 3.4 编写Web端 client正式环境配置 `build/web/client/prod.js`


```js
'use strict';
const WebpackClientBaseBuilder = require('./base');
class ClientProdBuilder extends WebpackClientBaseBuilder {
  constructor(config) {
    super(config);
    this.setMiniJs({ globalDefs: { isBrowser: true, PROD: true } });
  }
}
module.exports = new ClientProdBuilder().create();
```


### 4. server服务端配置



#### 4.1 编写Web端 server公共配置 `build/web/server/base.js`


```js
'use strict';
const VueWebpack = require('easywebpack-vue');
const WebpackBaseBuilder = require('../../base');
const WebpackWebBaseBuilder = require('../base');
class WebpackWebServerBaseBuilder extends WebpackWebBaseBuilder(WebpackBaseBuilder(VueWebpack.WebpackServerBuilder)) {
  constructor(config) {
    super(config);
    this.setPrefix('');
    this.setBuildPath('app/view');
    this.setPublicPath('client', false);
    this.setMiniImage(false);
    this.setDefine({ isBrowser: false });
  }
}
module.exports = WebpackWebServerBaseBuilder;
```


#### 4.2 编写Web端 server开发环境配置 `build/web/server/dev.js`


```js
'use strict';
const WebpackServerBaseBuilder = require('./base');
class ServerDevBuilder extends WebpackServerBaseBuilder {
  constructor(config) {
    super(config);
    this.setProxy(true);
    this.setDefine({ PROD: false });
  }
}
module.exports = new ServerDevBuilder().create();

```


#### 4.3 编写Web端 server测试环境配置 `build/web/server/test.js`


```js
'use strict';
const WebpackServerBaseBuilder = require('./base');
class ServerTestBuilder extends WebpackServerBaseBuilder {
  constructor(config) {
    super(config);
    this.setDefine({ PROD: false });
  }
}
module.exports = new ServerTestBuilder().create();
```



#### 4.4 编写Web端 server正式环境配置 `build/web/server/prod.js`


```js
'use strict';
const WebpackServerBaseBuilder = require('./base');
class ServerProdBuilder extends WebpackServerBaseBuilder {
  constructor(config) {
    super(config);
    this.setMiniJs({
      globalDefs: {
        isBrowser: false,
        PROD: true
      }
    });
  }
}

module.exports = new ServerProdBuilder().create();
```


### 四. 编译和运行 

- `build/index.js`

```js
'use strict';
const easyWebpack = require('easywebpack-vue');
const clientConfig = require('./web/client');
const serverConfig = require('./web/server');
const webpackConfig = [clientConfig, serverConfig];

if(process.env.NODE_SERVER){
  // 编译和运行
  easyWebpack.server(webpackConfig);
}else{
  // 编译
  easyWebpack.build(webpackConfig, () => {
    console.log('build success');
  });
}

```


- `package.json`


```js
"build": "cross-env BUILD_ENV=prod NODE_ENV=production node build",
"build-dev": "cross-env BUILD_ENV=dev NODE_ENV=development node build",
"build-test": "cross-env BUILD_ENV=test NODE_ENV=development node build",
"dev": "cross-env BUILD_ENV=test NODE_ENV=development NODE_SERVER=true node build",
```


- 运行 `npm run dev`


编译完成, 自动打开编译结果页面 :  http://127.0.0.1:8888/debug

![image](/img/webpack/easywebpack-build-nav.png)


