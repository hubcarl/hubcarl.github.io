---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---


## 设计实现


### 1. webpack基础配置固化


在使用webpack对不同的前端框架进行打包和处理时, 有些配置是公共的, 有些特性是共性的, 我们把这些抽离出来, 并提供接口进行设置和扩展.


#### 1.1 公共配置

- option: entry读取, output, extensions 等基础配置

- loader: babel-loader, json-loader, url-loader, style-loader, css-loader, sass-loader, less-loader, postcss-loader, autoprefixer 等

- plugin: webpack.DefinePlugin(process.env.NODE_ENV), CommonsChunkPlugin等


#### 1.2 公共特性

- js/css/image 是否hash

- js/css/image 是否压缩

- js/css commonChunk处理


#### 1.3 开发辅助特性

- 编译进度条插件 ProgressBarPlugin

- 资源依赖表  ManifestPlugin

- 热更新处理  HotModuleReplacementPlugin

- ......


以上一些公共特性是初步梳理出来的, 不与具体的前端框架耦合. 针对这些特性可以单独写成一个npm组件, 并提供扩展接口进行覆盖, 删除和扩展功能.

在具体实现时, 可以根据 `env` 默认开启或者关闭一些特性. 比如本地开发时, 关闭 js/css/image 的hash和压缩,开启热更新功能.


### 2. Webpack配置面向对象实现

- 针对上面梳理的公共基础配置, 可以把webpack配置分离成三部分: option, loader, plugin

- 针对客户端和服务端打包的差异性, 设计成三个类 `WebpackBaseBuilder`, `WebpackClientBuilder`, `WebpackServerBuilder`


![image](/img/webpack/WebpackBuilder.png)



### 3. Webpack工程化整体方案


![image](/img/webpack/Webpack.png)