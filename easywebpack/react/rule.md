---
layout: webpack/react
description: "专注于技术,切不能沉迷于技术!"
---

## 基于 Egg + React + Webpack 服务端渲染开发指南


## 1. 项目初始化

### 1.1 通过 [easywebpack-cli](http://hubcarl.github.io/easywebpack/webpack/cli/) 脚手架初始化

1. 安装脚手架 `npm install easywebpack-cli -g` 命令行，然后就可以使用 `easywebpack` 或 `easy` 命令
 
2. 命令行运行 `easywebpack init`
 
3. 选择 egg + react server side render boilerplate 初始化骨架项目
 
4. 安装依赖 `npm install`


### 1.2 通过骨架项目初始化

```bash
git clone https://github.com/hubcarl/egg-react-webpack-boilerplate.git
npm install
```

初始化的项目提供多页面和SPA(react-router/react-redux)服务端渲染实例，可以直接运行。

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
4. 生成的 `buildConfig.json` 和 `manifest.json` 放到 `config` 目录
5. 构建的文件都是 `gitignore`的，部署时请注意把这些文件打包进去


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
const EasyWebpack = require('easywebpack-react');
exports.webpack = {
  webpackConfigList:EasyWebpack.getWebpackConfig()
};
```
* 该项目中，`app/web/page` 目录中所有 .jsx 文件当作 Webpack 构建入口是采用 app/web/framework/entry/loader.js 模板实现的，这个需要结合 `webpack.config.js` 下的 entry.loader 使用。


```js
entry: {
    include: ['app/web/page',
      { layout: 'app/web/view/layout.jsx?loader=false' },
      { 'spa/redux': 'app/web/page/spa/redux.jsx?loader=false' },
      { 'spa/client': 'app/web/page/spa/client.jsx?loader=false' },
      { 'spa/ssr': 'app/web/page/spa/ssr.jsx?loader=false' }
    ],
    exclude: ['app/web/page/test'],
    loader: {
      client: 'app/web/framework/entry/loader.js'
    }
}
```

上面 `{ 'app/app': 'app/web/page/app/app.js?loader=false' }` 这个 `loader=false` 的含义表示 `app/web/page` 目录下的 `app/app.js` 不使用 entry.loader 模板。因为这个app/app.js是一个SPA服务端渲染Example，实现逻辑与其他普通的页面不一样，不能用 entry.loader 模板， 这个功能在自定义entry文件构建规范时使用。

## 4. 项目规范

* [遵循 egg 开发规范](https://eggjs.org/zh-cn/basics/structure.html)
* React 项目代码放到 app/web 目录，页面入口目录为 page，该目录的 所有 .jsx 文件默认会作为 Webpack 的 entry 构建入口。建议每个页面目录的只保留一个.jsx 文件，jsx关联的组件可以放到widget 或者 component 目录。如果非要放到当前目前，请配置 `webpack.config.js` entry.exclude 排除 .jsx 文件。


![63121d32-9401-46ab-96b8-4bb1899f10fd.png | center](https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/skylark/png/63121d32-9401-46ab-96b8-4bb1899f10fd.png "")


## 5. 项目开发

支持多页面/单页面服务端渲染, 前端渲染, 静态页面三种方式.

### 5.1 多页面服务端渲染实现

#### 5.1.1 多页面前端页面实现

在app/web/page 目录下面创建home目录, home.jsx 文件, Webpack自动根据.jsx 文件创建entry入口, 具体实现请见[webpack.config.js](http://hubcarl.github.io/easywebpack/webpack/config/)

* home.jsx 以组件的方式实现页面逻辑


```jsx
import React, { Component } from 'react';
import Header from 'component/layout/standard/header/header.jsx';
import List from 'component/home/list.jsx';
import './home.css';
export default class Home extends Component {
  componentDidMount() {
    console.log('----componentDidMount-----');
  }

  render() {
    return <div>
      <Header></Header>
      <div className="main">
        <div className="page-container page-component">
          <List list={this.props.list}></List>
        </div>
      </div>
    </div>;
  }
```

#### 5.1.2 多页面后端渲染实现, 通过 `egg-view-react-ssr` 插件 `render` 方法实现

* 创建controller文件home.js


```javascript
exports.index = function* (ctx) {
  yield ctx.render('home/home.js', Model.getPage(1, 10));
};
```

* 添加路由配置


```javascript
app.get('/home', app.controller.home.home.index);
```

#### 5.1.3 多页面走前端渲染(后端路由)实现, 通过 `egg-view-react-ssr` 插件 `renderClient` 方法实现

* 创建controller文件home.js


```javascript
exports.client = function* (ctx) {
  yield ctx.renderClient('home/home.js', Model.getPage(1, 10));
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

在app/web/page 目录下面创建app目录, spa/ssr.jsx 文件.

* ssr.jsx 页面调用入口


```jsx
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import {match, RouterContext} from 'react-router'
import { BrowserRouter, StaticRouter } from 'react-router-dom';
import { matchRoutes, renderRoutes } from 'react-router-config'
import Header from 'component/layout/standard/header/header';
import SSR from 'component/spa/ssr/ssr';
import { create } from 'component/spa/ssr/store';
import routes from 'component/spa/ssr/routes'
import './spa.css';


if (typeof window === 'object') { // 前端渲染构建
  const store = create(window.__INITIAL_STATE__);
  const url = store.getState().url;
  ReactDOM.render(
    <div>
      <Header></Header>
      <Provider store={ store }>
        <BrowserRouter>
          <SSR url={ url }/>
        </BrowserRouter>
      </Provider>
    </div>,
    document.getElementById('app')
  );
} else {  // 服务端渲染构建和render入口, 这里 export 函数，服务端会负责处理
  module.exports = (context, options) => {
    const url = context.state.url;
    const branch = matchRoutes(routes, url);
	// 获取组件数据
    const promises = branch.map(({route}) => {
      const fetch = route.component.fetch;
      return fetch instanceof Function ? fetch() : Promise.resolve(null)
    });
    return Promise.all(promises).then(data => {
	  // 初始化store数据
      const initState = context.state;
      data.forEach(item => {
        Object.assign(initState, item);
      });
      context.state = Object.assign({}, context.state, initState);
      const store = create(initState);
      return () =>(
        <div>
          <Header></Header>
          <Provider store={store}>
            <StaticRouter location={url}>
              <SSR url={url}/>
            </StaticRouter>
          </Provider>
        </div>
      )
    });
  };
}
```

#### 5.3.2 单页面后端实现

* 创建controller文件app.js


```javascript
exports.ssr = function* (ctx) {
  yield ctx.render('spa/ssr.js', { url: this.url });
};
```

* 添加路由配置


```javascript
  app.get('/spa/ssr', app.controller.spa.ssr);
```

* 构建配置


spa 单页面实现复杂，不能使用 entry.loader, 所以需要在 `webpack.config.js` 配置

```js
{
  entry: {
    include: ['app/web/page',
      { layout: 'app/web/view/layout.jsx?loader=false' },
      { 'spa/redux': 'app/web/page/spa/redux.jsx?loader=false' },
      { 'spa/client': 'app/web/page/spa/client.jsx?loader=false' },
      { 'spa/ssr': 'app/web/page/spa/ssr.jsx?loader=false' }
    ],
    exclude: ['app/web/page/test'],
    loader: {
      client: 'app/web/framework/entry/loader.js'
    }
  },
}
```

详细代码请参考[骨架项目实现](https://github.com/hubcarl/egg-react-webpack-boilerplate/blob/master/app/web/page/spa/ssr.jsx)

## 6. 项目部署

* 正式环境部署，请设置 `EGG_SERVER_ENV=prod` 环境变量, 更多请见[运行环境](https://eggjs.org/zh-cn/basics/env.html)
* 构建的 `app/view` 目录, `public` 目录以及 `buildConfig.json` 和 `manifest.json`等文件, 都是 `gitignore` 的，部署时请注意把这些文件打包进去。



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



## 8. 项目和插件

* [egg-react-webpack-boilerplate](https://github.com/hubcarl/egg-react-webpack-boilerplate)基于easywebpack-react和egg-view-react(ssr)插件的工程骨架项目
* [easywebpack](https://github.com/hubcarl/easywebpack) Webpack 构建工程化.
* [easywebpack-cli](https://github.com/hubcarl/easywebpack-cli)  Webpack 构建工程化脚手架.
* [egg-view-react](https://github.com/eggjs/egg-view-vue) react ssr engine.
* [egg-view-react-ssr](https://github.com/hubcarl/egg-view-vue-ssr) react ssr 解决方案.
* [egg-webpack](https://github.com/hubcarl/egg-webpack) 本地开发热更新使用.
* [egg-webpack-react](https://github.com/hubcarl/egg-webpack-react) 本地开发渲染内存读取辅助插件




