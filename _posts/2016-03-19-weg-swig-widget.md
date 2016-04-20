---
layout: post
title: weg系列-swig自定义标签之widget
date: 2016-03-19
categories: blog
tags: [weg,swig,widget]
description: 
---



在做一个很复杂的页面时,我们希望把页面分割成模块, 模块包括所需要的css/js/html/images等, 这样可以做到页面复杂简单化和规范化.这样就要介绍swig 自定义widget标签

#### widget标签: 


用于页面模块分割,把一个复杂的页面分割成多个模块(widget),每个widget包含js/css/images资源, 有了widget 我们就可以知道每个模块依赖的css和js,这样为后续按需加载提供了可能.

一个widget包括 images, css, js, html 等, 它们放在统一文件夹下面, 同时文件夹的名字和css/js/html的文件夹的名字保持一致.保证一致的作用是在进行widget引用时,

同名的css/js会自动加载到页面中, 同时引用文件路径时可以简化写法.


1. 模板类：包含 tpl, 可以选择性的添加 js 和 css 文件，同名的 js 和 css 会被自动加载。

  模板类文件，可以在模板中通过 widget 标签引用。如

  ```tpl
  {# widget "widget/menu/menu.tpl" #}
  ```

2. js 类： 主要包含 js 文件，放在此目录下的文件一般都会自动被 amd define 包裹，可选择性的添加同名 css 文件，会自动被引用。

  此类组件，可以在 tpl 或者 js 中通过 require 标签引用。

```tpl
    {# require "client/views/page/news/index/index.js" #}
    {# script #}
        console.log('>>>>test>>>>>');
        require('client/views/page/news/index/index.js');
    {# endscript #}
```
  
  
3. 纯 css 类：只是包含 css 文件。比如 compass. 同样也是可以通过 require 标签引用。


4. 例如下面的列表item widget:

    - [list-item 目录]
            - [list-item.js js文件]
            - [list-item.css css文件]
            - [list-item.tpl htm模板]
      
5. 页面引入widget:

```html
{# widget "widget/news/index/index.tpl" p1="111" p2="222" p3="333" #}
```    

widget/news/index/index.tpl 内容:

```html
    {# for item in list #}
    <li>
        <div class="point">+{{item.hits}}</div>
        <div class="card">
            <h2><a href="/detail/{{item.id}}" target="_blank">{{item.title}}</a></h2>
            <div>
                <ul class="actions">
                    <li>
                        <time class="timeago">{{item.moduleName}}</time>
                    </li>
                    <li class="tauthor">
                        <a href="#" target="_blank" class="get">Sky</a>
                    </li>
                    <li><a href="#" class="kblink-8007">+收藏</a></li>
                    <li>
                        <span class="timeago">widget datasource: total:{{total}}  visitCount:{{visitCount}}</span>
                    </li>
                    <li>
                        <span class="timeago">widget attr:{{p1}}_{{p2}}_{{p3}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </li>
    {# endfor #}
    {# script #}
        require('./index.js');
    {# endscript #}
```    

index.tpl 页面中引入widget, 这里会自动加载index.tpl同名index.css和 index.js. 

其中 p1, p2,p3 这些键值对会自动生成swig 局部目标变量, 这样同一widget,可以传递不同的局部变量控制内容显示

 
6. widget的高级用法

{# widget "widget/header/header.html" mode="pipeline" id="header" #}

采用 bigpipe 方案，允许你在渲染页面的时候，提前将框架输出，后续再把耗时的 pagelet 通过 chunk 方式输出到页面，以加速网页渲染。

widget mode属性有以下值:

- sync 默认就是此模式，直接输出。
- quicking 此类 widget 在输出时，只会输出个壳子，内容由用户自行决定通过 js，另起请求完成填充，包括静态资源加载。
- async 此类 widget 在输出时，也只会输出个壳子，但是内容在 body 输出完后，chunk 输出 js 自动填充。widget 将忽略顺序，谁先准备好，谁先输出。
- pipeline 与 async 基本相同，只是它会严格按顺序输出。


- 要让 bigpipe 正常运行，需要前端引入 pagelet.js, 另外 pagelet 为 quickling 模式，是不会自动加载的，需要用户主动去调用 pagelet.load 方法，才会加载并渲染
