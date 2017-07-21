---
layout: webpack/vue
description: "专注于技术,切不能沉迷于技术!"
---

## 基于`easywebpack` 扩展`easywebpack-vue`实现

GitHub: [https://github.com/hubcarl/easywebpack-vue](https://github.com/hubcarl/easywebpack-vue)

### 公共配置

```js
'use strict';
const EasyWebpack = require('easywebpack');
const WebpackBaseBuilder = WebpackBuilder => class extends WebpackBuilder {
  constructor(config) {
    super(config);
    this.setExtensions('.vue');
    this.setStyleLoaderName('vue-style-loader');
    this.addLoader(/\.vue$/, 'vue-loader', () => ({
      options: EasyWebpack.Loader.getStyleLoaderOption(this.getStyleConfig())
    }));
    this.addLoader(/\.html$/, 'vue-html-loader');
  }
};
module.exports = WebpackBaseBuilder;

```



### 浏览器(Browser)模式配置

```js
'use strict';
const EasyWebpack = require('easywebpack');
const WebpackBaseBuilder = require('./base');

class WebpackClientBuilder extends WebpackBaseBuilder(EasyWebpack.WebpackClientBuilder) {
  constructor(config) {
    super(config);
    this.setAlias('vue', 'vue/dist/vue.common.js', false);
  }
}
module.exports = WebpackClientBuilder;
```


### 服务端(Node)配置


```js
'use strict';
const EasyWebpack = require('easywebpack');
const webpack = EasyWebpack.webpack;
const WebpackBaseBuilder = require('./base');
class WebpackServerBuilder extends WebpackBaseBuilder(EasyWebpack.WebpackServerBuilder) {
  constructor(config) {
    super(config);
    this.setAlias('vue', 'vue/dist/vue.runtime.common.js', false);
    this.addPlugin(webpack.DefinePlugin, { 'process.env.VUE_ENV': '"server"' });
  }
}
module.exports = WebpackServerBuilder;
```