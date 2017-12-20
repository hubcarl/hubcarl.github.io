---
layout: webpack/react
description: "专注于技术,切不能沉迷于技术!"
---

## Egg + React + Webpack(easywebpack ^3.5.x) SSR 解决方案升级

#### 升级依赖 
- easywebpack-cli": ^1.3.0-rc.2            （devDependencies）
- easywebpack-react:^3.3.0-rc.5              （devDependencies）
- egg-webpack:^3.2.4                       （devDependencies）
- egg-webpack-react:^2.0.1                   （devDependencies）
- uglifyjs-webpack-plugin: ^1.1.2          （devDependencies）
- webpack-manifest-resource-plugin: ^2.0.2 （devDependencies）
- egg-view-react-ssr:^3.0.2                  （dependencies）
- 删除 egg-view-react 依赖

#### egg 配置修改

- 删除 config/config.{env}.js 里面的 config.react 配置
- config.react 配置 添加到 config.reactssr下面

#### 开启 less 和 stylus 

3.5.0 版本开始，less 和 stylus 默认关闭
如果项目中使用了 less 或者 stylus ，请在 `webpack.config.js` 开启， 没有使用则无需配置。

```js
 loaders:{
  less:true,
  stylus:true
 }
```
 
#### egg npm start 启动开启多进程编译（非必需）

该修改非必须，如果沿用之前的配置，就表示采用单进程编译

- 如果 webpack.config.js 文件在项目根目录，直接删除 config/config.local.js 文件的 config.webpack 配置即可
- 如果 webpack.config.js 文件不在项目根目录，比如在 build/webpack.config.js，那么需要删除原有的配置，添加如下配置：

```js
config.webpack={
  webpackConfigFile: 'build/webpack.config.js'
}
```

#### commonsChunk 配置简化（非必需）

如果你在 webpack.config.js 配置里面添加了如下配置(没有该配置，可以忽略该修改)：

```js
onClient(){
 //'react', 'react-dom'随意, 公共库根据实际项目修改，这里只是举例关键是 addEntry('vendor')
  this.addEntry('vendor', ['react', 'react-dom']);  
}
```

可以删除上面的配置，简化为：

```js
lib:['react', 'react-dom'] // 这里的公共库根据实际项目修改，这里只是举例
```

#### 使用 dll 功能（非必需）

如果你想使用 webpack dll 功能提高编译速度，你可以在 webpack.config.js 配置里面添加 `dll` 了如下配置(具体dll是干什么，请自行google，后面我这边会有专门的文章介绍).

```js
dll:['react', 'react-dom'] // 这里的公共库根据实际项目修改，这里只是举例
```

你可以全局安装 `npm i easywebpack-cli -g` 文件， 然后通过 easy clean 删除缓存的dll文件，通过 easy open 打开 `dll` 文件目录. 

**注意 commonsChunk 和 dll 二选一。**
**修改完成以后， 请重新安装依赖，确认最低版本都是以上说明版本。**
