---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

## 内置 loader 扩展参数统一通过 options 节点配置

```js
// ${app_root}/webpack.config.js
module.exports = {
  loaders:{
     ${loader别名}:{
      options:{
        // 具体loader参数
      }
    }
  }
}
```

## 内置 plugin 扩展参数统一通过 args 节点配置

```js
// ${app_root}/webpack.config.js
module.exports = {
  plugins:{
     ${plugin别名}:{
      args:{
        // 具体plugin参数
      }
    }
  }
}
```

## 开启 source-map


```js
// ${app_root}/webpack.config.js
module.exports = {
  devtool:'source-map'
}
```

## eslint 配置自动修复功能, 默认禁用

```js
// ${app_root}/webpack.config.js
module.exports = {
  loaders:{
    eslint:{
      options:{
        fix: true
      }
    }
  }
}
```

## sass/scss 配置 css 文件查找目录

```js
// ${app_root}/webpack.config.js
const path = require('path');
module.exports = {
  loaders:{
    sass: {
      options: {
        includePaths: [
          path.resolve(process.cwd(), 'app/web/asset/style')
        ]
      }
    },
    scss: {
      options: {
        includePaths: [
          path.resolve(process.cwd(), 'app/web/asset/style')
        ]
      }
    }
  }
}
```

## vue 配置 img 图片自定义属性 webpack 解析

```js
// ${app_root}/webpack.config.js
module.exports = {
  loaders:{
    vue: {
      options: { transformToRequire: { img: ['url', 'src'] } }
    }
  }
}
```

## 添加环境变量 webpack.DefinePlugin

```js
// ${app_root}/webpack.config.js
module.exports = {
  plugins:{
    define:{
      args:{
        PROD: process.env.BUILD_ENV
      }
    }
  }
}
```

## 自动加载模块 webpack.ProvidePlugin

```js
// ${app_root}/webpack.config.js
module.exports = {
  plugins:{
    provide:{
      args:{
        $: 'jquery',
        jQuery: 'jquery'
      }
    }
  }
}
```




## 更多配置

[完整配置参数](/easywebpack/webpack/config/)