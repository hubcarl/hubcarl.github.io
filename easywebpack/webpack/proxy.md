---
title: webpack CommonsChunk 工程化实现
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

## 本地开发域名代理

### 构建支持

- 前提：代理域名能够映射到本机ip地址, 该功能只在 Egg 应用构建本地开发使用

- 在 Egg SSR 应用开发时，Egg 应用的访问地址， 静态资源构建的地址， HMR 地址都是 ip, 不方便进行环境模拟测试，比如 cookie和 登陆场景。

```js
// webpack.config.js
module.exports = {
  host: 'http://app.debug.com' // 只在 env: dev 方式生效
}
```

- 应用访问的地址是： http://app.debug.com
- HMR访问地址是：http://app.debug.com:9000/__webpack_hmr


### nginx 和 dnsmasq 配合使用

如何在本地通过 nginx 和 dnsmasq 在本地搭建域名服务：[nginx 和 dnsmasq 在本地搭建域名服务](/easywebpack/webpack/nginx)