---
layout: default/post
title: AngularJS 全局scope与Isolate scope通信
date: 2014-08-04
categories: blog
tags: [scope,isolate scope,scope作用域]
description: 在项目开发时，全局scope 和 directive本地scope使用范围不够清晰，全局scope与directive本地scope通信掌握的不够透彻，这里对全局scope 和 directive本地scope的使用做一个总结。
---

 
## 一、scope作用域

1、AngularJS中，子作用域一般都会通过JavaScript原型继承机制继承其父作用域的属性和方法。但有一个例外：在directive中使用scope: { ... }，这种方式创建的作用域是一个独立的"Isolate"作用域，它也有父作用域，但父作用域不在其原型链上，不会对父作用域进行原型继承。这种方式定义作用域通常用于构造可复用的directive组件.

2、如果我们在子作用域中访问一个父作用域中定义的属性，JavaScript首先在子作用域中寻找该属性，没找到再从原型链上的父作用域中寻找，如果还没找到会再往上一级原型链的父作用域寻找。在AngularJS中，作用域原型链的顶端是$rootScope，JavaScript寻找到$rootScope为止.

3、scope: { ... } - directive创建一个独立的“Isolate”作用域，没有原型继承。这是创建可复用directive组件的最佳选择。因为它不会直接访问/修改父作用域的属性，不会产生意外的副作用。

 

## 二、Isolate scope 引用修饰符

1、 = or =attr “Isolate”作用域的属性与父作用域的属性进行双向绑定，任何一方的修改均影响到对方，这是最常用的方式；

2、 @ or @attr “Isolate”作用域的属性与父作用域的属性进行单向绑定，即“Isolate”作用域只能读取父作用域的值，并且该值永远的String类型；

3、 & or &attr “Isolate”作用域把父作用域的属性包装成一个函数，从而以函数的方式读写父作用域的属性，包装方法是$parse

 

## 三、directive 与 controller 数据传递和通信

1、父controller监听全局scope(父scope)变量, 并广播事件给子scope(directive scope,每个directvie都有自己独立的scope作用域)

2、directive 定义本地scope,通过=、@、&(方法)字符显示引用全局scope

3、directive scope(子scope)通过parent[$scope.$parent.xxx]引用全局scope的属性

4、directive监听全局scope变量变化,可以通过$scope.$parent.$watch方法

## 四、实例说明

### html模板

```html

<div ng-controller="MyCtrl">
   <button ng-click="show=true">show</button>
   <dialog title="Hello }"
           visible="}"
           on-cancel="show=false;"
           on-ok="show=false;parentScope();">
       <!--上面的on-cancel、on-ok，是在directive的isoloate scope中通过&引用的。
       如果表达式中包含函数，那么需要将函数绑定在parent scope（当前是MyCtrl的scope）中-->
       Body goes here: username:} , title:}.
       <ul>
           <!--这里还可以这么玩~names是parent scope的-->
           <li ng-repeat="name in names">}</li>
       </ul>
       <div>
           Email:<input type="text" ng-model="email" style="width: 200px;height:20px"/>
       </div>
       <div>
           Count:<input type="text" ng-model="person.Count" style="width: 120px;height:20px"/>
           <button ng-click="changeCount()">Count加1</button>
       </div>
       <p></p>
   </dialog>
</div>
```

　　

### Controller 测试代码:

```javascript
var app = angular.module("Dialog", []);
   app.controller("MyCtrl", function ($scope) {
       $scope.person = {
           Count: 0
       };
       $scope.email = 'carl@126.com';
       $scope.names = ["name1", "name2", "name3"];
       $scope.show = false;
       $scope.username = "carl";
       $scope.title = "parent title";
       $scope.parentScope = function () {
           alert("scope里面通过&定义的东东，是在父scope中定义");
       };
  
  
       $scope.changeCount = function () {
           $scope.person.Count = $scope.person.Count + 1;
       }
  
  
       // 监听controller count变更, 并发出事件广播,再directive 中 监听count CountStatusChange变更事件
       $scope.$watch('person.Count', function (newVal, oldVal) {
           console.log('>>>parent Count change:' + $scope.person.Count);
           if (newVal != oldVal) {
               console.log('>>>parent $broadcast count change');
               $scope.$broadcast('CountStatusChange', {"val": newVal})
           }
       });
  
  
   });
  
  
   app.directive('dialog', function factory() {
       return {
           priority: 100,
           template: ['<div ng-show="visible">',
               '    <h3>}</h3>',
               '    <div class="body" ng-transclude></div>',
               '    <div class="footer">',
               '        <button ng-click="onOk()">OK</button>',
               '        <button ng-click="onCancel()">Close</button>',
               '    </div>',
               '</div>'].join(""),
           replace: false,
           transclude: true,
           restrict: 'E',
           scope: {
               title: "@",//引用dialog标签title属性的值
               visible: "@",//引用dialog标签visible属性的值
               onOk: "&",//以wrapper function形式引用dialog标签的on-ok属性的内容
               onCancel: "&"//以wrapper function形式引用dialog标签的on-cancel属性的内容
           },
           controller: ['$scope', '$attrs', function ($scope, $attrs) {
  
 
               // directive scope title 通过@ 引用dialog标签title属性的值，所以这里能取到值
               console.log('>>>title:' + $scope.title);
               >>>title:Hello carl scope.html:85
  
  
               // 通过$parent直接获取父scope变量页可以
               console.log('>>>parent username:' + $scope.$parent.username);
               >>>parent username:carl
  
  
               // directive scope 没有定义username 变量,并且没有引用父scope username变量, 所以这里是undefined
               console.log('>>>child username:' + $scope.username);
               >>>username:undefined
  
  
  
  
               // 接收由父controller广播count变更事件
               $scope.$on('CountStatusChange', function (event, args) {
                   console.log("child scope on(监听) recieve count Change event :" + args.val);
               });
  
  
               // watch 父 controller scope对象
               $scope.$parent.$watch('person.Count', function (newVal, oldVal) {
                   console.log('>>>>>>>child watch parent scope[Count]:' + oldVal + ' newVal:' + newVal);
               });
  
  
           }]
       };
   });
```