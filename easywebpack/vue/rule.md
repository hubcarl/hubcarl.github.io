---
layout: webpack/vue
description: "专注于技术,切不能沉迷于技术!"
---

## 基于 Egg + Vue + Webpack 服务端渲染开发指南


## 1. 项目初始化

### 1.1 通过 [easywebpack-cli](http://hubcarl.github.io/easywebpack/webpack/cli/) 脚手架初始化
1. 安装脚手架 `npm install easywebpack-cli -g` 命令行，然后就可以使用 `easywebpack` 或 `easy` 命令
 
2. 命令行运行 `easywebpack init`
 
3. 选择 egg+vue server side render boilerplate 初始化骨架项目
 
4. 安装依赖 `npm install`


### 1.2 通过骨架项目初始化

```bash
git clone https://github.com/hubcarl/egg-vue-webpack-boilerplate.git
npm install
```

初始化的项目提供多页面和SPA(vue-router/axios)服务端渲染实例，可以直接运行。

## 2. 项目运行

### 2.1 本地运行

```
npm start
```
npm start 做了如下三件事情

* 启动 egg 应用
* 启动 Webpack 构建, 文件不落地磁盘，构建的文件都在内存里面(只在本地启动, 发布模式是提前构建好文件到磁盘)
* 构建会同时启动两个 Webpack 构建服务, 客户端js构建端口9000, 服务端端口9001
* 构建完成，Egg应用正式可用，自动打开浏览器


### 2.2 发布模式

* 构建文件落地磁盘


```
npm run build 或 easywebpack build prod
```

1. 启动 Webpack 构建，文件落地磁盘
2. 服务端构建的文件放到 `app/view` 目录
3. 客户端构建的文件放到 `public` 目录
4. 生成的 `manifest.json` 放到 `config` 目录
5. 构建的文件都是gitignore的，部署时请注意把这些文件打包进去


* 运行


启动应用前， 请设置 `EGG_SERVER_ENV` 环境变量，测试环境设置 `test`， 正式环境设置 `prod`

```
npm start
```

## 3. 项目构建

* 通过 `easywebpack-cli` 统一构建，支持 dev，test，prod 模式构建
 
* `easywebpack-cli` 通过项目根目录下的 `webpack.config.js` 配置文件构造出 Webpack 实际的配置文件，配置项请见 [webpack.config.js](http://hubcarl.github.io/easywebpack/webpack/config/)
* 获取 Webpack 实际的配置文件, [egg-webpack](https://github.com/hubcarl/egg-webpack) 会使用到该功能。构建会根据 `webpackConfigList.length` 启动对应个数的 Webpack 编译实例，这里会同时启动两个 Webpack 构建服务, 客户端jsbundle构建，端口9000, 服务端jsbundle构建端口9001。默认端口为9000, 端口依次递增。


```js
// config/config.local.js 本地 npm start 使用
const EasyWebpack = require('easywebpack-vue');
exports.webpack = {
  webpackConfigList:EasyWebpack.getWebpackConfig()
};
```
* 该项目中，`app/web/page` 目录中所有 .vue 文件当作 Webpack 构建入口是采用 app/web/framework/vue/entry 的 client-loader.js 和 server-loader.js 模板实现的，这个需要结合 `webpack.config.js` 下的 entry.loader 使用。


```js
entry: {
   include: ['app/web/page', { 'app/app': 'app/web/page/app/app.js?loader=false' }],
   exclude: ['app/web/page/[a-z]+/component', 'app/web/page/app'],
   loader: { // 如果没有配置loader模板，默认使用 .js 文件作为构建入口
      client: 'app/web/framework/vue/entry/client-loader.js',
      server: 'app/web/framework/vue/entry/server-loader.js',
   }	
}
```

上面 `{ 'app/app': 'app/web/page/app/app.js?loader=false' }` 这个 `loader=false` 的含义表示 `app/web/page` 目录下的 `app/app.js` 不使用 entry.loader 模板。因为这个app/app.js是一个SPA服务端渲染Example，实现逻辑与其他普通的页面不一样，不能用 entry.loader 模板， 这个功能在自定义entry文件构建规范时使用。

## 4. 项目规范

* [遵循 egg 开发规范](https://eggjs.org/zh-cn/basics/structure.html)
* Vue 项目代码放到 app/web 目录，页面入口目录为 page，该目录的 所有 vue 文件默认会作为 Webpack 的 entry 构建入口。建议每个页面目录的只保留一个vue文件，vue关联的组件可以放到widget 或者 compnent目录。如果非要放到当前目前，请配置 `webpack.config.js` entry.exclude 排除 vue文件。


![image](/img/webpack/egg-vue-dir.jpg)

## 5. 项目开发

支持多页面/单页面服务端渲染, 前端渲染, 静态页面三种方式.

### 5.1 多页面服务端渲染实现

#### 5.1.1 多页面前端页面实现

在app/web/page 目录下面创建home目录, home.vue 文件, Webpack自动根据.vue文件创建entry入口, 具体实现请见[webpack.config.js](http://hubcarl.github.io/easywebpack/webpack/config/)

* home.vue 编写界面逻辑, 根元素为layout(自定义组件, 全局注册, 统一的html, meta, header, body, 你可以自定义 title，description，keywords SEO信息，更多信息请扩展layout).


```html
<template>
  <layout title="基于egg-vue-webpack-dev和egg-view-vue插件的工程示例项目" description="vue server side render" keywords="egg, vue, webpack, server side render">
   {{message}}
  </layout>
</template>
<style>
  @import "home.css";
</style>
<script type="text/babel">

  export default {
    components: {

    },
    computed: {

    },
    methods: {

    },
    mounted() {

    }
  }
</script>
```

#### 5.1.2 多页面后端渲染实现, 通过 `egg-view-vue-ssr` 插件 `render` 方法实现

* 创建controller文件home.js


```javascript
exports.index = function* (ctx) {
  yield ctx.render('home/home.js', { message: 'vue server side render!' });
};
```

* 添加路由配置


```javascript
app.get('/home', app.controller.home.home.index);
```

#### 5.1.3 多页面走前端渲染(后端路由)实现, 通过 `egg-view-vue-ssr` 插件 `renderClient` 方法实现

* 创建controller文件home.js


```javascript
exports.client = function* (ctx) {
  yield ctx.renderClient('home/home.js', { message: 'vue server side render!' });
};
```

* 添加路由配置


```javascript
app.get('/client', app.controller.home.home.client);
```

### 5.2 HTML静态页面前端渲染

* 直接有easywebpack构建出静态HTML文件, 请见 `webpack.config.js` 配置和 `app/web/page/html`代码实现
 
* 通过 `egg-static` 静态文件访问HTML文件


### 5.3 单页面服务器渲染同构实现

#### 5.3.1 单页面前端实现

在app/web/page 目录下面创建app目录, app.vue, app.js 文件.

* app.vue 编写界面逻辑, 根元素为layout(自定义组件, 全局注册, 统一的html, meta, header, body)


```html
<template>
  <app-layout>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </app-layout>
</template>
<style lang="sass">

</style>
<script type="text/babel">
  export default {
    computed: {

    },
    mounted(){

    }
  }
</script>
```

* app.js 页面调用入口


```javascript
import { sync } from 'vuex-router-sync';
import store from 'store/app';
import router from 'component/app/router';
import app from './app.vue';
import App from 'app';
import Layout from 'component/layout/app';

App.component(Layout.name, Layout);

sync(store, router);

export default App.init({
  base: '/app',
  ...app,
  router,
  store
});

```

#### 5.3.2 单页面后端实现

* 创建controller文件app.js


```javascript
exports.index = function* (ctx) {
  yield ctx.render('app/app.js', { url: this.url.replace(/\/app/, '') });
};
```

* 添加路由配置


```javascript
  app.get('/app(/.+)?', app.controller.app.app.index);
```

## 6. 项目部署

* 正式环境部署，请设置 `EGG_SERVER_ENV=prod` 环境变量, 更多请见[运行环境](https://eggjs.org/zh-cn/basics/env.html)
* 构建的 `app/view` 目录, `public` 目录以及 `buildConfig.json` 和 `manifest.json`等文件, 都是 `gitignore` 的，部署时请注意把这些文件打包进去。



### 7. Webpack构建目录

- Webpack构建服务端(Node) JSBundle运行文件, 构建的服务端渲染模板文件位置 `${app_root}/app/view`
- Webpack构建浏览器JSBundle运行文件, 构建的前端资源(js/css/image)文件位置 `${app_root}/public` 
- Webpack构建的 `manifest.json` 文件位置 `${app_root}/config` 目录
- easywebpack-cli 构建配置文件 `webpack.config.js` 放到项目根目录`${app_root}/webpack.config.js`
- Vue代码文件`${app_root}/app/web` 下面, 主要包括 `asset`, `component`, `framework`, `page`, `store`, `view` 等目录

```
├── asset
│   ├── css
│   │   ├── normalize.css
│   │   └── style.css
│   ├── images
│   │   ├── favicon.ico
│   │   ├── loading.gif
│   │   └── logo.png
├── component
│   ├── app
│   │   ├── detail.vue
│   │   ├── list.vue
│   │   └── router.js
│   ├── layout
│   │   ├── app
│   │   │   ├── content
│   │   │   │   ├── content.css
│   │   │   │   └── content.vue
│   │   │   ├── footer
│   │   │   │   ├── footer.css
│   │   │   │   └── footer.vue
│   │   │   ├── header
│   │   │   │   ├── header.css
│   │   │   │   └── header.vue
│   │   │   ├── index.js
│   │   │   └── main.vue
├── framework
│   ├── inject
│   │   ├── global.css
│   │   ├── inline.js
│   │   └── pack-inline.js
│   └── vue
│       ├── app.js
│       ├── component
│       │   └── index.js
│       ├── directive
│       │   └── index.js
│       └── filter
│           └── index.js
├── page
│   ├── app
│   │   ├── app.js
│   │   └── app.vue
│   ├── index
│   │   ├── index.css
│   │   ├── index.js
│   │   └── index.vue
├── store
│   └── app
│       ├── actions.js
│       ├── getters.js
│       ├── index.js
│       ├── mutation-type.js
│       └── mutations.js
└── view
    └── layout.html
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



## 8. 项目和插件
* [egg-vue-webpack-boilerplate](https://github.com/hubcarl/egg-vue-webpack-boilerplate)基于easywebpack-vue和egg-view-vue(ssr)插件的工程骨架项目
* [easywebpack](https://github.com/hubcarl/easywebpack) Webpack 构建工程化.
* [easywebpack-cli](https://github.com/hubcarl/easywebpack-cli)  Webpack 构建工程化脚手架.
* [egg-view-vue](https://github.com/eggjs/egg-view-vue) vue ssr engine.
* [egg-view-vue-ssr](https://github.com/hubcarl/egg-view-vue-ssr) vue ssr 解决方案.
* [egg-webpack](https://github.com/hubcarl/egg-webpack) 本地开发热更新使用.
* [egg-webpack-vue](https://github.com/hubcarl/egg-webpack-vue) 本地开发渲染内存读取辅助插件
