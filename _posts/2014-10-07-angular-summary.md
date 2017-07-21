---
layout: default/post
title: AngularJS实战总结
date: 2014-10-07
categories: blog
tags: [angular,$compile,$service,$injector,$provider]
description: 1、浏览器载入HTML，然后把它解析成DOM。2、浏览器载入angular.js脚本。3、AngularJS等到DOMContentLoaded事件触发。4、AngularJS寻找ng-app指令，这个指令指示了应用的边界。5、使用ng-app中指定的模块来配置注入器($injector)。6、注入器($injector)是用来创建“编译服务($compile service)”和“根作用域($rootScope)”的。7、编译服务($compile service)是用来编译DOM并把它链接到根作用域($rootScope)的。8、ng-init指令将“World”赋给作用域里的name这个变量。9、通过{{name}}的替换，整个表达式变成了“Hello World”。。
---

 
## 一、AngularJS 初始化加载流程


1、浏览器载入HTML，然后把它解析成DOM。

2、浏览器载入angular.js脚本。

3、AngularJS等到DOMContentLoaded事件触发。

4、AngularJS寻找ng-app指令，这个指令指示了应用的边界。

5、使用ng-app中指定的模块来配置注入器($injector)。

6、注入器($injector)是用来创建“编译服务($compile service)”和“根作用域($rootScope)”的。

7、编译服务($compile service)是用来编译DOM并把它链接到根作用域($rootScope)的。

8、ng-init指令将“World”赋给作用域里的name这个变量。

9、通过{{name}}的替换，整个表达式变成了“Hello World”。

 

## 二、AngularJS Provider/Service/Factory

 

### 1、什么是 provider ?

provider 可以为应用提供通用的服务，形式可以是常量，也可以是对象。

比如我们在 controller 里注入进来的 $http, $scope 都可以认为是 provider。

```javascript
app.controller('MainCtrl', function ($scope, $http) {
 
  $http.get(....).then(.....);
 
}
``` 

### 2、provider　　

现在让我们自己来定制一个 provider

```javascript
// 方法 1
$provide.provider('test', {
 
   n:1;
 
   $get: function () {
 
      return n;
 
    };
 
});
 
// 方法 2
$provide.provider('test', function () {
 
   this.n = 2;
 
   this.$get = function () {
 
   return n;
 
};
 
});
 
// 使用
app.controller('MainCtrl', function ($scope, test) {
    $scope.test = test;
});
```　　

让我们看看 provider 的内部实现代码

```javascript
function provider(name, provider_) {
 
  if (isFunction(provider_)) {
 
      provider_ = providerInjector.instantiate(provider_);
 
  }
 
   if (!provider_.$get) {
 
       throw Error('Provider ' + name + ' must define $get factory method.');
 
   }
 
   return providerCache[name + providerSuffix] = provider_;
 
}
``` 

可以看到 provider 的基本原则就是通过实现 $get 方法来进行单例注入，使用时获得的就是 $get 执行后的结果。

### 3、factory


那如果每次都要写一个 $get 是不是很麻烦？ OK，所以我们有了 factory。 factory 可以说是 provider 的变种， 方法中的第二个参数就是 $get 中的内容。


// 定义 factory
```javascript 
$provide.factory('dd', function () {
 
   return new Date();
 
});
```
 
// 使用

```javascript 
app.controller('MainCtrl', function ($scope, dd) {
 
    $scope.mydate = dd;
 
});
```　　


factory 的实现源代码：

```javascript
function factory(name, factoryFn) {
 
 return provider(name, {
 
   $get: factoryFn
 
});
 
}
```　　

### 4、service


在 factory 的例子中我们还是需要 new 一个对象返回，而 service 就更简单了，这一步都帮你省了， 他的第二个参数就是你要返回的对象类， 也就是 new 的哦给你工作都不用你做了。够清爽吧？

// 定义 service

$provide.service('dd', Date);


下面是 service 的实现源代码：

```javascript
function service(name, constructor) {
 
  return factory(name, ['$injector', function($injector) {
 
       return $injector.instantiate(constructor);
 
   }]);
}
``` 

然后 factory 和 service 带来代码精简的同时也损失了一些特性。 provider 定义的服务是可以通过模块 config 来配置的。

 

## 三、AngularJS 动态添加元素和删除元素

```javascript
$scope.userName='Welcome to Angular World!';
$scope.test = function test(){
console.log('Angular 动态添加元素');
}
 
//通过$compile动态编译html
var html="<div ng-click='test()'>}</div>";
var template = angular.element(html);
var mobileDialogElement = $compile(template)($scope);
angular.element(document.body).append(mobileDialogElement);
 
// remove移除创建的元素
var closeMobileDialog = function () {
if (mobileDialogElement) {
  mobileDialogElement.remove();
}
``` 

## 四、AngularJS 事件广播与接收　

 

发送消息： $scope.$emit(name, data) 或者 $scope.$broadcast(name, data);

接收消息： $scope.on(name,function(event,data){ });

区别： $emit 广播给父controller   $broadcast 广播给子controller

 

broadcast 是从发送者向他的子scope广播一个事件。

这里就是ParentController发送， ParentController 和 ChildController 会接受到, 而MainController是不会收到的

 

$emit 广播给父controller，父controller 是可以收到消息

$on 有两个参数function(event,msg)  第一个参数是事件对象，第二个参数是接收到消息信息

```javascript
angular.module('onBroadcastEvent', ['ng'])
     .controller('MainController', function($scope) {
       $scope.$on('To-MainController', function(event,msg) {
         console.log('MainController received:' + msg);
       });
     })
     .controller('ParentController', function($scope) {
       $scope.click = function (msg) {
         $scope.$emit('To-MainController',msg + ',from ParentController to MainController');
         $scope.$broadcast('To-ChildController', msg + ',from ParentController to ChildController');
         $scope.$broadcast('To-BrotherController', msg + ',from ParentController to BrotherController');
       }
     })
     .controller('ChildController', function($scope){
       $scope.$on('To-ChildController', function(event,msg) {
         console.log('ChildController received:' + msg);
       });
     })
     .controller('BrotherController', function($scope){
       $scope.$on('To-BrotherController', function(event, msg) {
         console.log('BrotherController received:' + msg);
       });
     });
``` 

## 五、AngularJS Promise Deferred实例

```javascript
var app = angular.module('app', ['autocomplete']);
app.factory('Suggestion',
function($http, $q, $timeout){
  var suggestion = new Object();
  suggestion.getData = function(keyword) {
    var deferred = $q.defer();
    $http.get('http://codesearch.sinaapp.com/search.php',
    }).success(function(data){
      deferred.resolve(data);
    });
    return deferred.promise;
  }
  return suggestion;
});
app.controller('MySuggestionCtrl',
function($scope, $sce,Suggestion){
  $scope.autoComplete = function(keyword){
    if(keyword){
        Suggestion.getData(keyword).then(function(data){
        var dataList = data.split('|');
        $scope.dataList = dataList;
      });
    }
  }
});
```
　
### 多个Promise实例：

```javascript
var data2="222";
var promises = [];
var deffered1  = $q.defer();
var deffered2  = $q.defer();
$timeout(function(){
  deffered1.resolve(data1);
},2000);
$timeout(function(){
  deffered2.resolve(data2);
},2000);
promises.push(deffered1.promise);
promises.push(deffered2.promise);
 $q.all(promises).then(function(data){
    console.log(data);
});
```

输出： ["111", "222"] 这个一个数组对象顺序与push的顺序一致

