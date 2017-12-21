---
layout: webpack/vue
description: "专注于技术,切不能沉迷于技术!"
---

## Egg + Vue + Webpack(easywebpack ^3.5.x) SSR 解决方案升级

#### 升级要求：

Node: ^6.0.0, 最好是Node 8.9.3 LST 版本 
npm: ^5.0.0, 最好是最新版本 


#### 3.5.0 特性

- 兼容 webpack 原生节点配置
- entry include 支持正则配置
- 支持 css extract 热更新
- 支持 webpack dll 配置和自动化构建， 无需手动先构建dll， 然后再构建页面
- 简化 commonsChunk lib 配置， 无需在 onClient 调用 addEntry 设置
- plugins 和 loaders 增加数组的配置的兼容，也就是支持原生配置
- 去掉options节点配置，改为 webpack.config.js 支持原生 Webpack 配置
- 支持多进程 Webpack 编译, 结合dll功能**编译速度显著提高**，初步测试编译时间减少2/3, 第三方组件越多和页面越多，越明显
- manifest和buildfie合并为新的manifest， 无需 manifest 和 manifestDeps 兼容配置， 同时去掉 buildfile 配置，
- 默认禁用 npm start 启动检查 webpack loader 和 plugin 是否安装的功能， 提高编译速度。
- stylus 和 less loader 默认有开启改为禁用， 减少不必要的安装
- 新增内置插件 webpack-bundle-analyzer 和 stats-webpack-plugin
- node externals 改为 webpack-node-externals 插件实现
- 压缩插件由webpack内置改为 uglifyjs-webpack-plugin 独立插件, 从而支持**多进程**编译
- 解决 NODE_ENV=production 导致动态安装 npm 依赖失败
- 修复 easywebpack 配置合并覆盖问题

#### 升级依赖 
- easywebpack-cli": ^3.5.0            （devDependencies）
- easywebpack-vue: ^3.5.0              （devDependencies）
- egg-webpack:^3.2.4                       （devDependencies）
- egg-webpack-vue:^2.0.1                   （devDependencies）
- uglifyjs-webpack-plugin: ^1.1.2          （devDependencies）
- webpack-manifest-resource-plugin: ^2.0.2 （devDependencies）
- egg-view-vue-ssr:^3.0.2                  （dependencies）
- 删除 egg-view-vue 依赖

#### egg 配置修改

- 删除 config/config.{env}.js 里面的 config.vue 配置
- config.vue 配置 添加到 config.vuessr下面

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
  //  'vue', 'axios'随意, 公共库根据实际项目修改，这里只是举例关键是 addEntry('vendor')
  this.addEntry('vendor', ['vue', 'axios']);  
}
```

可以删除上面的配置，简化为：

```js
lib:['vue/dist/vue.common.js', 'axios'] // 这里的公共库根据实际项目修改，这里只是举例
```

#### 使用 dll 功能（非必需）

如果你想使用 webpack dll 功能提高编译速度，你可以在 webpack.config.js 配置里面添加 `dll` 了如下配置(具体dll是干什么，请自行google，后面我这边会有专门的文章介绍).

```js
dll:['vue/dist/vue.common.js', 'axios'] // 这里的公共库根据实际项目修改，这里只是举例
```

你可以全局安装 `npm i easywebpack-cli -g` 文件， 然后通过 easy clean 清楚缓存的dll文件，通过 easy open 打开 `dll` 文件目录.

**注意 commonsChunk 和 dll 二选一。**

**修改完成以后， 请重新安装依赖，确认最低版本都是以上说明版本。**


#### 示例

Egg+Vue: https://github.com/hubcarl/egg-vue-webpack-boilerplate/tree/next