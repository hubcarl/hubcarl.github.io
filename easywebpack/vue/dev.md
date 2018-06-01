---
layout: webpack/vue
description: "专注于技术,切不能沉迷于技术!"
---

## 基于Egg+Vue+Webpack构建流程


##  1. 背景

在用Node.js+Webpack构建的方式进行开发时, 我们希望能实现修改代码能实时刷新页面UI的效果. 这个特性webpack本身是支持的, 而且基于koa也有现成的koa-webpack-hot-middleware 和 koa-webpack-dev-middleware 封装好的组件支持. 

不过这里如果需要支持Node.js服务器端修改代码自动重启webpack自动编译功能该如何实现呢, 主要存在以下几个问题:


- 如何解决Node.js服务器端代码修改应用重启避免Webpack重新编译.
- 如何访问js,css,image等静态资源.
- 服务端渲染时, Node层如何读取Webpack内存编译的内容
- 如何处理本地开发webpack热更新内存存储读取和线上应用本机文件读取逻辑分离.


## 2. 前端渲染和服务端渲染构建热更新实现

在koa项目中, 通过koa-webpack-dev-middleware和koa-webpack-hot-middleware可以实现webpack编译内存存储和热更新功能, 代码如下:

```js
const compiler = webpack(webpackConfig);
const devMiddleware = require('koa-webpack-dev-middleware')(compiler, options);
const hotMiddleware = require('koa-webpack-hot-middleware')(compiler, options);
app.use(devMiddleware);
app.use(hotMiddleware);
```

如果按照上面实现, 可以满足修改修改客户端代码实现webpack自动变编译和UI界面热更新的功能.

但如果是修改Node.js服务器端代码重启后就会发现webpack会重新编译, 这不是我们要的效果.

原因是因为middleware是依赖app的生命周期, 当app销毁时, 对应webpack compiler实例也就没有了, 重启时会重新执行middleware初始化工作. 


那有没有办法保持Webpack编译实例呢? 针对这个我们可以通过Egg框架已经内置了worker和agent机制来实现Webpack内存编译功能.
                                                         
- worker和agent通信机制: https://eggjs.org/zh-cn/core/cluster-and-ipc.html
- 实现egg项目服务器代码修改项目自动重启的功能可以使用egg-development插件.


## 3. Egg框架中Webpack构建


### 3.1 解决思路


- 我们利用本地开发修改Node层代码修复重启时, 只会重启Worker进程, 不会重启Agent进程, 我们可以在Agent里面启动Webpack编译服务解决Webpack compiler实例问题.
- 因为Egg App进程 和 Agent进程是两个进程, 当url访问时, 我们通过worker发送消息给agent进程, 获取服务端渲染的文件内容, 然后Agent再发送消息给Worker解决文件读取问题.
- 本地开发webpack热更新内存存储读取和线上应用本机文件读取逻辑分离功能, 我们通过本地开发模式时, 通过读取Webpack内存内容覆盖本地文件读取的逻辑, 这样在开发模式和发布模式可以无缝对接.


### 3.2 本地开发模式


#### 3.2.1 Egg项目启动

![image](/img/webpack/npm-start.png)

- 首先执行`node index.js` 或者 `npm run dev` 启动 Egg应用

- 在Egg Agent 里面启动koa服务, 同时在koa服务里面启动Webpack编译服务

- 挂载Webpack内存文件读取方法覆盖本地文件读取的逻辑

```js
app.vue.renderBundle = (name, context, options) => {
  const filePath = path.isAbsolute(name) ? name : path.join(app.config.view.root[0], name);
  const promise = app.webpack.fileSystem.readWebpackMemoryFile(filePath, name);
  return co(function* () {
    const content = yield promise;
    if (!content) {
      throw new Error(`read webpack memory file[${filePath}] content is empty, please check if the file exists`);
    }
    return renderBundle.bind(app.vue)(content, context, options);
  });
};
```

- Worker 监听Webpack编译状态, 检测Webpack 编译是否完成, 如果未完成, 显示Webpack 编译Loading, 如果编译完成, 自动打开浏览器

- Webpack编译完成, Agent 发送消息给Worker,  Worker检测到编译完成, 自动打开浏览器, Egg服务正式可用


#### 3.2.2 本地开发服务端渲染页面访问

![image](/img/webpack/egg-webpack-vue-ssr.png)

- 浏览器输入URL请求地址, 然后Egg接收到请求, 然后进入Controller
  
- Node层获取数据后(Node通过http/rpc方式调用Java后端API数据接口), 进入模板render流程
  
- 进入render流程后, 通过worker进程通过调用 `app.messenger.sendToAgent` 发送文件名给Agent进程, 同时通过 `app.messenger.on` 启动监听监听agent发送过来的消

- Agent进程获取到文件名后, 从Webpack编译内存里面获取文件内容, 然后Agent 通过 `agent.messenger.sendToApp` 把文件内容发送给Worker进程

- Worker进程获取到内容以后, 进行Vue编译HTML, 编译成HTML后, 进入jss/css资源依赖流程

- 如果启动代理模式(见easywebpack的setProxy),  HTML直接注入相对路径的JS/CSS, 如下:


    页面可以直接使用 `/public/client/js/vendor.js` 相对路径,  `/public/client/js/vendor.js` 由后端框架代理转发到webpack编译服务, 然后返回内容给后端框架, 这里涉及两个应用通信. 如下:
    
    ```html
    <link rel="stylesheet" href="/public/client/css/home/android/home.css">
    ```
    
    ```js
    <script type="text/javascript" src="/public/client/js/vendor.js"></script>
    <script type="text/javascript" src="/public/client/js/home.js"></script>
    ```

- 如果非代理模式(见easywebpack的setProxy),  HTML直接注入必须是绝对路径的JS/CSS, 如下:

    
    页面必须使用 `http://127.0.0.1:9001/public/client/js/vendor.js` 绝对路径
    
    ```html
    <link rel="stylesheet" href="http://127.0.0.1:9001/public/client/css/home/android/home.css">
    ```
     
    ```js
    <script type="text/javascript" src="http://127.0.0.1:9001/public/client/js/vendor.js"></script>
    <script type="text/javascript" src="http://127.0.0.1:9001/public/client/js/home.js"></script>
    ```
    
    其中 http://127.0.0.1:9001 是 Agent里面启动的Webpack编译服务地址, 与Egg应用地址是两回事
 

- 最后, 模板渲染完成, 服务器输出HTML内容给浏览器.


### 4. 发布模式构建流程和运行模式

- easywebpack 通过本地构建或者ci直接构建好服务端和客户端渲染文件到磁盘, 命令是 `easy build prod`

- Egg render 直接读取本地文件, 然后渲染成HTML.

- 根据 `manfifest.json` 文件注入 jss/css 资源依赖注入.

- 模板渲染完成, 服务器输出HTML内容给浏览器.

