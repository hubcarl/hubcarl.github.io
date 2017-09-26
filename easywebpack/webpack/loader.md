---
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

## 内置配置loader

```js

exports.babel = {
  enable: true,
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'babel-loader'
    }
  ]
};

exports.eslint = {
  enable: true,
  test: /\.jsx?$/,
  use: ['eslint-loader'],
  exclude: /node_modules/,
  enforce: 'pre'
};

exports.css = {
  enable: true,
  test: /\.css$/,
  use: ['css-loader'],
  postcss: true,
  framework: true
};

exports.scss = {
  enable: true,
  test: /\.scss/,
  use: ['css-loader', 'sass-loader'],
  postcss: true,
  framework: true
};

exports.sass = {
  enable: true,
  test: /\.sass/,
  use: ['css-loader', {
    loader: 'sass-loader',
    options: {
      indentedSyntax: true
    }
  }],
  postcss: true,
  framework: true
};

exports.less = {
  enable: true,
  test: /\.less/,
  use: ['css-loader', 'less-loader'],
  postcss: true,
  framework: true
};

exports.stylus = {
  enable: true,
  test: /\.stylus/,
  use: ['css-loader', 'stylus-loader'],
  postcss: true,
  framework: true
};

exports.urlimage = {
  enable: true,
  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 1024
      },
      fn(){
        return {
          options: {
            name: this.config.imageName
          }
        }
      }
    }
  ]
};

exports.urlfont = {
  enable: true,
  test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 1024
      },
      fn(){
        return {
          options: {
            name: this.config.frontName
          }
        }
      }
    }
  ]
};

```
