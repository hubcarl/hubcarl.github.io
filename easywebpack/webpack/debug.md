---
title: 前端工程化脚手架easywebpack-cli
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

## 开发调试

- 当我们使用 `easywebpack` 时， 遇到构建问题时，我们可以通过 `easywebpack-cli` 的  `easy print` 命令检查一下生成的 webpack config 配置是否正确。

- 默认读取项目根目录下的 `webpack.config.js` 配置, 你可以通过 `-f`  参数指定指定 cli 配置文件

- easywebpack print 默认打印 dev 模式配置信息

### 安装cli

```bash
npm i easywebpack-cli  -g
```

安装成功以后, 就可以在命令行中使用 `easywebpack` or `easy` 命令, 比如 `easy init`, `easy build`, `easy server`, `easy print`, `easy clean`, `easy open` 等


### 打印配置

easywebpack print 打印 webpack 配置信息时通过 `lodash` 实现的，你可以使用 `lodash` 的相关语法打印配置信息。

```bash
easywebpack print -h
```

 Usage: print [env] [options]

  print webpack config, support print by env or config node key


  Options:

    -n, --node [key]  print webpack config info by config node key, example: [module/module.rules/plugins] and so on
    -h, --help        output usage information



####  查看 webpack 所有配置

```bash
easy print
```

####  查看 build/webpack.config.js 文件生产的 webpack配置

默认读取项目根目录下的 `webpack.config.js` 配置, 你可以通过 `-f`  参数指定指定 cli 配置文件

```bash
easy print -f build/webpack.config.js
```

#### 查看 webpack 配置 dll 配置

```bash
easy print --dll
```

#### 查看 webpack 浏览器构建模式配置

通过 -t 参数指定构建类型，也就是对应 `config.type`

```bash
easy print -t client
```
or

```bash
easy print --web
```

#### 查看 webpack Node构建模式配置

通过 -t 参数指定构建类型，也就是对应 `config.type`

```bash
easy print -t server
```
or

```bash
easy print --node
```


####  查看 webpack 配置 dll 配置

```bash
easy print --dll
```

#### 查看 webpack 配置 module 信息

```bash
easy print -n module
```

#### 查看 webpack 配置 entry 信息

```bash
easy print -n entry
```

#### 查看 webpack 配置发布 prod 模式 entry 信息

```bash
easy print prod -n entry
```

#### 查看 webpack 配置 module.rulues 信息

```bash
easy print -n module.rulues
```

#### 查看 webpack 配置 module.rulues 第三个loader信息

```bash
easy print -n module.rulues[2]
```

#### 查看 webpack 配置 plugins 信息

```bash
easy print -n plugins
```

#### 查看 webpack 配置 plugins 第三个 plugin 信息

```bash
easy print -n plugins[2]
```

