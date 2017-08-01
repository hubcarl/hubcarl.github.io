---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

## 1. WebpackBaseBuilder 定义

```js
class WebpackBaseBuilder{
 constructor(config) {
 
 }
}
```

## 2. `constructor` 构造函数 `config` 完整配置举例


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
   }
 },
 html:{                             // 生成Html页面entry配置
    include: ['app/web/test']       // webpack entry 自动读取目录
    exclude: ['app/web/html/test']  // 过滤目录, 支持正则
    template: 'app/web/view/layout.html', // 生成html模板
    buildDir: 'html',               // 编译目录
 }
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
 manifest: true,                    // 生成 manifest
 buildConfig: true,                 // 生成 配置文件
 hot: false,                        // 热更新 
 hash: true,                        // 是否hash
 miniJs: true,                      // 是否压缩js
 miniCss: true,                     // 是否压缩Css
 miniImage: true,                   // 是否压缩图片
 defines: { 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production') } // 常量
}
```


可以直接通过 `config` 配置完成Webpack Builder构建, 也可以通过调用WebpackBuilder相关方法单独设置.

- 如果以上配置再加上 `framework` 配置(支持 `vue`, `react`, `weex`), 就可以直接通过 `easywebpack-cli` 完成构建

- 如果直接使用 `easywebpac-vue`,  `easywebpac-react`,  `easywebpac-weex` 进行配置编写, 以上配置可以通过 API 完成, 配置可以简化.
  
## 3. easywebpack 内置默认配置  

内置 `dev `,  `test `,  `prod`三种环境支持, 通过 `config.env` 或者 `setEnv(env)` 设置 

### 3.1 正式环境

```js
exports.defaultConfig = {
  baseDir: process.cwd(),
  buildPath: 'public',
  publicPath: '/public/',
  alias: {},
  packs: {},
  cdn: {},
  manifest: true,
  buildConfig: true,
  hot: false,
  hash: true,
  miniJs: true,
  miniCss: true,
  miniImage: true,
  defines: { 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production') }
};
```

### 3.2 开发环境

与 `defaultConfig` 进行merge操作

```js
exports.devConfig = {
  hot: true,
  hash: false,
  miniJs: false,
  miniCss: false,
  miniImage: false,
  defines: { 'process.env.NODE_ENV': JSON.stringify('development') }
};
```

### 3.3 测试环境

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
  