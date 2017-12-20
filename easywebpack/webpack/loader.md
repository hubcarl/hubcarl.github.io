---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---


## config.loaders 配置

**config.loaders** 非必须，支持 Object ｜ Array。 这里的loaders 是对 Webpack `module.rules` 的简化和增强。建议用 **增强配置** 方式配置.  

- 兼容 Webpack 原生数组配置
- [增强]支持通过别名对内置 loader 开启和禁用，以及参数配置
- [增强]支持通过别名的方式添加 loader 插件

<div class ="easy-msg-tip">
easywebpack 内置 loader 插件别名映射请看页面底部 loader 别名映射表格。
</div>

##### Webpack loaders 原生数组配置举例

```js
// ${app_root}/webpack.config.js
module.exports = {
  ......
  loaders:[
    {
      test: /\.html$/,
      use: ['html-loader', 'html-swig-loader']
    }
  ]
}
```

##### Webpack loaders 增强配置举例

```js
// ${app_root}/webpack.config.js
module.exports = {
  ......
  loaders:{
    less: true, // 开启less， 默认禁用
    stylus: true // 开启stylus， 默认禁用
  }
}
```

**config.loaders** : {Object} Webpack loader 配置, 支持自定义格式和原生格式.

`key:value` 形式, 其中 `key` 为别名, 可以自由定义, easywebpack和对应解决方案内置了一些别名和loader. 

比如我要添加一个全新且easywebpack没有内置的 html-swig-loader, 可以这样配置:

```js
{
  loaders:{
    swig : {
      test: /\.html$/,
      use: ['html-loader', 'html-swig-loader']
    }
  }
}
```

`swig` key别名随意, 我可以叫 swig, 也可以叫 htmlswig 等等


**禁用 easywebpack 内置的 `babel-loader` 可以这样配置**

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

**修改 easywebpack 内置 `babel-loader` 的 test 和 use,  可以这样配置**

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

**config.loaders具体loader配置项属性介绍** 

config.loader配置项除了支持的loader原生属性, 还扩展了 `env`, `type`, `enable`, `postcss`, `framework` 五个属性, 其中 `postcss`, `framework` 用于css相关loader, 例如内置的 `sass-loader`


```js
{
  loaders:{
    sass:{
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
       postcss: true
    }
  }
}

```

- **env**: 见 `config.env` 说明, 可选, 默认全部

- **type**: 见 `config.type` 说明, 可选, 默认全部

- **enable**: {Boolean/Function} 是否启用, 可选, 默认可用

- **postcss**: {Boolean} 可选, 特殊配置, 是否启用postcss, 只有css样式loader需要配置, 其他loader不需要配置

- **use**: {Array/Function} 必须, 支持扩展的Function配置和原生Use配置, use属性是完全覆盖.


## 内置配置loader

- easywebpack 内置了 `babel`, `eslint`, `css`, `sass`, `less`, `stylus`, `urlimage`, `urlfont` 等loader,
- easywebpack-vue 内置了 `vue`, `vuehtml` 等loader,
- easywebpack-react 内置了 `react-hot-loader` 等loader,
- easywebpack-weex 内置了 `vue`, `weex` 等loader.
- easywebpack-html 内置了 `html`, `nunjucks` 等loader.


| loader              | 别名           |  默认是否开启  |  webpack.config.js配置举例   | 
| :--------            | :-----:        | :----:      |       :----             |
| babel-loader        | babel         |  是           |禁用: loaders:{ babel: false}      |
| eslint-loader       | eslint        |  是           |禁用: loaders:{ eslint: false} <br /> 自动修复:<br/> loaders:{ eslint: {options: {fix: true}} |
| css-loader          | css           |  是           |禁用: loaders:{ css: false}                         |
| sass-loader         | sass          |  是           |禁用: loaders:{ sass: false}<br/> 路径配置:<br/> loaders:{sass: {options: {includePaths: ["asset/css"]}} |
| sass-loader         | scss          |  是           |禁用: loaders:{ scss: false}                        |
| less-loader         | less          |  否           |禁用: loaders:{ less: false}                        |
| stylus-loader       | stylus        |  否           |禁用: loaders:{ stylus: false}                         | 
| url-loader          | urlimage      |  是           |禁用: loaders:{ urlimage: false} <br/> 配置limit(默认1024):<br/> loaders:{urlimage: {options: {limit: 2048 }}  | 
| url-loader          | urlfont       |  是           |禁用: loaders:{ urlfont: false} <br/> 配置limit(默认1024):<br/> loaders:{urlfont: {options: {limit: 2048 }}   | 

