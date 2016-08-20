---
layout: post
title: React Native 深入浅出
date: 2016-08-20
categories: blog
tags: [React,React Native,Hybrid App, React Native与JS交互原理]
description:

---

# learn once write anywhere


What we really want is the user experience of the native mobile platforms, combined with the developer experience we have when building with React on the web.

**既保留流畅的用户体验，又保留React的开发效率**



# 一. H5/Hybrid,React Native,Native对比

1. UI布局：Web布局灵活度 > React Native > Native
2. UI截面图：React Native使用的是原生组件,可以与Native持平
3. 动画：React Native动画需求基本满足
4. 安装包体积：React Native框架打包后(去掉x86 so)，4MB左右
5. 更新能力: H5/Hybrid > React Native > Native
6. 维护成本: H5/Hybrid <= React Native < Native
7. 真机体验：Native >= React Native > H5/Hybrid
8. React Native上手简单, 框架定制和扩展比Native有些大, 但是具备跨平台能力和热更新能力。



# 二. React Native优势

1. 原生应用的用户体验

2. 跨平台特性,热更新能力,调试方便

3. 开发人员单一技术栈

4. 社区繁荣

5. 适合尝试性,快速满足双平台的App应用



# 三. React Native劣势

1. React Native上手简单, 框架定制和扩展成本高

2. React Native 深入学习成本高(java,Android,JNI,C++,React)

3. 首次启动和Big ListView 问题

4. 大型应用后期的维护成本高，在崩溃率，性能优化方面是个比较大的挑战。



# 四. React-Native 做了什么

1. React-Native 丢弃了 Webview, 生成的视图是原生Native视图

2. 复用React，将 Dom 结构的改变通过 diff 算法处理后，由 js 传递给 native 进行底层视图布局。

3. css-layout引擎，前端可以继续写熟悉的 css 语法，由引擎转化成底层的布局。

4. 对js暴露底层常用的UI组建, js 层可以直接对这些组件进行布局。



# 五. 对应前端的开发模式的变化

1. JSX vs Html

2. css-layout vs css

3. ECMAScript 6 vs ECMAScript 5

4. React-Native vs DOM




# 六. React Native学习点

1. React基础知识

2. Native与JS交互原理

3. 基本的Android编程知识

4. 组件使用

5. Native和JS自定义组件编写




# 七. React Native APK 大小分析


1. so: 总大小：8.7MB  去掉x86后  5.1MB,   精简压缩后：**2.8MB**

2. classes.dex：4.4MB  其中RN依赖的 jar 2.1M,   整个压缩**1.9MB**

react-native apk一个helloword的app大小在4M左右

 ![image](https://raw.githubusercontent.com/hubcarl/hubcarl.github.io/master/_posts/images/react/x86.png)

 ![image](https://raw.githubusercontent.com/hubcarl/hubcarl.github.io/master/_posts/images/react/apk-large-file.png)

 ![image](https://raw.githubusercontent.com/hubcarl/hubcarl.github.io/master/_posts/images/react/rn-jar-desc.png)

 ![image](https://raw.githubusercontent.com/hubcarl/hubcarl.github.io/master/_posts/images/react/RNjar.png)


# 八. Native与JS交互原理

 ![image](https://raw.githubusercontent.com/hubcarl/hubcarl.github.io/master/_posts/images/react/rn-bridge.png)

在 React Native App中，在应用启动时根据 ReactPackage 会自动生成 JavaScriptModuleRegistry和NativeModuleRegistry两份模块配置表，包含系统CoreModulesPackage, 基础模块MainReactPackage以及自定义模块。Java端与JavaScript端持有相同的模块配置表，标识为可识别为Native模块或JavaScript模块都是通过实现相应接口，并将实例添加ReactPackage的CreactModules方法即可。



## 一. Native启动React Application

![image](https://raw.githubusercontent.com/hubcarl/hubcarl.github.io/master/_posts/images/react/RN-Native-Start.png)

JavaScript模块extends JavascriptModule, JavaScript模块通过java动态代理实现调用Js模块。下例 AppRegistry.java 为在加载完 Jsbundle 后，Native 去启动 React Application 的总入口，appkey 为应用的 ID。映射每个 JavascriptModule 的信息保存在 JavaScriptModuleRegistration 中，统一由 JavaScriptModuleRegistry统一管理。

### 1. setupReactContext

ReactInstanceManagerImpl.java 中 ReactContextInitAsyncTask.setupReactContext() 方法中如下调用：

```java
((AppRegistry)catalystInstance.getJSModule(AppRegistry.class)).runApplication(appkey, appParams);
```

### 2. Java动态代理

JS模块通过java动态代理实现调用JS方法,java动态代理通过实现InvocationHandler接口，然后通过Proxy.newProxyInstance()实现. 方法有三个参数：

* 类加载器(Class Loader)

* 需要实现的接口数组

* 所有动态代理类的方法调用，都会交由InvocationHandler接口实现类里的invoke()方法去处理。这是动态代理的关键所在。

```java
(JavaScriptModule)Proxy.newProxyInstance(moduleInterface.getClassLoader(), new Class[]{moduleInterface},
new JavaScriptModuleRegistry.JavaScriptModuleInvocationHandler(executorToken, instance, registration));
```

### 3.JavaScript模块:继承JavascriptModule实现自定义JavaScript模块。

```java
public interface AppRegistry extends JavaScriptModule {
  void runApplication(String appKey, WritableMap appParameters);
  void unmountApplicationComponentAtRootTag(int rootNodeTag);   
}
```

### 4.实现 InvocationHandler接口，实现invoke方法，invoke 调用 callFunction实现js的调用。

```java
private static class JavaScriptModuleInvocationHandler implements InvocationHandler {
    @Nullable
    public Object invoke(Object proxy, Method method, @Nullable Object[] args) throws Throwable {
        ExecutorToken executorToken = (ExecutorToken)this.mExecutorToken.get();
        if(executorToken == null) {
            FLog.w("React", "Dropping JS call, ExecutorToken went away...");
            return null;
        } else {
            String tracingName = this.mModuleRegistration.getTracingName(method);
            WritableNativeArray jsArgs = args != null?Arguments.fromJavaArgs(args):new WritableNativeArray();
            this.mCatalystInstance.callFunction(executorToken, this.mModuleRegistration.getName(), method.getName(), jsArgs, tracingName);
            return null;
        }
    }
}
```

### 5.callFunction JNI调用流程详细流程:

#### 1.OnLoad.cpp:

```c++
static void callFunction(JNIEnv* env, jobject obj, JExecutorToken::jhybridobject jExecutorToken, jstring module, jstring method,
```

#### 2.Bridge.cpp

```c++
void Bridge::callFunction(ExecutorToken executorToken,const std::string& moduleId,const std::string& methodId,const folly::dynamic& arguments,const std::string& tracingName)
```

#### 3.JSCExecutor.cpp

```c++
    1. void JSCExecutor::callFunction(const std::string& moduleId, const std::string& methodId, const folly::dynamic& arguments)

    // 确保fbBatchedBridge 有定义

    2. bool JSCExecutor::ensureBatchedBridgeObject()

    // 执行fbBatchedBridge中js方法

    3. void JSCExecutor::callFunction(const std::string& moduleId, const std::string& methodId, const folly::dynamic& arguments) {

    4. 执行js  fbBatchedBridge.callFunctionReturnFlushedQueue 返回queue队列

    5. 执行Bridge.cpp : void Bridge::callNativeModules(JSExecutor& executor, const std::string& callJSON, bool isEndOfBatch)

    6. 执行 m_callback->onCallNativeModules(getTokenForExecutor(executor), callJSON, isEndOfBatch);

        m_callback 为OnLoad.cpp 中的 class PlatformBridgeCallback : public BridgeCallback

        相当于执行 PlatformBridgeCallback.onCallNativeModules

    7. 最后调用 makeJavaCall方法调用java方法

    8. OnLoad.cpp 中 makeJavaCall 定义,  c++通过CallVoidMethod调用java非静态方法：

    gCallbackMethod 定义：

    jclass callbackClass = env->FindClass("com/facebook/react/bridge/ReactCallback");
    bridge::gCallbackMethod = env->GetMethodID(callbackClass, "call", "(Lcom/facebook/react/bridge/ExecutorToken;IILcom/facebook/react/bridge/ReadableNativeArray;)V");


	static void makeJavaCall(JNIEnv* env, ExecutorToken executorToken, jobject callback, const MethodCall& call) {

	  auto newArray = ReadableNativeArray::newObjectCxxArgs(std::move(call.arguments));
	  env->CallVoidMethod(
	      callback,
	      gCallbackMethod,
	      static_cast<JExecutorTokenHolder*>(executorToken.getPlatformExecutorToken().get())->getJobj(),
	      call.moduleId,
	      call.methodId,
	      newArray.get());
	}


```


## 二. JavaScript启动流程


 ![image](https://raw.githubusercontent.com/hubcarl/hubcarl.github.io/master/_posts/images/react/RN-JS-Start.png)


### JavaScript初始化

在JSBundle.js文件底部有两个require调用：

require(191); // require('InitializeJavaScriptAppEngine')

	InitializeJavaScriptAppEngine 初始化，主要包括Map,Set,XHR, Timer, Log,Fetch,WebSocket PolyfillRCTDeviceEventEmitter,RCTNativeAppEventEmitter,PerformanceLogger初始化

require(0); // require('SmartRectNativeApp/debug.android.js')

	JS启动入口,其中会引用require('react') 和 require('react－native')

	ReactNative.AppRegistry.registerComponent('SmartDebugReactApp', function () {
		return SmartRectNativeApp;
	});


下面具体梳理一下require(0)后启动流程

#### 1. BatchedBridge, MessageQueue, NativeModules初始化

通过MessageQueue定义RemoteModules对象

```javascript
  function MessageQueue(configProvider) {
    lazyProperty(this, 'RemoteModules', function () {
      var _configProvider =configProvider();
      var remoteModuleConfig = _configProvider.remoteModuleConfig;
      var modulesConfig = this._genModulesConfig(remoteModuleConfig);
      // 初始化所有JS调用Native模块
      var modules = this._genModules(modulesConfig);
      return modules;
    });
  }
```

#### 2. Bridge全局配置表

__fbBatchedBridgeConfig 由Native层注入的全局对象，数据格式如下,包含remoteModuleConfig节点。节点信息包括：moduleName, methodId,  methodName,  args。

```javascript
  var BatchedBridge = new MessageQueue(function () {return global.__fbBatchedBridgeConfig;});
```

```javascript

  {
    "remoteModuleConfig": {
    "FrescoModule": {
      "moduleID": 0,
        "supportsWebWorkers": false,
        "methods": {}
    },
    "RNIntentModule": {
      "moduleID": 1,
        "supportsWebWorkers": false,
        "methods": {
        "openThirdReactActivity": {
          "methodID": 0,
            "type": "remote"
        },
        "openSecondReactActivity": {
          "methodID": 1,
            "type": "remote"
        },
        "getDataFromIntent": {
          "methodID": 2,
            "type": "remote"
        },
        "finishActivity": {
          "methodID": 3,
            "type": "remote"
        },
        "backActivity": {
          "methodID": 4,
            "type": "remote"
        },
        "openSecondActivity": {
          "methodID": 5,
            "type": "remote"
        }
      }
    }
  }
```

#### 3. NativeModules实现

```javascript
  define(60 /* NativeModules */, function (global, require, module, exports) {

    'use strict';

    var BatchedBridge = require(61 /* BatchedBridge */);
    var RemoteModules = BatchedBridge.RemoteModules;

    function normalizePrefix(moduleName) {
      return moduleName.replace(/^(RCT|RK)/, '');
    }

    Object.keys(RemoteModules).forEach(function (moduleName) {
      var strippedName = normalizePrefix(moduleName);
      if (RemoteModules['RCT' + strippedName] && RemoteModules['RK' + strippedName]) {
        throw new Error(
          'Module cannot be registered as both RCT and RK: ' + moduleName);

      }
      if (strippedName !== moduleName) {
        RemoteModules[strippedName] = RemoteModules[moduleName];
        delete RemoteModules[moduleName];
      }
    });


    var NativeModules = {};
    Object.keys(RemoteModules).forEach(function (moduleName) {
      Object.defineProperty(NativeModules, moduleName, {
        configurable: true,
        enumerable: true,
        get: function get() {
          var module = RemoteModules[moduleName];
          if (module && typeof module.moduleID === 'number' && global.nativeRequireModuleConfig) {
            var json = global.nativeRequireModuleConfig(moduleName);
            var config = json && JSON.parse(json);
            module = config && BatchedBridge.processModuleConfig(config, module.moduleID);
            RemoteModules[moduleName] = module;
          }
          Object.defineProperty(NativeModules, moduleName, {
            configurable: true,
            enumerable: true,
            value: module
          });

          return module;
        }
      });

    });

    module.exports = NativeModules;
  }, "NativeModules");
```

#### 4. _genModules 调用 _genModule

	function _genModules(remoteModules) {
	  var _this5 = this;
	  var modules = {};

	  remoteModules.forEach(function (config, moduleID) {
	    var info = _this5._genModule(config, moduleID);
	    if (info) {
	      modules[info.name] = info.module;
	    }
	  });

	  return modules;
	}  

#### 5. _genModule 调用 _genMethod

	function _genModule(config, moduleID) {
	    module[methodName] = _this6._genMethod(moduleID, methodID, methodType);
	    return { name: moduleName, module: module };
	}

#### 6. _genMethod 调用  __nativeCall  返回 Promise或function

	function _genMethod 调用 (module, method, type) {

	  var fn = null;
	  var self = this;
	  if (type === MethodTypes.remoteAsync) {
	    fn = function fn() {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }
	      return new Promise(function (resolve, reject) {
	        self.__nativeCall(
	          module,
	          method,
	          args,
	          function (data) {
	            resolve(data);
	          },
	          function (errorData) {
	            var error = createErrorFromErrorData(errorData);
	            reject(error);
	          });
	      });
	    };
	  } else if (type === MethodTypes.syncHook) {
	    return function () {
	      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        args[_key2] = arguments[_key2];
	      }
	      return global.nativeCallSyncHook(module, method, args);
	    };
	  } else {
	    fn = function fn() {
	      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	        args[_key3] = arguments[_key3];
	      }
	      var lastArg = args.length > 0 ? args[args.length - 1] : null;
	      var secondLastArg = args.length > 1 ? args[args.length - 2] : null;
	      var hasSuccCB = typeof lastArg === 'function';
	      var hasErrorCB = typeof secondLastArg === 'function';
	      hasErrorCB && invariant(
	        hasSuccCB,
	        'Cannot have a non-function arg after a function arg.');

	      var numCBs = hasSuccCB + hasErrorCB;
	      var onSucc = hasSuccCB ? lastArg : null;
	      var onFail = hasErrorCB ? secondLastArg : null;
	      args = args.slice(0, args.length - numCBs);
	      return self.__nativeCall(module, method, args, onFail, onSucc);
	    };
	  }
	  fn.type = type;
	  return fn;
	}

#### 7. __nativeCall实现

	function __nativeCall(module, method, params, onFail, onSucc) {

	  this._queue[MODULE_IDS].push(module);
	  this._queue[METHOD_IDS].push(method);
	  this._queue[PARAMS].push(params);

	  var now = new Date().getTime();
	  if (global.nativeFlushQueueImmediate &&
	  now - this._lastFlush >= MIN_TIME_BETWEEN_FLUSHES_MS) {
	      global.nativeFlushQueueImmediate(this._queue);
	      this._queue = [[], [], [], this._callID];
	      this._lastFlush = now;
	  }
	}

#### 8. JSCExecutor.cpp 通过installGlobalFunction 定义 nativeFlushQueueImmediate方法

	m_context = JSGlobalContextCreateInGroup(nullptr, nullptr);
	s_globalContextRefToJSCExecutor[m_context] = this;
	installGlobalFunction(m_context, "nativeFlushQueueImmediate", nativeFlushQueueImmediate);
	installGlobalFunction(m_context, "nativePerformanceNow", nativePerformanceNow);
	installGlobalFunction(m_context, "nativeStartWorker", nativeStartWorker);
	installGlobalFunction(m_context, "nativePostMessageToWorker", nativePostMessageToWorker);
	installGlobalFunction(m_context, "nativeTerminateWorker", nativeTerminateWorker);
	installGlobalFunction(m_context, "nativeInjectHMRUpdate", nativeInjectHMRUpdate);

#### 9. nativeFlushQueueImmediate 获取 JS队列数据执行Native调用：

	JSValueRef JSCExecutor::nativeFlushQueueImmediate(
	    JSContextRef ctx,
	    JSObjectRef function,
	    JSObjectRef thisObject,
	    size_t argumentCount,
	    const JSValueRef arguments[],
	    JSValueRef *exception) {

	std::string resStr = Value(ctx, arguments[0]).toJSONString();

	executor->flushQueueImmediate(resStr);

	return JSValueMakeUndefined(ctx);


#### 10. flushQueueImmediate获取JS队列执行队列数据调用Native接口：

	void JSCExecutor::flushQueueImmediate(std::string queueJSON) {
	  m_bridge->callNativeModules(*this, queueJSON, false);
	}


#### 11. callNativeModules 调用Native java方法


	class BridgeCallback {
	public:
	  virtual ~BridgeCallback() {};

	  virtual void onCallNativeModules(
	      ExecutorToken executorToken,
	      const std::string& callJSON,
	      bool isEndOfBatch) = 0;

	  virtual void onExecutorUnregistered(ExecutorToken executorToken) = 0;
	};

	void Bridge::callNativeModules(JSExecutor& executor, const std::string& callJSON, bool isEndOfBatch) {
	  m_callback->onCallNativeModules(getTokenForExecutor(executor), callJSON, isEndOfBatch);
	}

	BridgeCallback::m_callback 为OnLoad.cpp 中的 class PlatformBridgeCallback : public BridgeCallback

	virtual void onCallNativeModules(
	    ExecutorToken executorToken,
	    const std::string& callJSON,
	    bool isEndOfBatch) override {
	  executeCallbackOnCallbackQueueThread([executorToken, callJSON, isEndOfBatch] (ResolvedWeakReference& callback) {
	    JNIEnv* env = Environment::current();
	    for (auto& call : react::parseMethodCalls(callJSON)) {
	      makeJavaCall(env, executorToken, callback, call);
	      if (env->ExceptionCheck()) {
	        return;
	      }
	    }
	    if (isEndOfBatch) {
	      signalBatchComplete(env, callback);
	    }
	  });
	}

相当于执行 PlatformBridgeCallback.onCallNativeModules，最后调用 makeJavaCall方法调用java方法

OnLoad.cpp 中 makeJavaCall 定义,  c++通过CallVoidMethod调用java非静态方法：

```c++
static void makeJavaCall(JNIEnv* env, ExecutorToken executorToken, jobject callback, const MethodCall& call) {

  auto newArray = ReadableNativeArray::newObjectCxxArgs(std::move(call.arguments));
  env->CallVoidMethod(
      callback,
      gCallbackMethod,
      static_cast<JExecutorTokenHolder*>(executorToken.getPlatformExecutorToken().get())->getJobj(),
      call.moduleId,
      call.methodId,
      newArray.get());
}
```


## 三. JavaScript调用Native回调和返回值

从编写自定义插件中，我们知道了JS如何调用Native方法，但 @ReactMethod 注解的方法的返回值只能是void，现在JS端想从Native获取一些配置信息或者知道调用端是否成功的一些返回值信息，该如何实现呢？

JavaScript调用Native获取Native返回值是通过异步Callback实现的. 在JS调用Native时，会判断方法的最后两个参数，如果是function，就会把函数放到callback数值中, key为自增的callbackId，同时把callbackId传递给Native。Native执行完以后，通过调用JS方法 __invokeCallback 进行回调。在react-native中定是通过Callback和Promise的接口，用来处理JavaScript调用Java方法的回调，Callback会作为ReactMethod注解方法的一个参数，Native调用JS就是通过这个Callback实现的，具体实现会在下面讲到。

首先，我们看一下Callback和Promise具体实现，然后根据代码来剖析实现原理。

### Callback实现



#### 1. java端实现一个需要获取执行结果的setCache和一个获取缓存接口getCache

```java
@ReactMethod
public void setCache(String key, String value, Callback successCallback, Callback errorCallback) {
  try {
      sharedPreference = getCurrentActivity().getSharedPreferences("rn_cache", 0);
      sharedPreference.edit().putString(key, value).commit();
      successCallback.invoke("save success");
  } catch (Exception e) {
      e.printStackTrace();
      errorCallback.invoke(e.getMessage());
  }
}

@ReactMethod
public void getCache(String key, Callback callback) {
  callback.invoke(sharedPreference.getString(key, ""));
}
```

#### 2. JS定义两个方法，一个设置缓存，一个获取缓存。在JavaScript中，调用这个带有Callback参数的方法如下：

```javascript
_setCacheClick(){
  NativeModules.IntentPackage.setCache('ReactNative','我是来自React Native缓存消息',(msg)=>{
      NativeModules.ToastAndroid.show(msg, 3000);
    },(error)=>{
      NativeModules.ToastAndroid.show(error, 3000);
  });
}

_getCacheClick(){
     NativeModules.IntentPackage.getCache('ReactNative',(value)=>{
          NativeModules.ToastAndroid.show(value, 3000)
     });
}
```


### Promise实现


#### 1. 同样java端实现一个需要获取执行结果的setCache和一个获取缓存接口getCache，Callback参数改为Promise

```java
@ReactMethod
public void setCachePromise(String key, String value, Promise promise) {
  try {
      sharedPreference = getCurrentActivity().getSharedPreferences("rn_cache", 0);
      sharedPreference.edit().putString(key, value).commit();
      promise.resolve("save success");
  } catch (Exception e) {
      e.printStackTrace();
      promise.resolve(e.getMessage());
  }
}

@ReactMethod
public void getCachePromise(String key, Promise promise) {
  promise.resolve(sharedPreference.getString(key, ""));
}
```

#### 2. 同样JS定义两个方法，一个设置缓存，一个获取缓存。在JavaScript中，调用这个带有Callback参数的方法如下：

```javascript
_setCachePromiseClick(){
    NativeModules.IntentPackage.setCache('ReactNative','我是来自React Native缓存消息').then(msg=>{
        NativeModules.ToastAndroid.show(msg, 3000);
    },error=>{
      NativeModules.ToastAndroid.show(error, 3000);
    }).
}

_getCachePromiseClick(){
   	NativeModules.IntentPackage.getCache('ReactNative').then(function(value){
       NativeModules.ToastAndroid.show(value, 3000)
   });
}
```



### JavaScript调用Native Callback实现原理



#### 1.NativeModulesReactCallback 初始化

```java
private ReactBridge initializeBridge(JavaScriptExecutor jsExecutor) {
  bridge = new ReactBridge(
          jsExecutor,
          new NativeModulesReactCallback(),
          mReactQueueConfiguration.getNativeModulesQueueThread());
  return bridge;        
}

public ReactBridge(
      JavaScriptExecutor jsExecutor,
      ReactCallback callback,
      MessageQueueThread nativeModulesQueueThread) {
    mJSExecutor = jsExecutor;
    mCallback = callback;
    mNativeModulesQueueThread = nativeModulesQueueThread;
    initialize(jsExecutor, callback, mNativeModulesQueueThread);
}
```

#### 2.ReactCallback源码实现：

```java
@DoNotStrip
public interface ReactCallback {
  @DoNotStrip
  void call(ExecutorToken executorToken, int moduleId, int methodId, ReadableNativeArray parameters);
}

private class NativeModulesReactCallback implements ReactCallback {
     @Override
     public void call(ExecutorToken executorToken, int moduleId, int methodId, ReadableNativeArray parameters) {
       synchronized (mJSToJavaCallsTeardownLock) {
         // NativeModuleRegistry调用call
         nativeModuleRegistry.call(CatalystInstanceImpl.this, executorToken, moduleId, methodId, parameters);
       }
     }
}
```

#### 3.NativeModuleRegistry源码实现：

```java
public class NativeModuleRegistry {

  private static class MethodRegistration {
      public MethodRegistration(String name, String tracingName, NativeModule.NativeMethod method) {
        this.name = name;
        this.tracingName = tracingName;
        this.method = method;
      }

      public String name;
      public String tracingName;
      // Native 模块必须实现的接口NativeModule
      public NativeModule.NativeMethod method;
    }
  }

  private static class ModuleDefinition {

    public final int id;
        public final String name;
        public final NativeModule target;
        public final ArrayList<MethodRegistration> methods;

    public ModuleDefinition(int id, String name, NativeModule target) {
        this.id = id;
        this.name = name;
        this.target = target;
        this.methods = new ArrayList<MethodRegistration>();
        // target.getMethods() 收集 @ReactMehtod 注解的方法
        for (Map.Entry<String, NativeModule.NativeMethod> entry : target.getMethods().entrySet()) {
          this.methods.add(
            new MethodRegistration(
              entry.getKey(), "NativeCall__" + target.getName() + "_" + entry.getKey(),
              entry.getValue()));
        }
    }

    public void call(
            CatalystInstance catalystInstance,
            ExecutorToken executorToken,
            int methodId,
            ReadableNativeArray parameters) {
            // this.methods.get(methodId).method == NativeModule.NativeMethod
            this.methods.get(methodId).method.invoke(catalystInstance, executorToken, parameters);
        }
  }
}
```

#### 4.我们再来看一下Native自定义模块IntentModule实现

```java
public abstract class BaseJavaModule implements NativeModule {

  static final private ArgumentExtractor<Callback> ARGUMENT_EXTRACTOR_CALLBACK =
      new ArgumentExtractor<Callback>() {
        @Override
        public @Nullable Callback extractArgument(
            CatalystInstance catalystInstance, ExecutorToken executorToken, ReadableNativeArray jsArguments, int atIndex) {
          if (jsArguments.isNull(atIndex)) {
            return null;
          } else {
            int id = (int) jsArguments.getDouble(atIndex);
            //CallbackImpl 实现 Callback接口
            return new CallbackImpl(catalystInstance, executorToken, id);
          }
        }
      };

  static final private ArgumentExtractor<Promise> ARGUMENT_EXTRACTOR_PROMISE =
      new ArgumentExtractor<Promise>() {
        @Override
        public int getJSArgumentsNeeded() {
          return 2;
        }

        @Override
        public Promise extractArgument(
            CatalystInstance catalystInstance, ExecutorToken executorToken, ReadableNativeArray jsArguments, int atIndex) {
          Callback resolve = ARGUMENT_EXTRACTOR_CALLBACK
              .extractArgument(catalystInstance, executorToken, jsArguments, atIndex);
          Callback reject = ARGUMENT_EXTRACTOR_CALLBACK
              .extractArgument(catalystInstance, executorToken, jsArguments, atIndex + 1);
          return new PromiseImpl(resolve, reject);
        }
      };

  private @Nullable Map<String, NativeMethod> mMethods;
  private @Nullable Map<String, SyncNativeHook> mHooks;

  // getMethods实现
  @Override
  public final Map<String, NativeMethod> getMethods() {
    Method[] targetMethods = getClass().getDeclaredMethods();
     for (Method targetMethod : targetMethods) {
       if (targetMethod.getAnnotation(ReactMethod.class) != null) {
         String methodName = targetMethod.getName();
         mMethods.put(methodName, new JavaMethod(targetMethod));
       }
       if (targetMethod.getAnnotation(ReactSyncHook.class) != null) {
         String methodName = targetMethod.getName();
         mHooks.put(methodName, new SyncJavaHook(targetMethod));
       }
     }
    return assertNotNull(mMethods);
  }

  public class JavaMethod implements NativeMethod {
    private Method mMethod;

    public JavaMethod(Method method) {
      mMethod = method;
    }

    @Override
    public void invoke(CatalystInstance catalystInstance, ExecutorToken executorToken, ReadableNativeArray parameters) {
      mMethod.invoke(BaseJavaModule.this, mArguments);
    }  
  }

}

public abstract class ReactContextBaseJavaModule extends BaseJavaModule {

}

public class IntentModule extends ReactContextBaseJavaModule {

}
```


#### 5.Callback 实现

```java
private native void initialize(
      JavaScriptExecutor jsExecutor,
      ReactCallback callback,
      MessageQueueThread nativeModulesQueueThread);


public final class CallbackImpl implements Callback {

  private final CatalystInstance mCatalystInstance;
  private final ExecutorToken mExecutorToken;
  private final int mCallbackId;

  public CallbackImpl(CatalystInstancebridge = new ReactBridge(
          jsExecutor,
          new NativeModulesReactCallback(),
          mReactQueueConfiguration.getNativeModulesQueueThread()); bridge, ExecutorToken executorToken, int callbackId) {
    mCatalystInstance = bridge;
    mExecutorToken = executorToken;
    mCallbackId = callbackId;
  }

  @Override
  public void invoke(Object... args) {
    mCatalystInstance.invokeCallback(mExecutorToken, mCallbackId, Arguments.fromJavaArgs(args));
  }
}
```

#### 6.CatalystInstanceImpl类中invokeCallback调用

```java
@Override
public void invokeCallback(ExecutorToken executorToken, int callbackID, NativeArray arguments) {
if (mIsBeingDestroyed) {
  FLog.w(ReactConstants.TAG, "Invoking JS callback after bridge has been destroyed.");
  return;
}
synchronized (mJavaToJSCallsTeardownLock) {
  if (mDestroyed) {
    FLog.w(ReactConstants.TAG, "Invoking JS callback after bridge has been destroyed.");
    return;
  }

  incrementPendingJSCalls();

  Assertions.assertNotNull(mBridge).invokeCallback(executorToken, callbackID, arguments);
}
}
```

#### 7.ReactBridge.java中invokeCallback调用

```java
public native void invokeCallback(ExecutorToken executorToken, int callbackID, NativeArray arguments);
```


#### 8.OnLoad.cpp


```c++
static void invokeCallback(JNIEnv* env, jobject obj, JExecutorToken::jhybridobject jExecutorToken, jint callbackId,
                           NativeArray::jhybridobject args) {
  auto bridge = extractRefPtr<CountableBridge>(env, obj);
  auto arguments = cthis(wrap_alias(args));
  try {
    bridge->invokeCallback(
      cthis(wrap_alias(jExecutorToken))->getExecutorToken(wrap_alias(jExecutorToken)),
      (double) callbackId,
      std::move(arguments->array)
    );
  } catch (...) {
    translatePendingCppExceptionToJavaException();
  }
}
```


#### 9.Bridge.cpp实现


```c++
void Bridge::invokeCallback(ExecutorToken executorToken, const double callbackId, const folly::dynamic& arguments) {
  #ifdef WITH_FBSYSTRACE
  int systraceCookie = m_systraceCookie++;
  FbSystraceAsyncFlow::begin(
      TRACE_TAG_REACT_CXX_BRIDGE,
      "<callback>",
      systraceCookie);
  #endif

  #ifdef WITH_FBSYSTRACE
  runOnExecutorQueue(executorToken, [callbackId, arguments, systraceCookie] (JSExecutor* executor) {
    FbSystraceAsyncFlow::end(
        TRACE_TAG_REACT_CXX_BRIDGE,
        "<callback>",
        systraceCookie);
    FbSystraceSection s(TRACE_TAG_REACT_CXX_BRIDGE, "Bridge.invokeCallback");
  #else
  runOnExecutorQueue(executorToken, [callbackId, arguments] (JSExecutor* executor) {
  #endif
    executor->invokeCallback(callbackId, arguments);
  });
}
```

#### 10.JSCExecutor.cpp 中invokeCallback实现

```c++
void JSCExecutor::invokeCallback(const double callbackId, const folly::dynamic& arguments) {
  String argsString = String(folly::toJson(std::move(arguments)).c_str());
  JSValueRef args[] = {
      JSValueMakeNumber(m_context, callbackId),
      Value::fromJSON(m_context, argsString)
  };

  // m_invokeCallbackObj = folly::make_unique<Object>(m_batchedBridge->getProperty("invokeCallbackAndReturnFlushedQueue").asObject());
  // 执行回调,返回待执行的队列
  auto result = m_invokeCallbackObj->callAsFunction(2, args);
  // 调用java方法
  m_bridge->callNativeModules(*this, result.toJSONString(), true);
}
```

#### 11.JS端invokeCallbackAndReturnFlushedQueue实现

```c++
function invokeCallbackAndReturnFlushedQueue(cbID, args) {
  var _this3 = this;
  guard(function () {
    // 执行回调
    _this3.__invokeCallback(cbID, args);
    _this3.__callImmediates();
  });
  //  返回JS调用Native的队列
  return this.flushedQueue();
}
```


### 四. 编写自定义插件

编写自定义插件需要继承ReactContextBaseJavaModule和实现ReactPackage接口，

具体实现步骤如下：


#### 1. 继承ReactContextBaseJavaModule接口


```java
public class IntentModule extends ReactContextBaseJavaModule
```


#### 2. 重写 getName方法,暴露给JS端调用名


```java
@Override
public String getName() {
    return "IntentModule";
}
```


#### 3. 给暴露给JS的方法添加 @ReactMethod 注解，且方法的返回值只能是void


```java
@ReactMethod
public void backActivity(int count) {
    if (count > 0) {
        try {
            Activity currentActivity = getCurrentActivity();
            currentActivity.finish();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```


#### 4.实现ReactPackage接口


```java
public class IntentPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Arrays.<NativeModule>asList(
                new IntentModule(reactContext)
        );
    }
    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
```


#### 5.在Application中注册IntentPackage


```java
@Override
protected List<ReactPackage> getPackages() {
  return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new IntentPackage()
  );
}
```

#### 6.JavaScript调用IntentModule的backActivity方法

```java
NativeModules.IntentModule.backActivity();
```
