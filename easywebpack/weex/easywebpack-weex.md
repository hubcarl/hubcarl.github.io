---
layout: webpack/weex
description: "专注于技术,切不能沉迷于技术!"
---

## 基于`easywebpack` 扩展`easywebpack-weex`实现

GitHub: [https://github.com/hubcarl/easywebpack-weex](https://github.com/hubcarl/easywebpack-weex)

### 公共配置

```js
'use strict';
const EasyWebpack = require('easywebpack');
const merge = EasyWebpack.merge;
const defaultConfig = require('./config');
const WebpackBaseBuilder = WebpackBuilder => class extends WebpackBuilder {
  constructor(config) {
    super(merge(config, defaultConfig));
    this.setExtractCss(false);
    this.setExtensions('.vue');
    this.setOption({
      resolveLoader: {
        alias: {
          'scss-loader': 'sass-loader'
        }
      }
    });
    const styles = ['css', 'sass', 'less', 'scss'];
    const styleLoaderOption = {};
    styles.forEach(style => {
      styleLoaderOption[style] = {
        deps: {
          postcss: false
        }
      };
    });
    this.setStyleLoaderOption(styleLoaderOption);
  }
};
module.exports = WebpackBaseBuilder;

```



### Weex Web Webpack编译扩展配置

```js
'use strict';
const EasyWebpack = require('easywebpack');
const webpack = EasyWebpack.webpack;
const Loader = EasyWebpack.Loader;
const WebpackBaseBuilder = require('./base');

class WebpackWeexWebBuilder extends WebpackBaseBuilder(EasyWebpack.WebpackClientBuilder) {
  constructor(config) {
    super(config);
    this.setPrefix('web');
    this.setCommonsChunk('vendor');
    this.addLoader(/\.html$/, 'vue-html-loader');
    this.addLoader({
      test: /\.vue$/,
      fn: () => this.createWeexVueLoader()
    });
    this.addPlugin(new webpack.DefinePlugin({
      'process.env': {
        PLATFORM: '"web"'
      }
    }));
  }

  createVueStyleLoader() {
    return Loader.getLoaderConfig('vue-style-loader', this.getStyleConfig());
  }

  createWeexVueLoader() {
    const styleConfig = this.getStyleConfig();
    const vueStyleLoader = this.createVueStyleLoader();
    const cssLoader = Loader.getCssLoader(styleConfig);
    const sassLoader = Loader.getSassLoader(styleConfig);
    return {
      use: {
        loader: 'vue-loader',
        options: {
          loaders: {
            css: [vueStyleLoader, cssLoader],
            scss: [vueStyleLoader, cssLoader, sassLoader],
            sass: [vueStyleLoader, cssLoader, sassLoader]
          },
          compilerModules: [{
            postTransformNode: el => {
              el.staticStyle = `$processStyle(${el.staticStyle})`;
              el.styleBinding = `$processStyle(${el.styleBinding})`;
            }
          }]
        }
      }
    };
  }
}
module.exports = WebpackWeexWebBuilder;
```


### Weex Native Webpack编译扩展配置


```js
'use strict';
const EasyWebpack = require('easywebpack');
const Loader = EasyWebpack.Loader;
const webpack = EasyWebpack.webpack;
const WebpackBaseBuilder = require('./base');

class WebpackWeexBuilder extends WebpackBaseBuilder(EasyWebpack.WebpackClientBuilder) {
  constructor(config) {
    super(config);
    this.setPrefix('weex');
    this.setHot(false);
    this.setOption({
      externals: ['vue']
    });
    this.addLoader(/\.vue$/, 'weex-loader', () => this.createWeexLoader());
    this.addPlugin(webpack.BannerPlugin, { banner: '// { "framework": "Vue" }\n', raw: true });
    this.addPlugin(webpack.DefinePlugin, {
      'process.env': {
        PLATFORM: '"weex"'
      }
    });
  }

  createWeexVueLoader() {
    return Loader.getLoaderConfig('weex-vue-loader/lib/style-loader', this.getStyleConfig());
  }

  createWeexLoader() {
    const styleConfig = this.getStyleConfig();
    const weexVueLoader = this.createWeexVueLoader();
    const sassLoader = Loader.getSassLoader(styleConfig);
    return {
      options: {
        loaders: {
          css: [weexVueLoader],
          sass: [weexVueLoader, sassLoader],
          scss: [weexVueLoader, sassLoader]
        }
      }
    };
  }
}
module.exports = WebpackWeexBuilder;

```