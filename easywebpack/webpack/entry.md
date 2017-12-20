---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---


## config.entry 配置

 
**config.entry** : Webpack 构建入口文件配置

这里的entry 对 Webpack 的 entry 进行了增强， 除了支持 webpack 原生 Object(key:value) 方式配置， 还对entry进行了增强。

#### webpack entry 原生配置

```js
// ${app_root}/webpack.config.js
module.exports = {
  ......
  entry:{
    home: path.join(__dirname, 'src/page/home/home.js')
  }
}
```

#### webpack entry 增强配置

```js
// ${app_root}/webpack.config.js
module.exports = {
  ......
  entry:{
    include:['src/page']
    exclude:[]
  }
}
```

- **config.entry.include** : {String/Object/Array/Regex} 必选, 文件根目录可以不写

     1.{Object} 支持标准的 Webpack entry 配置 Object类型(key : value)

     {String/Array} 支持根据目录自动创建 entry 配置. 值为String或者数组元素为String时,表示目录; 数组元素为Object时, 表示entry配置 
    
- **config.entry.exclude**: {String/Array/Regex} 可选, 排除不需要构建的文件或目录,支持正则表达式.

- **config.entry.loader**:  {Object}, 可选, 为 entry 配置模板,  当配置后, 可以根据 `.vue` 和 `.jsx`文件自动创建 entry 文件, key为 `config.type` 枚举值. 

- **config.entry.extMath**: {String}:, 可选, entry目录查找时匹配文件后缀, 默认 `.js`, 当配置了 `config.entry.loader` 和 `config.framework` 参数,自动映射后缀.

- **config.entry.template**: {String} 可选, 当需要构建html文件时, 必选

- **config.entry.html**: {Object} 可选, 当只有部分页面需要创建html时, 可以配置该参数, 参数节点与 `config.entry` 一致, 具体见举例 

 

## 配置举例

 
### 只构建js文件

```js
// ${app_root}/webpack.config.js
module.exports = {
  framework: 'html',
  entry:{
    include:['src/page']
    exclude:[]
  }
}
```


### HTML静态页面配置 

- 基于 `easywebpack-cli` 构建配置, 需要指定 `framework` 参数
- 要构建 HTML, 需要指定 `entry.template` 模板路径

**1. 自动遍历目录**

```js
// ${app_root}/webpack.config.js
module.exports = {
  framework: 'html',
  entry:{
    include:['src/page']
    exclude:[],
    template: 'view/layout.html'
  }
}
```


**2. 指定具体entry**

```js
// ${app_root}/webpack.config.js
module.exports = {
  framework: 'html',
  entry:{
    include:{ home: 'src/home/home.js'}
    exclude:[src/test.js],
    template: 'view/layout.html'
  }
}
```

**3. entry.loader使用**

在基于 Webpack 构建时, 我们通常都是用 js 作为 entry 入口问题, 导致入口代码重复繁琐,需要简化.

在进行页面构建时, 我们希望有统一的入口模板功能, 这样进行页面构建和js构建时, 就不需要写同样的入口代码, 提供 loader 模板功能.

在 Vue 项目构建时, 通过 loader 模板配置, 我们可以直接基于 `.vue ` 作为入口文件.

```js
// ${app_root}/webpack.config.js
module.exports = {
 entry: {
   include: ['app/web/page', { 'app/app': 'app/web/page/app/app.js?loader=false' }],
   exclude: ['app/web/page/[a-z]+/component', 'app/web/page/app'],
   loader: { // 如果没有配置loader模板，默认使用 .js 文件作为构建入口
      client: 'app/web/framework/vue/entry/client-loader.js',
      server: 'app/web/framework/vue/entry/server-loader.js',
   }	
}
```

- 以上项目中，app/web/page 目录中所有 .vue 文件当作 Webpack 构建入口. 客户端构建采用 app/web/framework/vue/entry 的 client-loader.js, 服务端渲染构建使用 server-loader.js 模板

- 上面 { 'app/app': 'app/web/page/app/app.js?loader=false' } 这个 loader=false 的含义表示 app/web/page 
目录下的 app/app.js 不使用 entry.loader 模板。因为这个app/app.js是一个SPA服务端渲染Example，实现逻辑与其他
普通的页面不一样，不能用 entry.loader 模板， 这个功能在自定义entry文件构建规范时使用。