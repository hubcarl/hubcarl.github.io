---
title: nginx 和 dnsmasq 部署本地服务器
layout: webpack/webpack
description: "专注于技术,切不能沉迷于技术!"
---

## nginx 和 dnsmasq 部署本地服务器

#### 在日常本地开发时,我们经常会遇到以下情况:

- 在H5本地开发页面, 经常遇到白名单(APP里面, 外部平台)和cookie问题

- 同样的包线上环境有问题,本地OK, 需要模拟线上环境


在这样的情况下,我们可以通过nginx和dnsmasq搭建本地搭建代理服务器, 把线上的域名请求映射到本机解决以上两个问题.



### nginx域名代理转发

- 如果mac系统,默认时安装了nginx, 可以通过http://127.0.0.1 检查 nginx是否正常, 如果正常会显示 `Welcome to nginx` 信息


#### 通过brew安装nginx

- brew 搜索软件

```bash
brew search nginx
```

- brew 安装软件

```bash
brew install nginx
```

- brew 卸载软件

```bash
brew uninstall nginx
```

- brew 升级

```bash
sudo brew update
```

- 查看安装信息(经常用到, 比如查看安装目录等)

```bash
sudo brew info nginx
```

- 查看已经安装的软件

```bash
brew list
```

#### nginx常用操作

- 启动nginx服务

```bash
sudo brew services start nginx
```

- 查看nginx版本

```bash
nginx -v
```

- 关闭nginx服务

```bash
sudo brew services stop nginx
```

- 重新加载nginx

```bash
nginx -s reload
```

- 停止nginx

```bash
nginx -s stop
```

#### nginx域名代理转发

- 进入nginx安装目录/usr/local/etc/nginx, 我们看到server目录下面有个default.conf配置80端口映射, 访问http://127.0.0.1时,会自动打开root对应目录的index.html文件
- nginx启动时,会自动读取/usr/local/etc/nginx/server目录所有的server配置文件,文件名可以自由定义.


```
server {
    listen 80 default_server;
    index index.html;
    root /usr/local/var/www;
    server_name 127.0.0.1;
}
```
- 自定义配置, 比如我想把proxy.test.cn 和 proxy.test1.cn 转发到本机的http://127.0.0.1:5000 地址, 只需要在server目录下面增加文件5000.conf(文件名可自定义),然后增加一下配置:

```
server {
    listen 80;
    server_name  proxy.test.cn proxy.test1.cn;
    location / {
      proxy_redirect off;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_pass http://127.0.0.1:5000;
   }
   access_log /Users/caoli/dev/log/proxy.log;
}
```

- 通过 nginx -s reload 命令重启nginx, 然后在浏览器地址栏就可以通过proxy.test.cn 和 proxy.test1.cn 访问 http://127.0.0.1:5000了. 通过以上配置就可以解决电脑端域名映射和cookie等问题.



### dnsmasq解决手机端dns问题


- 安装dnsmasq

```bash
brew install dnsmasq
```

- dnsmasq的设置

拷贝并重命名/usr/local/opt/dnsmasq/dnsmasq.conf.example -> /usr/local/etc/dnsmasq.conf。

```bash
cp /usr/local/opt/dnsmasq/dnsmasq.conf.example /usr/local/etc/dnsmasq.conf
```

- 新建resolv.dnsmasq.conf文件用来指定域名解析服务器地址的

```bash
cd /usr/local/etc
vim resolv.dnsmasq.conf
```

- 把常用的DNS服务器的地址保存到resolv.dnsmasq.conf

```
nameserver 8.8.8.8

nameserver 8.8.4.4

```

- 修改/usr/local/etc/dnsmasq.conf的resolv-file, address, listen-address, strict-order, no-hosts 配置项, 如果没有请添加, 如果是#注释,请取消注释

```

#no-hosts
no-hosts

#strict-order
strict-order

#resolv-file
resolv-file=/usr/local/etc/resolv.dnsmasq.conf

# web-server
address=/proxy.test.com192.168.1.1
address=/proxy.test1.com/192.168.1.1

# listen-address 192.168.1.1 为本机ip
listen-address=127.0.0.1,192.168.1.1

```

#### DNS服务的启用


```bash

#开机启动dns服务
sudo cp -fv /usr/local/opt/dnsmasq/*.plist /Library/LaunchDaemons
sudo lauchctl load /Library/LaunchDaemons/homebrew.mxcl.dnsmasq.plist

sudo launchctl stop homebrew.mxcl.dnsmasq
sudo launchctl start homebrew.mxcl.dnsmasq
sudo killall -HUP mDNSResponder

```

#### 检查域名映射和DNS配置

```bash

# 启动本机服务127.0.0.1:5000服务后, 检查host映射
curl 127.0.0.1 -H "Host:proxy.test.com"

# 检查域名映射是否解析到本机ip
dig proxy.test.com @0.0.0.0

```

#### 手机代理设置

- Android 手机使用DNS服务, 请安装Fast DNS Change APK, 把自己的本机IP添加到DNS列表中,如果需要用本机DNS,请双击会显示已Connnected到本机DNS, 再次点击Disconnnected

https://apkpure.com/cn/fast-dns-changer-no-root/com.mustafademir.fastdnschanger

- iOS 手机使用DNS服务, 把自己本机的ip填写到 DNS列表中, DNS的地址之间要用逗号间隔一下.

http://jingyan.baidu.com/article/dca1fa6f44c664f1a5405244.html

如果你愿意付费,可以安装个IOS APP: DNS Override，可以一键开启 dns 设置.


- PC访问

http://jingyan.baidu.com/article/fc07f9891f626712ffe519cf.html


DNS配置以后, 就可以在手机上面通过域名(http://proxy.test.com:5000 和 http://proxy.test1.com:5000) 访问, 然后映射到本机服务 http://127.0.0.1:5000.
