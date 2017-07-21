---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---


## API接口

### setEnv(env, config) 

> 参数 `env` {String}  默认支持 `dev`, `test`, `prod` 三种默认配置

- `dev`  开启 `热更新`, `无hash`, `无压缩`

- `test` 开启 `hash`, `无压缩`

- `prod` 开启 `hash`, `js/css/image压缩`

> 参数 `config` {Object} 覆盖默认配置


### setConfig(config) 

> 参数 `config`  {Object}  覆盖默认配置


### setEntry(entry)

> 参数 `entry`   {Object} webpack entry 目录, 自动读取

```js
entry.include {Array|String} 包含的目录
entry.exclude {Array|String} 排除的目录或者文件
```


### setHot(hot)  是否开启热更新

> 参数 `hot`  {Boolean}  是否开启热更新

### setPrefix(prefix)

> 参数 `prefix`  {String}  编译的文件加上目录前缀, ${buildPath}+ ${prefix} + ${filename}

### setExtensions(extendsion)

> 参数 `extendsion`  {Array OR String}  Webpack config `resolve.extensions`


### setExternals(externals)

> 参数 `externals`  {Object}  Webpack config `externals`


### setAlias(name = {}, value, useBaseDir = true) 

- 参数 `name`  {Object Or String}  alias key

- 参数 `value`  {String}  alias value

- 参数 `useBaseDir`  {Boolean} 默认自动处理根目录


### setDefine(defines) 常量设置, 通过 `webpack.DefinePlugin` 设置 

- 参数 `defines`  {Object}  key: value 形式


### setMiniImage(miniImage)

> 是否压缩图片

- 参数 `miniImage`  {Boolean OR Object}  

- Boolean: true 压缩,  false 不压缩 

- Object: 压缩, 同时与默认配置选项合并


### setMiniJs(miniJs)

> 是否压缩Js

- 参数 `miniJs`  {Boolean OR Object}  

- Boolean: true 压缩,  false 不压缩 

- Object: 压缩, 同时与默认配置选项合并

### setMiniCss(miniCss)

> 是否压缩Css

- 参数 `miniCss`  {Boolean OR Object}  

- Boolean: true 压缩,  false 不压缩 

- Object: 压缩, 同时与默认配置选项合并

### setAutoprefixer(prefixer, replace = true)

> 是否启用autoprefixer

- 参数 `prefixer`  {Boolean OR Object}  

- Boolean: true 启用,  false 不启用

- Object: 启用, 同时与默认配置选项合并


### setCommonsChunk(commonsChunk) 

> 参数 `commonsChunk`  {Array OR String}  webpack.optimize.CommonsChunkPlugin


### setBuildPath(buildPath)

> 参数 `buildPath`  {String}  编译目录, 自动处理项目baseDir


### setPublicPath(publicPath, isOverride = true)

> 参数 `publicPath`  {String}  webpack 构建url访问路径


### setCDN(cdnUrl, cdnDynamicDir)

- 参数 `cdnUrl`  {String} 必须 webpack 设置cdn地址, 一般prod环境设置

- 参数 `cdnDynamicDir`  {String} 可选  cdn 动态目录, ${cdnUrl} + ${cdnDynamicDir}


### setProxy(proxy) 

> 本地开发代理特性

- 参数 proxy  {Boolean}  本地开发代理特性 , true: 使用,  false 不使用, 默认 false

当与后端框架(比如egg,koa)框架本地开发时, webpack 编译是启动的单独的服务, 与项目服务不是一个端口, 访问资源时:
 
- `proxy = true` 时, 页面可以直接使用 `/public/client/js/vendor.js` 相对路径,  `/public/client/js/vendor.js` 
由后端框架代理转发到 webpack 编译服务, 然后返回内容给后端框架, 这里涉及两个应用通信. 如下:

```js
<script type="text/javascript" src="/public/client/js/vendor.js"></script>
```




- `proxy = false` 时, 页面必须使用 `http://127.0.0.1:9001/public/client/js/vendor.js` 绝对路径

```js
<script type="text/javascript" src="http://127.0.0.1:9001/public/client/js/vendor.js"></script>
```



### setDevMode(port, proxy = false)



### setDevTool(devTool) 

> 参数 `devTool`  {Boolean OR String}  本地开发使用, webpack devtool


### setOption(option) 扩展配置

> 当提供的api不能满足要求时, 可以通过改方法配置webapck

- 参数 `option`  {Object} option 为webpack原生配置


### addEntry(name, value)

> 单独添加entry, 比如为commonChunks 添加额外的第三方库

- 参数 `name`  {String} entry的key

- 参数 `value`  {String OR Array}  entry的value


### addStat(ex) 

> 是否生成性能分析Stat.json 文件

- 参数 `ex`  {Boolean OR Object}

- Boolean: true 是,  false 否 

- Object: 生成, 同时与默认配置选项合并


### addLoader(test, loader, option, ex) 

> 添加Webpack loader, 支持覆盖


- test {Object}  正则 或者 webpack loader

- loader {String} 当test为正则时, loader 为loader name 字符串

- option {Object OR Function} 当test为正则时, loader 扩展信息, 可以为Function, 调用create方式动态创建loader

- ex 扩展信息, loader 进行merge操作, 支持 fn(Function)配置

> 方式一: 直接按照方法参数loader配置

```js
this.addLoader(/\.(png|jpe?g|gif|svg)(\?.*)?$/, 'url-loader', () => ({
      query: {
        limit: 1024,
        name: this.config.imageName
      }
    }), ex);
```


> 方式二: 直接传webpack原生格式配置

```js
this.addLoader({
 test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
 loader:'url-loader',
 query: {
   limit: 1024,
   name: this.config.imageName
  }
});
```


> 方式三: 通过 fn 参数动态创建

```js
this.addLoader({
  test: /\.vue$/,
  fn: () => {
    return {
      use: {
        loader: 'vue-loader',
        options: {
          loaders: {
            css: [vueStyleLoader, cssLoader],
            scss: [vueStyleLoader, cssLoader, sassLoader],
            sass: [vueStyleLoader, cssLoader, sassLoader]
          },
          compilerModules: [{
            postTransformNode: el => {
              el.staticStyle = `$processStyle(${el.staticStyle})`;
              el.styleBinding = `$processStyle(${el.styleBinding})`;
            }
          }]
        }
      }
    };
  }
});
```


### addPlugin(clazz, args, enable, replace = true)

> 添加Webpack plugin, 支持覆盖

- clazz {Object OR Class}  plugin 处理

- args {Object OR Function} 当clazz为class时, 使用参数

- enable {Boolean} 是否使用  true: 使用  false: 禁用

- replace 有相同的plugin是否替换, 默认为替换

> 方式一: 直接调用方法参数plugin配置

```js
this.addPlugin(webpack.optimize.UglifyJsPlugin, () => {
      const defaultOption = {
        compress: {
          warnings: false,
          dead_code: true,
          drop_console: true,
          drop_debugger: true
        }
      };
      return Utils.isObject(miniJs) ? merge(defaultOption, miniJs) : defaultOption;
}, !!miniJs);
```

> 方式二: 直接传webpack原生格式配置

```js
this.addPlugin(new webpack.optimize.UglifyJsPlugin({
   compress: {
     warnings: false,
     dead_code: true,
     drop_console: true,
     drop_debugger: true
   }
 });
```


### addPack(name = {}, value, useCommonsChunk = false)

> Webpack单独构建javascript

- 使用举例, 最终会进行babel转换生成 `sdk.js`, 自动处理根目录

```js
  this.addPack('sdk', ['app/web/framework/sdk.js']):
```

### create()

> 调用该方法最终的webpack配置
