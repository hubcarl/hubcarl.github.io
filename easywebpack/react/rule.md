---
layout: webpack/react
description: "专注于技术,切不能沉迷于技术!"
---

## 基于 Egg + React + Webpack 开发规范


### 一. Webpack构建目录

- Webpack构建服务端(Node) JSBundle运行文件, 构建的服务端渲染模板文件位置 `${app_root}/app/view`
- Webpack构建浏览器JSBundle运行文件, 构建的前端资源(js/css/image)文件位置 `${app_root}/public` 
- Webpack构建的 `manifest.json` 和 `buildConfig.js` 文件位置 `${app_root}/config` 目录
- easywebpack-cli 构建配置文件 `webpack.config.js` 放到项目根目录`${app_root}/webpack.config.js`
- React代码文件`${app_root}/app/web` 下面, 主要包括 `asset`, `component`, `framework`, `page`, `store`, `view` 等目录

```
    ├── asset                    // 资源文件
    │   ├── css 
    │   │   ├── global.css
    │   │   ├── normalize.css
    │   │   └── style.css
    │   ├── images
    │   │   ├── favicon.ico
    │   │   ├── loading.gif
    │   │   └── logo.png
    ├── component                // jsx组件
    │   ├── home
    │   │   └── list.jsx
    │   └── layout
    │       └── standard
    │           └── header
    │               ├── header.css
    │               └── header.jsx
    ├── framework
    │   └── entry
    │       ├── app.js
    │       └── loader.js
    ├── page               // 页面目录, jsx结尾的的文件默认作为entry入口
    │   ├── hello
    │   │   └── hello.jsx  // 页面入口文件, 根据framework/entry/loader.js模板自动构建
    │   └── home
    │       ├── home.css
    │       └── home.jsx
    └── view
        └── layout.jsx     // layout模板文件, 提供统一html, header, body结构, page下面的jsx文件无需关心
```

### 二. 项目结构和基本规范

    ├── app
    │   ├── controller
    │   │   ├── test
    │   │   │   └── test.js
    │   ├── extend
    │   ├── lib
    │   ├── middleware
    │   ├── mocks
    │   ├── proxy
    │   ├── router.js
    │   ├── view
    │   │   ├── about                         // 服务器编译的jsbundle文件
    │   │   │   └── about.js
    │   │   ├── home
    │   │   │     └── home.js                 // 服务器编译的jsbundle文件
    │   │   └── layout.js                     // 编译的layout文件
    │   └── web                               // 前端工程目录
    │       ├── asset                         // 存放公共js,css资源
    │       ├── framework                     // 前端公共库和第三方库
    │       │   └── entry                          
    │       │       ├── loader.js              // 根据jsx文件自动生成entry入口文件loader
    │       ├── page                           // 前端页面和webpack构建目录, 也就是webpack打包配置entryDir
    │       │   ├── home                       // 每个页面遵循目录名, js文件名, scss文件名, jsx文件名相同
    │       │   │   ├── home.scss
    │       │   │   ├── home.jsx
    │       │   └── hello                      // 每个页面遵循目录名, js文件名, scss文件名, jsx文件名相同
    │       │       ├── test.css               // 服务器render渲染时, 传入 render('test/test.js', data)
    │       │       └── test.jsx
    │       ├── store                             
    │       │   ├── app
    │       │   │   ├── actions.js
    │       │   │   ├── getters.js
    │       │   │   ├── index.js
    │       │   │   ├── mutation-type.js
    │       │   │   └── mutations.js
    │       │   └── store.js
    │       └── component                         // 公共业务组件, 比如loading, toast等, 遵循目录名, js文件名, scss文件名, jsx文件名相同
    │           ├── loading
    │           │   ├── loading.scss
    │           │   └── loading.jsx
    │           ├── test
    │           │   ├── test.jsx
    │           │   └── test.scss
    │           └── toast
    │               ├── toast.scss
    │               └── toast.jsx
    ├── config
    │   ├── config.default.js
    │   ├── config.local.js
    │   ├── config.prod.js
    │   ├── config.test.js
    │   └── plugin.js
    ├── doc
    ├── index.js
    ├── webpack.config.js                      // easywebpack-cli 构建配置
    ├── public                                 // webpack编译目录结构, render文件查找目录
    │   ├── static
    │   │   ├── css
    │   │   │   ├── home
    │   │   │   │   ├── home.07012d33.css
    │   │   │   └── test
    │   │   │       ├── test.4bbb32ce.css
    │   │   ├── img
    │   │   │   ├── change_top.4735c57.png
    │   │   │   └── intro.0e66266.png
    │   ├── test
    │   │   └── test.js
    │   └── vendor.js                         // 生成的公共打包库








