---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

# plugins 配置


## 内置plugin

| plugin                                     | 别名            |  默认是否开启/开启环境  | 
| :--------                                  | :-----:        | :----:        | 
| npm-install-webpack-plugin                 | npm            |  否           |
| webpack.NamedModulesPlugin                 | nameModule     |  是/dev       |
| webpack.HashedModuleIdsPlugin              | hashModule     |  是/test,prod  |
| webpack.optimize.ModuleConcatenationPlugin | module         |  是           |
| webpack.NoEmitOnErrorsPlugin               | error          |  是           |
| webpack.HotModuleReplacementPlugin         | hot            |  是/dev           |
| webpack-manifest-plugin                    | manifest       |  是           |
| progress-bar-webpack-plugin                | progress       |  是/dev       |
| directory-named-webpack-plugin             | directoryname  |  是           |
| extract-text-webpack-plugin                | extract        |  是           |
| webpack.optimize.CommonsChunkPlugin        | commonsChunk   |  是           | 
| html-webpack-plugin                        | html           |  是           |
| webpack.optimize.UglifyJsPlugin            | uglifyJs       |  是/prod      |
| imagemin-webpack-plugin                    | imagemini      | 是/prod      | 
| webpack-bundle-analyzer                    | analyzer       |  否      | 
| stats-webpack-plugin                       | stats          |  否      | 


## config.plugins 配置

**config.plugins** 非必须，支持 Object ｜ Array。 这里的plugins 是对 Webpack `plugins` 的简化和增强。建议用 **增强配置** 方式配置.

- 兼容 Webpack 原生数组配置
- [增强]支持通过别名对内置 plugin 插件的开启和禁用，以及参数配置
- [增强]支持通过别名的方式添加 plugin 插件

##### 内置 plugin 扩展参数统一通过 args 节点配置

```js
// ${app_root}/webpack.config.js
module.exports = {
  plugins:{
     ${plugin别名}:{
      args:{
        // 具体plugin参数
      }
    }
  }
}
```

##### Webpack 原生数组配置举例

```js
// ${app_root}/webpack.config.js
module.exports = {
  ......
  plugins:[
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    { 
      label: 'nameModule', // 非必需
      env: ['dev'] // 非必需
      name: webpack.NamedModulesPlugin() // name 必须
    }
  ]
}
```

##### Webpack plugins 增强配置举例

```js
// ${app_root}/webpack.config.js
module.exports = {
  ......
  plugins:{
    error: true,  //  webpack.NoEmitOnErrorsPlugin 已内置
    hot: true,   //  webpack.HotModuleReplacementPlugin 已内置
    nameModule: { // webpack.NamedModulesPlugin  已内置
      env: ['dev']
    }
  }
}
```


`key:value` 形式, 其中 `key` 为别名, 可以自由定义, easywebpack和对应解决方案内置了一些别名plugin. 


比如我要添加一个全新且easywebpack没有内置的 `webpack-visualizer-plugin` 插件, 可以这样配置如下:

```js
{
  plugins:{
    visualizer:{
      env: ['dev'], //  开发环境启用
      name: webpack-visualizer-plugin,
      args: {
       filename: './visualizer.html'
      }
    }
  }
}
```

或

```js
var Visualizer = require('webpack-visualizer-plugin');

{
  plugins:{
    visualizer:{
      env: ['dev'], //  开发环境启用
      name: new Visualizer({ filename: './visualizer.html'})
    }
  }
}
```


**修改已经内置 `easywebpack` 的压缩插件 uglifyJs 配置信息**

自定义已经内置 `easywebpack` plugin 插件的参数信息, 统一通过 `args` 配置 

```js
{
  plugins:{
    uglifyJs: {
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

**config.plugins** 配置相属性介绍


- **env**: 见 `config.env` 说明, 可选, 默认全部

- **type**: 见 `config.type` 说明, 可选, 默认全部

- **enable**: {Boolean/Function} 是否启用, 可选, 默认可用

- **name**: {String/Object} 插件名称, 支持字符串或Object

- **args**: {Object/Function} 插件参数

