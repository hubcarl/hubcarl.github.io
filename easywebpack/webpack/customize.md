---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

## 1.配置loader


#### 新增loader

```js
{
 loaders: {
    raw: { // 这里的key是别名,可以随意定义, 如果已存在会进行合并,否则新增loader
     test: /asset\/common\/js\/(ua|rem|st)\.js$/i,
     use: [path.join(__dirname, 'loader/raw-js.js')]
    }
 }
}
```

#### 禁用loader

```js
{
 loaders: {
   less: false
 }
}
```

#### 禁用sass/less/stylus

- 默认 sass/less/stylus 是开启的, 禁用后, 对应的 npm module 不会安装

```js
{
 loaders: {
   sass: false,
   less: false,
   stylus: false
 }
}
```

#### sass 添加import样式路径前缀

loader options 属性都可以通过 `options` 来配置

```js
{
 loaders: {
  sass: {
   options:{
     includePaths: [
       path.join(baseDir, 'app/web/asset/css'),
     ]
   }
  }
 }
}
```

#### 禁用eslint

- eslint默认是开启的

```js
{
 loaders: {
    eslint: false
 }
}
```

#### eslint 配置自动fix


```js
{
 loaders: {
    eslint: {
      options:{
       fix: true
      }
    }
 }
}
```

#### eslint 和 babel合并

- loader.use 涉及循序问题, 如果配置了use, 会覆盖原有配置

```js
{
  loaders:{
    eslint: false,
    babel: {  // babel 默认内置, 所以只需要配置 use 即可
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


## 2. 配置plugin

- plugin 支持 根据环境 `dev`,`test`,`prod` 配置是否启用, 比如内置的热更新插件

```js
exports.hot = {
  enable: true,
  type: 'client', // 只构建前端渲染
  env: ['dev'],   // 只在开发模式启用
  name: webpack.HotModuleReplacementPlugin
};
```

- 插件参数统一通过 `args` 配置


#### 添加 `env` 插件

```js
{
  plugins:{
    env: {
      name: webpack.EnvironmentPlugin,
      args: {
       NODE_ENV: 'development', // 除非有定义 process.env.NODE_ENV，否则就使用 'development'
       DEBUG: false
      }
    }
  }
}
```

#### 禁用 `env` 插件

```js
{
  plugins:{
    env: false
  }
}
```

#### 禁用图片压缩 `imagemin-webpack-plugin`

图片压缩插件在某些机器上面安装不了, 这个时候可以禁用, npm install 的时候不会安装该插件

```js
{
  plugins:{
    imagemini: false
  }
}
```

或者

```js
{
  miniImage: false
}
````

#### 添加常量 `webpack.DefinePlugin`

```js
{
  plugins:{
    define: {
      args: {
        isBrowser : typeof window === 'object',
        PROD: process.env.NODE_ENV === 'production'
      }
    }
  }
}
```


#### 压缩插件 `webpack.optimize.UglifyJsPlugin` 添加配置信息

```js
{
  plugins:{
    uglifyJs: {
      args: {
        compress: {
          warnings: false
        }
      }
    }
  }
}
```


#### 公共代码配置 `webpack.optimize.CommonsChunkPlugin`

```js
{
  plugins:{
    commonsChunk: {
      args: {
        minChunks: 5
      }
    }
  }
}
```


## 3.扩展配置举例


- 下面是一份 Webpack + Vue 的构建配置.

```js
module.exports = {
  egg: true,
  framework: 'vue',
  entry: {
    include: ['app/web/page', { 'app/app': 'app/web/page/app/app.js?loader=false' }],
    exclude: ['app/web/page/[a-z]+/component', 'app/web/page/test', 'app/web/page/html', 'app/web/page/app'],
    loader: {
      client: 'app/web/framework/vue/entry/client-loader.js',
      server: 'app/web/framework/vue/entry/server-loader.js',
    }
  },
  alias: {
    server: 'app/web/framework/vue/entry/server.js',
    client: 'app/web/framework/vue/entry/client.js',
    app: 'app/web/framework/vue/app.js',
    asset: 'app/web/asset',
    component: 'app/web/component',
    framework: 'app/web/framework',
    store: 'app/web/store'
  }
};
```

- 我们可以根据自己的需要进行扩展


```js
'use strict';
module.exports = {
  egg: true,
  framework: 'vue',
  entry: {
    include: ['app/web/page', { 'app/app': 'app/web/page/app/app.js?loader=false' }],
    exclude: ['app/web/page/[a-z]+/component', 'app/web/page/test', 'app/web/page/html', 'app/web/page/app'],
    loader: {
      client: 'app/web/framework/vue/entry/client-loader.js',
      server: 'app/web/framework/vue/entry/server-loader.js',
    }
  },
  alias: {
    server: 'app/web/framework/vue/entry/server.js',
    client: 'app/web/framework/vue/entry/client.js',
    app: 'app/web/framework/vue/app.js',
    asset: 'app/web/asset',
    component: 'app/web/component',
    framework: 'app/web/framework',
    store: 'app/web/store'
  },
  loaders: {
    eslint: false,
    sass:{
     options:{
       includePaths: [
         path.join(__dirname, 'app/web/asset/css'),
       ]
     }
    },
    less: false, // 没有使用, 禁用可以减少npm install安装时间
    stylus: false // 没有使用, 禁用可以减少npm install安装时间
  },
  plugins: {
    miniImage: false,
    define: {
      args:{
        isBrowser : typeof window === 'object',
        PROD: process.env.NODE_ENV === 'production'
      }
    },
    commonsChunk: {
      args: {
        minChunks: 5
      }
    },
    uglifyJs: {
      args: {
        compress: {
          warnings: false
        }
      }
    }
  }
};

```