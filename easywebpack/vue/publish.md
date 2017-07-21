---
layout: webpack/vue
description: "专注于技术,切不能沉迷于技术!"
---

## 基于Egg+Vue+Webpack发布模式构建流程和运行模式

- Webpack通过本地构建或者ci直接构建好服务端渲染文件到磁盘

- Egg render直接读取本地文件, 然后渲染成HTML

- 根据manfifest.json 文件注入 jss/css资源依赖注入

- 模板渲染完成, 服务器输出HTML内容给浏览器.

