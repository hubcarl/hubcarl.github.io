---
layout: webpack/react
description: "专注于技术,切不能沉迷于技术!"
---

## Egg + React 渲染模式

目前 [egg-view-react-ssr](https://github.com/hubcarl/egg-view-react-ssr) 支持 **服务端渲染模式** 和 **前端渲染模式** 两种渲染模式

### Egg + React 服务端 Node 渲染模式

这里服务端渲染指的是编写的 React 组件在 Node 服务端直接编译成完整的HTML, 然后直接输出给浏览器。MVVM 服务端渲染相比前端渲染，支持SEO，更快的首屏渲染，相比传统的模板引擎，更好的组件化，前后端模板共用。 同时 MVVM 数据驱动方式有着更快的开发效率。总体来说，MVVM 框架的服务端渲染技术比较适合有一定交互性，且对SEO，首屏速度有要求的业务应用。当然, 如果想用于不属于该类型的项目(比如各种后台管理系统)也是可以的, 就当纯粹的玩一玩 React SSR 开发。

#### 调用 `egg-view-react-ssr` 的 `render` 方法实现服务端渲染

- controller 调用 `render` 方法

```js
// controller/home.js
module.exports = app => {
  return class HomeController extends app.Controller {
    async index() {
      const { ctx } = this;
      await ctx.render('home/home.js', Model.getPage(1, 10));
    }
  };
};
```

- `home/home.js` 是由 Webpack(`targe:node`) 把 React 变成 Node 服务端运行的运行文件, 默认在 `${app_root}/app/view` 目录下。
- `Model.getPage(1, 10)` 表示在 Node 服务端获取到的业务数据，传给 React 组件在 Node 端进行模板编译为 HTML
-  Node 编译 HTML之后会根据 `config/manifest.json` 文件把 css, js 资源依赖注入到 HTML
- 当服务队渲染失败时, `egg-view-react-ssr` 默认开启进行客户端渲染模式。当线上流量过大时, 可以根据一定策略一部分用户服务端渲染, 一部分用户前端渲染, 减少服务端压力。
- 本地开发默认禁用缓存, 线上运行模式默认开启缓存。
- 如果是 SPA SSR 应用, 一般是在 React 里面提供组件的 fetch 方法由 Node 进行 fetch 数据调用, 然后把数据放入 store, 而不是在 Node 端进行获取, 具体见[egg-react-webpack-boilerplate](https://github.com/hubcarl/egg-react-webpack-boilerplate/blob/master/app/web/page/spa/ssr.jsx) 功能实现


### Egg + React 客户端浏览器渲染模式

#### 调用 `egg-view-react-ssr` 的 `renderClient` 方法实现客户端浏览器渲染

在使用上面, 客户端浏览器渲染模式只需要把 `render` 改成 `renderClient`。 正常情况下, 能进行 `render` 运行的, `renderClient`  方式也能正常运行。

- controller 调用 `renderClient` 方法

```js
const Model = require('../../mocks/article/list');

module.exports = app => {
  return class HomeController extends app.Controller {
    async client() {
      const { ctx } = this;
      await ctx.renderClient('home/home.js', Model.getPage(1, 10));
    }
  };
};
```

- 使用 `renderClient` 进行渲染时, 需要存在 `${app_root}/app/view/layout.js` layout文件. 这个 `layout.js` 是通过
Webpack 把 `layout.jsx` 构建出来的 HTML 骨架文件。 

```js
import React, { Component } from 'react';
export default class Layout extends Component {
  render() {
    return <html>
      <head>
        <title>{this.props.title}</title>
        <meta charSet="utf-8"></meta>
        <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui"></meta>
        <meta name="keywords" content={this.props.keywords}></meta>
        <meta name="description" content={this.props.description}></meta>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon"></link>
      </head>
      <body><div id="app">{this.props.children}</div></body>
    </html>;
  }
}
```