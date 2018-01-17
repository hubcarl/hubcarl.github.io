---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

# easywebpack 版本发布说明

## ^3.6.0

- easywebpack-vue: ^3.6.0
- easywebpack-react: ^3.6.0

### 新增 typescript 构建支持

支持通过 Webpack 构建 typescript 项目, 默认开启 tslint 检查

#### 启用 typescript 编译

```js
// webpack.config.js
module.exports = {
  loaders:{
    typescript: true
  }
}
```

#### 启用 tslint 

自动修复功能，tslint 默认启用, 自动修复默认禁用，可以通过如下方式开启

```js
// webpack.config.js
module.exports = {
  loaders:{
    tslint:{
      options: {
        fix: true
      }
    }
  }
}
```

### 支持本地开发域名代理转发

**前提：**

- 代理域名能够映射到本机ip地址的功能需要你自己在电脑上面配置。如果是实际的存在的域名，理论上面就不需要自己配置域名映射。

- 该功能只在 Egg 应用构建本地开发使用。

```js
// webpack.config.js
module.exports = {
  host: 'http://app.debug.com'
}
```

- 应用访问的地址是： 'http://app.debug.com'
- HMR地址是：http://app.debug.com:9000/__webpack_hmr
- 如何在本地通过 nginx 和 dnsmasq 在本地搭建域名服务：[nginx 和 dnsmasq 在本地搭建域名服务](/easywebpack/webpack/nginx)

 
### 支持 Webpack 配置扩展使用

可以直接基于 `easywebpack` 以及解决方案进行原生 Webpack 编写

#### 直接基于 easyewbpack 编写配置

```js
// webpack.config.js
const easywebpack = require('easywebpack');
const webpack = easywebpack.webpack;
const merge = easywebpack.merge;
const env = process.env.BUILD_ENV; 
const baseWebpackConfig = easywebpack.getWebpackConfig({
    env, // 根据环境变量生成对应配置，可以在 npm script 里面配置，支持dev, test, prod 模式
    target : 'web', // target: web 表示只获取前端构建 Webpack 配置
    entry:{
        app: 'src/index.js'
    }
});
// 拿到基础配置, 可以进行二次加工
module.exports = merge(baseWebpackConfig, {
   
})
```

#### 命令行执行

```bash
webpack --config webpack.config.js
```



#### 直接基于解决方案编写配置

```js
// target: web 表示只获取前端构建 Webpack 配置
const easywebpack = require('easywebpack-vue');
const webpack = easywebpack.webpack;
const merge = easywebpack.merge;
const baseWebpackConfig = easywebpack.getWebpackConfig({
    env, // 根据环境变量生成对应配置，可以在 npm script 里面配置，支持dev, test, prod 模式
    target : 'web', // target: web 表示只获取前端构建 Webpack 配置
    entry:{
        app: 'src/index.js'
    }
});
// 拿到基础配置, 可以进行二次加工
module.exports = merge(baseWebpackConfig, {
   
})
```

#### 命令行执行

```bash
webpack --config webpack.config.js
```


## ^3.5.0

#### 1. easywebpack-cli ^1.3.0

- 新增 webpack dll 构建支持
- 新增 `easy clean`  和 `easy open` 命令，用于 dll 缓存清理和打开dll缓存目录功能

#### 2. manifest 插件切换

新增 webpack-manifest-resource-plugin(^2.0.2) 替换 webpack-manifest-plugin。 

之前的 manifest 依赖关系是在运行期间解析的，现在改为构建期组装好资源依赖关系

- webpack-manifest-plugin

```json
// ${app_root}/config/manifest.json
{
    "app/app.js": "/public/js/app/app.2cf6dfd1.js",
    "app/app.css": "/public/css/app/app.cda9bc64.css",
    "common.js": "/public/js/common.b59f7169.js",
    "common.css": "/public/css/common.cda9bc64.css"
}
```

- webpack-manifest-resource-plugin

```json
// ${app_root}/config/manifest.json
{
    "app/app.js": "/public/js/app/app.2cf6dfd1.js",
    "app/app.css": "/public/css/app/app.cda9bc64.css",
    "common.js": "/public/js/common.b59f7169.js",
    "common.css": "/public/css/common.cda9bc64.css",
    "deps": {
        "app/app.js": {
        "js": [
            "/public/js/vendor.337ab787.js",
            "/public/js/common.b59f7169.js",
            "/public/js/app/app.2cf6dfd1.js"
        ],
        "css": [
            "/public/css/common.cda9bc64.css",
            "/public/css/app/app.cda9bc64.css"
        ]
    }
}
```

#### 3. 新增 webpack-node-externals

node externals 改为 webpack-node-externals 插件实现: [https://github.com/hubcarl/easywebpack/issues/10](https://github.com/hubcarl/easywebpack/issues/10)

#### 4. 新增 webpack-bundle-analyzer

内置构建大小分析插件，默认禁用， 通过 plugins.analyzer = true 开启

#### 5. 新增 stats-webpack-plugin

内置构建大小分析插件，默认禁用， 通过 plugins.stats = true 开启



## 3.4.2

- easywebpack-cli ^1.2.0
- webpack-manifest-plugin ^2.0.2


发布历史:[https://github.com/hubcarl/easywebpack/blob/next/History.md](https://github.com/hubcarl/easywebpack/blob/next/History.md)
