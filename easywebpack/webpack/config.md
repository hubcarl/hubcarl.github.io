---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

## 1. `webpack.config.js` 完整举例


**说明**: 大部分配置已内置, 开发时, 仅仅需要配置 `entry`, `alias`等属性


```js
{
 baseDir: process.cwd(),            // 项目根目录
 env: process.env.BUILD_ENV,        // 编译模式, 支持 `dev`, `test`, `prod`, 默认开发
 egg: true,                         // egg框架特有, 如果为true, 会自动初始化egg规范配置
 type: ['client', 'server']         // Webpack构建类型, 可以指只构建 client 或者 server, 或者全部, 默认全部
                                      其中 Vue 和 React 为 'client' 和 'server', Weex 为 'weex' 和 'web'
 buildPath: 'public',               // webpack编译文件存放目录
 publicPath: '/public/',            // webpack内存编译访问路径
 entry:{                            // 前端后端渲染entry配置
   include: ['app/web/page']        // webpack entry 自动读取目录
   exclude: ['app/web/page/test']   // 过滤目录, 支持正则
   loader: {                        // entry loader 模板, 根据 type 自动寻找模板
     client: 'app/web/framework/entry/loader.js'
   },
   html:{                             // 生成Html页面entry配置
       include: ['app/web/test']       // webpack entry 自动读取目录
       exclude: ['app/web/html/test']  // 过滤目录, 支持正则
       template: 'app/web/view/layout.html', // 生成html模板
       buildDir: 'html',               // 编译目录
    }
 },
 alias: {                           // webpack别名设置
  asset: 'app/web/asset',
  framework: 'app/web/framework',
  store: 'app/web/store'
 },                                  
 packs: {                           // 单独打包
  'sdk.js':'app/web/framework/sdk.js'
 },                         
 cdn: {                             // cdn 配置
  url: 'xxxx'
 }, 
 create(){                          // 自定义扩展, 可以用 this
    if(this.type ==='client'){      // 对浏览器模式进行扩展
      // ...
    }else if(this.type ==='server'){ // 对服务端配置进行扩展
      // ...    
    }
 }                          
 hot: false,                        // 热更新 
 hash: true,                        // 是否hash
 miniJs: true,                      // 是否压缩js
 miniCss: true,                     // 是否压缩Css
 miniImage: true,                   // 是否压缩图片,
 options: {
    resolve: {
       extensions: ['.js', '.jsx']
     },
     resolveLoader: {
       modules: [
         path.join(__dirname, '../node_modules'),
         path.join(baseDir, 'node_modules'),
         'node_modules'
       ]
     }
 },
 loaders: {},
 loaderOptions: {
  css: {
   minimize: true
  }
 },
 plugins: {
   define: {
     args: { 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production') }
   },
   manifest: {}
 }
}
```

## 2. 参数配置说明

## 2.1 环境配置 

**config.env** : 目前支持 `dev`, `test`, `prod` 三种环境, 默认 `dev` 

- dev  : 开启热更新(`config.hot=true`), js (`config.miniJs=false`), image (`config.miniImage=false`), css (`config.miniCss=false`) 不压缩, 不 hash (`confg.hash=false`)
- test : 开启热更新(`config.hot=false`), js (`config.miniJs=false`), image (`config.miniImage=false`), css (`config.miniCss=false`) 不压缩, hash (`config.hash=true`)
- prod : 开启热更新(`config.hot=false`), js (`config.miniJs=true`), image (`config.miniImage=true`), css (`config.miniCss=true`) 压缩, hash (`config.hash=true`)
- 本地开发(`dev`)时, 为了支持 `css hot reload`, css 样式必须 inline, 所以默认构建是全部 inline css (`config.cssExtract=false`), `test` 和 `prod` 环境时, css是独立出css文件(`config.cssExtract=true`)

## 2.2 前端框架配置

**config.framework** : 需要结合 `easywebpack-cli` 使用的, 支持 `vue`,`react`, `weex` 三种配置,  cli 根据 framework 配置获取对应解决方案动态创建 Webpack 配置.

- Vue 解决方案 : easywebpack-vue
- React 解决方案 : easywebpack-react
- Weex 解决方案 : easywebpack-weex

## 2.3 构建类型配置

**config.type** : 需要结合 `easywebpack-cli` 使用的, 目前支持 `client`, `server`, `web`, `weex`, 其中 `client` 和 `server` 配对使用, `web` 和 `weex` 配对使用.

- client : 客户端(Browser)模式, 比如 `Vue` 和 `React` 前端渲染
- server : 客户端(Browser)模式, 比如 `Vue` 和 `React` 服务端渲染
- web    : Weex 客户端(Browser)模式, 构建 `Web` 页面
- weex   : Weex Native(App)模式, 构建Native运行的 `jsbundle` 文件


## 2.4 Egg框架配置

**config.egg** : 特殊参数, 使用Egg框架进行Server Side Render 特殊配置, 需要设置为 `true`, 表示Webpack构建的服务端文件放到 `app/view` 目录.

## 2.5 Entry构建配置

**config.entry** : Webpack 构建入口文件配置

- **config.entry.include** : {String/Object/Array} 必选, 文件根目录可以不写

     1.{Object} 支持标准的 Webpack entry 配置 Object类型(key : value)

     2.{String/Array} 支持根据目录自动创建 entry 配置. 值为String或者数组元素为String时,表示目录; 数组元素为Object时, 表示entry配置 
    
- **config.entry.exclude**: {String/Array} 可选, 排除不需要构建的文件或目录,支持正则表达式.

- **config.entry.loader**:  {Object}, 可选, 为 entry 配置模板,  当配置后, 可以根据 `.vue` 和 `.jsx`文件自动创建 entry 文件, key为 `config.type` 枚举值. 

- **config.entry.extMath**: {String}:, 可选, entry目录查找时匹配文件后缀, 默认 `.js`, 当配置了 `config.entry.loader` 和 `config.framework` 参数,自动映射后缀.

- **config.entry.template**: {String} 可选, 当需要构建html文件时, 必选

- **config.entry.html**: {Object} 可选, 当只有部分页面需要创建html时, 可以配置该参数, 参数节点与 `config.entry` 一致, 具体见举例

## 2.5 构建目录配置

**config.buildPath** : Webpack的 `output.path`
    

## 2.6 访问路径配置

**config.publicPath** : Webpack的 `output.publicPath`


## 2.7 alias别名配置

**config.alias** : Webpack的 `resolve.alias`

    {Object} 对目录进行别名设置,  文件项目根目录可以不写

## 2.8 options节点配置

**config.options** : {Object} 可选 Webpack 原生配置, 当提供配置和API不满足要求时, 可以在这里配置. 


## 2.9 loaders配置

**easywebpack内置loader**

- easywebpack 内置了 `babel`, `eslint`, `css`, `sass`, `less`, `stylus`, `manifest`,`urlimage`, `urlfont` 等loader,
- easywebpack-vue 内置了 `vue`, `vuehtml` 等loader,
- easywebpack-weex 内置了 `vue`, `weex` 等loader.

**config.loaders** : {Object} Webpack loader 配置, 支持自定义格式和原生格式.

`key:value` 形式, 其中 `key` 为别名, 可以自由定义, easywebpack和对应解决方案内置了一些别名和loader. 比如我要添加 `babel-loader` (已内置), 配置如下:

```js
{
  loaders:{
    babel : {
      enable: true,
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: [
       {
        loader: 'babel-loader'
       }
      ]
    }
  }
}
```

**禁用 `babel-loader` 可以这样配置**

```js
{
  loaders:{
    babel:false
  }
}
```

或

```js
{
  loaders:{
    babel:{
     enable:false
    }
  }
}
```

**修改 `babel-loader` 的 test 和 use,  可以这样配置**

因use存在顺序问题, use 目前采用的策略是完全覆盖

```js
{
  loaders:{
    babel : {
      test: /\.(jsx|vue)?$/,
      exclude: [/node_modules/, 'page/test'],
      use: [
       {
        loader: 'babel-loader'
       },
       {
        loader: 'eslint-loader'
       }
      ]
    }
  }
}
```

**单独添加 `eslint-loader` 配置, 别名随意, 我可以叫 eslint, 也可以 叫 lint 等等**

```js
{
  loaders:{
    eslint : {
      test: /\.(jsx|vue)?$/,
      exclude: [/node_modules/, 'page/test'],
      use: [
       {
        loader: 'eslint-loader'
       }
      ]
    }
  }
}
```

**config.loaders具体loader配置项属性介绍** 

config.loader配置项除了支持的loader原生属性, 还扩展了 `env`, `type`, `enable`, `postcss`, `framework` 五个属性, 其中 `postcss`, `framework` 用于css相关loader, 例如内置的 `sass-loader`


```js
exports.sass = {
  enable: true, 
  type: ['client', 'server'],
  test: /\.sass/,
  exclude: /node_modules/,
  use: ['css-loader', {  
    loader: 'sass-loader',
    options: {
      indentedSyntax: true
    }
  }],
  postcss: true,
  framework: true
};

```

- **env**: 见 `config.env` 说明, 可选, 默认全部

- **type**: 见 `config.type` 说明, 可选, 默认全部

- **enable**: {Boolean/Function} 是否启用, 可选, 默认可用

- **postcss**: {Boolean} 可选, 特殊配置, 是否启用postcss, 只有css样式loader需要配置, 其他loader不需要配置

- **framework**: {Boolean} 可选, 特殊配置, 是否作为解决方案的依赖css loader, 比如 `Vue`, `Weex` 需要配置, 其他loader不需要配置

- **use**: {Array/Function} 必须, 支持扩展的Function配置和原生Use配置, use属性是完全覆盖.



## 2.10 plugins配置

`key:value` 形式, 其中 `key` 为别名, 可以自由定义, easywebpack和对应解决方案内置了一些别名plugin. 比如我要添加 `webpack.optimize.UglifyJsPlugin` (已内置), 配置如下:

```js
exports.uglifyJs = {
  enable: true,
  env: ['prod'],
  name: webpack.optimize.UglifyJsPlugin,
  args: {
    compress: {
      warnings: false,
      dead_code: true,
      drop_console: true,
      drop_debugger: true
    }
  }
};
```

**添加 uglifyJs 配置**


```js
{
  plugins:{
    uglifyJs: {
      env: ['prod'],
      name: webpack.optimize.UglifyJsPlugin,
        args: {
          compress: {
            warnings: false,
            dead_code: true,
            drop_console: true,
            drop_debugger: true
          }
        }
    }
  }
}
```

**禁用 uglifyJs 配置**

```js
{
  plugins:{
    uglifyJs: false
  }
}
```

**修改 uglifyJs 配置**

```js
{
  plugins:{
    uglifyJs : {
     args: {
       compress: {
         warnings: true
       }
      }
    }
  }
}
```

**config.plugins** 配置相属性介绍


- **env**: 见 `config.env` 说明, 可选, 默认全部

- **type**: 见 `config.type` 说明, 可选, 默认全部

- **enable**: {Boolean/Function} 是否启用, 可选, 默认可用

- **name**: {String/Object} 插件名称, 支持字符串或Object

- **args**: {Object/Function} 插件参数


**内置plugin**

- module: webpack.optimize.ModuleConcatenationPlugin

- error: webpack.NoEmitOnErrorsPlugin

- hot: webpack.HotModuleReplacementPlugin

- manifest: webpack-manifest-plugin

- progress: progress-bar-webpack-plugin

- directoryname: directory-named-webpack-plugin

- extract: extract-text-webpack-plugin

- html: html-webpack-plugin

## 2.11 packs单独打包配置

**config.packs**: {Object} `key:value` 形式, 其中 `key` 为生成的文件名, `value`为要打包的文件

## 2.12 cdn配置

**config.cdn.url**: url为地址配置, 一般为线上环境使用.

## 2.13 常用简化配置

- hot {Boolean} 是否启用热更新
- hash: {Boolean} 是否hash
- miniJs: {Boolean} 是否压缩js
- miniCss: {Boolean} 是否压缩css
- miniImage: {Boolean} 是否压缩image

## 3. config 扩展方法

**config.done**: {Function} 编译完成回调方法

**config.create**: {Function} 扩展方法, 调用`create`方法之前调用

**根据 `config.type` 提供对应的 `on[this.type]` (type首字母大写)方法**

- `easywebpack-vue` 和 `easywebpack-react` 提供 `onClient` 和 `onServer` 方法
- `easywebpack-weex` 提供 `onWeb` 和 `onWeex` 方法

  
## 4. easywebpack 内置默认配置  

内置 `dev `,  `test `,  `prod`三种环境支持, 通过 `config.env` 或者 `setEnv(env)` 设置 

### 4.1 正式环境

```js
exports.defaultConfig = {
  baseDir: process.cwd(),
  buildPath: 'public',
  publicPath: '/public/',
  alias: {},
  packs: {},
  cdn: {},
  hot: false,
  hash: true,
  miniJs: true,
  miniCss: true,
  miniImage: true,
};
```

### 4.2 开发环境

与 `defaultConfig` 进行merge操作

```js
exports.devConfig = {
  hot: true,
  hash: false,
  miniJs: false,
  miniCss: false,
  miniImage: false,
};
```

### 4.3 测试环境

与 `defaultConfig` 进行merge操作

```js
exports.testConfig = {
  hot: false,
  hash: true,
  miniJs: false,
  miniCss: false,
  miniImage: false
};
```

## 5. WebpackBaseBuilder 构造参数 `config`

以上配置适用与直接通过 `easywebpack.WebpackBaseBuilder` 构建Webpack 配置

- 如果以上配置再加上 `framework` 配置(支持 `vue`, `react`, `weex`), 就可以直接通过 `easywebpack-cli` 完成构建

- 如果直接使用 `easywebpac-vue`,  `easywebpac-react`,  `easywebpac-weex` 进行配置编写, 以上配置可以通过 API 完成, 配置可以简化.  