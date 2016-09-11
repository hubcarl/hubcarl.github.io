---
layout: post
title: React Native Android APK包大小分析
date: 2016-08-21
categories: blog
tags: [React,React Native,Hybrid App, React Native包大小, so库, jar包]
description:

---


**React Native SO库


 ![image](https://raw.githubusercontent.com/hubcarl/hubcarl.github.io/master/_posts/images/react/x86.png)

**React Native 打包后文件大小分析

 ![image](https://raw.githubusercontent.com/hubcarl/hubcarl.github.io/master/_posts/images/react/apk-large-file.png)

**React Native java jar包分类和主要作用

 ![image](https://raw.githubusercontent.com/hubcarl/hubcarl.github.io/master/_posts/images/react/rn-jar-desc.png)

**React Native 详细引用java jar包

 ![image](https://raw.githubusercontent.com/hubcarl/hubcarl.github.io/master/_posts/images/react/RNjar.png)



1. so: 总大小：8.7MB  去掉x86后  5.1MB,   精简压缩后：**2.8MB**

2. classes.dex：4.4MB  其中RN依赖的 jar 2.1M,   整个压缩**1.9MB**

**React Native 一个Hello World的App大小在4M左右**
