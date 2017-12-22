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

目前只在开发环境启用, 你可以在 `onClient` 回调函数里面强制启用所有环境

```js
// ${app_root}/webpack.config.js
module.exports = {
  onClient(){
    this.setDevTool('source-map', true);
  }
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

## cdn配置

`easywebpack` 提供了 cdn 配置节点, 只需要配置 cdn 地址即可(cdn地址会覆盖publicPath地址).配置如下:

```js
// ${app_root}/webpack.config.js
module.exports = {
  ......
  cdn:{
    url: 'http://xxx.cdn.com'
  }
  done(){
    // upload static file to cdn: http://xxx.cdn.com
  }
}
```

实际项目具体做法一般是只有上线部署才使用 cdn 生效. 我们可以在 Webpack 构建完成后, 在done函数里面上传静态资源到 `cdn.url` 地址.
我们可以 通过添加环境变量的方式决定是否需要上传CDN, 从而控制本地开发构建不上传CDN, 只有在CI构建(CI环境里面定义UPLOAD_CDN环境变量)时才触发CDN流程.

```js
// ${app_root}/webpack.config.js
const UPLOAD_CDN = process.env.UPLOAD_CDN;
module.exports = {
  ......
  cdn:UPLOAD_CDN ? {
    url: 'http://xxx.cdn.com'
  }: {},
  done(){
    // upload static file to cdn: http://xxx.cdn.com
    if(UPLOAD_CDN){
      
    }
  }
}
```



## 更多配置

[完整配置参数](/easywebpack/webpack/config/)