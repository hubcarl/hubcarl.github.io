---
layout: post
title: fis系列-swig自定义标签之pagelet
date: 2016-03-13
categories: blog
tags: [weg,node.js,swig,pagelet]
description: 
---


在做服务器页面渲染时,经常要实现分页功能, 一般我们有两种方案

1. ajax请求服务器数据接口实现,然后拿回数据进行html模板绑定,然后插入到dom中, 这种方案需要引入本地渲染插件或者采用mvvm框架实现

2. ajax请求服务器数据接口实现,有服务器完成数据模板渲染,然后返回插入到dom中,这种方案解决了编译效率问题,毕竟服务器渲染效率比本地要快

在做一个很复杂的页面时,我们希望把页面分割成模块, 页面渲染时分屏加载,同时资源css,js按需加载, 以上两种方案无法满足要求. 这里提出一种方案能解决我们的问题,

也就是下面要讲的pagelet模式. 要实现这个效果关键时要能分析出页面资源依赖, 通过fis3的map映射表和swig 自定义标签widget和pagelet,我们可以实现这个效果.


## Pagelet 服务器模板实现

    {# pagelet id="list" tag="none" append="true" #}
        {# widget "widget/news/index/index.tpl" p1="111" p2="222" p3="333" #}
    {# endpagelet #}

#### pagelet标签:

有三个关键属性id, tag, append, 服务器返回html给客户端时,客户端通过这三个属性来决定html怎样插入.

  1. id用来表示区域范围
  
  2. tag 表示是否生成占位标签, 默认或者等于none,不生产占位标签,否中生成指定tag的容器,比如div或者section
  
  3. append=true 表示 通过客户端js pagelet.load调用服务器接口html的插入方式,append=true表示pagelet 容器的内容是append,否则替换.
  
  这个在做局部更新和分页时非常有用.
  
#### widget标签: 

用于页面模块分割,把一个复杂的页面分割成多个模块(widget),每个widget包含js/css/images资源, 有了widget 我们就可以知道每个模块依赖的css和js,

这样在服务器局部渲染加载时,我们就知道每个模块依赖的资源,然后把css和js动态的插入页面中去.
  

## Pagelet 客户端实现


对外暴露以下几个方法。

### Pagelet.onPageletArrive

此方法不需要主动去调用，当 pagelet 输出的时候会自动调用这个方法。不管是 `chunk` 输出的 `pagelet`, 还是靠第二次请求 `quickling` 类型的 `pagelet` 都是靠此方法渲染。

示例：

```javascript
Pagelet.onPageletArrive({"container":"pages-container","id":"spage","html":"contact us","js":[],"css":[],"styles":[],"scripts":[]});
```

格式说明 

* `container` 容器
* `id` pagelet id
* `html` 内容
* `js` 外联 js 集合
* `css` 外联 css 集合
* `styles` 内联 css 集合
* `scripts` 内联 js 集合

### Pagelet.load 

Pagelet.load实际就是通过ajax请求服务器, 然后服务器根据客户端的传递过滤的pagletId(也就是页面区域id), 服务器只返回该区域的html内容和资源依赖.返回内容格式包括:

* `container` 容器
* `id` pagelet id
* `html` 内容
* `js` 外联 js 集合
* `css` 外联 css 集合
* `styles` 内联 css 集合
* `scripts` 内联 js 集合

    
客户端调用方式：

```javascript
    Pagelet.load({
            url:'/news/index/' + pager.pageIndex + '/' + pager.pageSize,
            pagelets: ['list'],
            container: 'articleList',
            param: 'key1=val1&key2=val2',
            callback: function (data) {
                console.log(data);
                successCallback(data);
                console.log('pipe load done');
            }
    });
```

参数说明

* `pagelets` pagelets 的 id 列表，可以是单个 pagelet， 也可以是多个用空格隔开，或者直接就是一个数组，里面由 pagelet id 组成。
* `url` 页面地址，默认是从当前页面去加载 pagelet，有时你可能需要加载其他页面的 pagelet。
* `param` 附带参数内容。
* `container` 指定 pagelet 渲染时的容器。
* `callback` 回调，完成后触发。

### 实例展示

参考weg-blog 项目资讯列表分页加载实现,客户端代码: client/views/page/news/index;   服务器代码: server/controller/news/index
