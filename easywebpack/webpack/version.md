---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

easywebpack 版本发布说明

## 3.5.0

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
