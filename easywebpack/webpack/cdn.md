---
title: webpack CommonsChunk 工程化实现
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

## CDN 配置

### 基本配置

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

### 实战配置

**注意**：实际项目具体做法一般是只有上线部署才使用 cdn 生效. 我们可以在 Webpack 构建完成后, 在 `done` 函数里面上传静态资源到 `cdn.url` 地址.
我们可以通过添加环境变量的方式决定是否需要上传CDN, 从而控制本地开发构建不上传CDN, 只有在CI构建(CI环境里面定义UPLOAD_CDN环境变量)时才触发CDN流程.

```js
// ${app_root}/webpack.config.js
const UPLOAD_CDN = process.env.UPLOAD_CDN;
module.exports = {
  ......
  cdn:UPLOAD_CDN ? { url: 'http://xxx.cdn.com/public/' }: {},
  done(){
    // upload static file to cdn: http://xxx.cdn.com
    if(UPLOAD_CDN){
      
    }
  }
}
```

### 打包配置

#### `packjson.json` 本地打正式包配置

在 `npm run build` 打正式包的时候, 开启 UPLOAD_CDN 开关

```js
 {
   "script" :{
      "build:dev": "cross-env easywebpack build dev",
      "build:test": "cross-env easywebpack build test",
      "build": "cross-env UPLOAD_CDN=true easywebpack build prod"
   }
 }
 ```

#### `packjson.json` CI 打正式包配置

这里无需配置 UPLOAD_CDN 参数， 请在 CI 系统配置 UPLOAD_CDN 环境变量

```js
 {
   "script" :{
      "build:dev": "cross-env easywebpack build dev",
      "build:test": "cross-env easywebpack build test",
      "build": "cross-env easywebpack build prod"
   }
 }
 ```