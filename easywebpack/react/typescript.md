---
layout: webpack/react
description: "专注于技术,切不能沉迷于技术!"
---


## TypeScript 构建支持

### 版本要求 ^3.6.0

- easywebpack-react: ^3.6.0

### 新增 typescript 构建支持

支持通过 Webpack 构建 typescript 项目, 默认开启 tslint 检查

#### 启用 typescript 编译

```js
// webpack.config.js
module.exports = {
  loaders:{
    typescript: true
  }
}
```

#### 启用 tslint 

自动修复功能，tslint 默认启用, 自动修复默认禁用，可以通过如下方式开启

```js
// webpack.config.js
module.exports = {
  loaders:{
    tslint:{
      options: {
        fix: true
      }
    }
  }
}
```

#### 项目骨架

[Egg + React + TypeScript + Webpack](https://github.com/hubcarl/egg-react-webpack-boilerplate/tree/typescript)