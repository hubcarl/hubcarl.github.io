### React Native与Android原生应用集成(Android Studio, React Native 0.29.1, ES6语法)


### 真机调试，bundle服务连不上,命令行执行以下命令

    adb reverse tcp:8081 tcp:8081

    8081端口占用: lsof -n -i4TCP:8081     kill -9 pid



###  "No target device found."——Android Studio真机测试中遇到的问题

  其实这是在Android Studio初始化的过程中，Android Monitor程序没被启动而无法识别USB线所连接的设备所致。 选择Android Stuido 左下角正方形菜单，然后选Android Mointor选项，Android Studio会帮你自动识别查找设备。这样就完美的解决了这个问题。

### React/React Native 的ES5 ES6写法对照表

https://zhuanlan.zhihu.com/p/20872538
http://bbs.reactnative.cn/topic/15/react-react-native-%E7%9A%84es5-es6%E5%86%99%E6%B3%95%E5%AF%B9%E7%85%A7%E8%A1%A8/10

### 学习资料

https://github.com/reactnativecn/react-native-guide

http://reactnative.cn/docs/0.28/native-modules-android.html#content

http://www.alloyteam.com/2015/10/react-native-android-steps-on-tour/

http://www.lcode.org/react-native%E7%A7%BB%E6%A4%8D%E5%8E%9F%E7%94%9Fandroid%E9%A1%B9%E7%9B%AE-%E5%B7%B2%E6%9B%B4%E6%96%B0%E7%89%88%E6%9C%AC/

http://blog.csdn.net/megatronkings/article/details/51069333

### 通信机制

http://blog.csdn.net/megatronkings/article/details/51114278

ios 通信机制：

http://c.blog.sina.com.cn/profile.php?blogid=e8e60bc08901ecz7&from=h5

http://taobaofed.org/blog/2015/12/30/the-communication-scheme-of-react-native-in-ios/

http://blog.cnbang.net/tech/2698/

android 通信机制：

http://bugly.qq.com/bbs/forum.php?mod=viewthread&tid=663

http://mobile.51cto.com/aprogram-493549.htm

http://www.tuicool.com/articles/y6zMVbb

http://blog.csdn.net/MegatronKings/article/details/51195110

http://www.howcode.cn/article/reactnative/e98741479a7b998f88b8f8c9f0b6b6f1.php

### import from React 和 import from react-native 0.25版本之后必须分开import

http://bbs.reactnative.cn/topic/981/react-native-0-25-%E6%AD%A3%E5%BC%8F%E7%89%88%E5%8F%91%E5%B8%83
http://bbs.reactnative.cn/topic/15/react-react-native-%E7%9A%84es5-es6%E5%86%99%E6%B3%95%E5%AF%B9%E7%85%A7%E8%A1%A8

#### 0.25版本之前

import React, {
    Component,
    View
} from  'react-native' ;


#### 0.25版本之后，

import React, {
  Component
} from  'react' ;

import {
View
} from  'react-native' ;

#### packages 说明
"react":

Children
Component
PropTypes
createElement
cloneElement
isValidElement
createClass
createFactory
createMixin

"react-native":
hasReactNativeInitialized
findNodeHandle
render
unmountComponentAtNode
unmountComponentAtNodeAndRemoveContainer
unstable_batchedUpdates
View
Text
ListView

### 在线画图

https://www.processon.com

### 远程加载jsbundle文件

远程加载jsbundle文件，需要开启DEBUG模式，host和port是写在PreferenceManager.getDefaultSharedPreferences，key为debug_http_host，查看DevServerHelper.java的getDebugServerHost方法


### 参考资料

https://github.com/Kennytian/embedded


callback:

https://segmentfault.com/a/1190000004508328
