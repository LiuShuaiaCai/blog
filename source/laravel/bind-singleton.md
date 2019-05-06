---
title: Laravel 系列笔记
date: 2019-01-23 23:35:36
tags: ['Laravel']
---

## bind 与 singleton 的区别

    相同：都返回一个类的实例  
    区别：singleton 是单例模式，而 bind 每次都返回一个新的实例

## 看一个栗子：
#### 创建UserController控制器
1、我是创建了一个 UserController 控制器，什么也没写，接下来会在 AppServiceProvider 绑定到这个控制器上
```php
<?php

namespace App\Http\Controllers\Web;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
    //
}
```

2、我在 AppServiceProvider 中的 register 方法中注册，当然也可以新创建一个服务提供者，代码如下

#### bind 简单绑定测试
```php
public function register()
{
    // bind 简单绑定
    $this->app->bind('user',UserController::class);
    // 解析 bind-1
    $bind_app1 = $this->app->make('user');
    $bind_app1->name = 'bind_app_1';
    // 解析 bind-2
    $bind_app2 = $this->app->make('user');
    $bind_app2->name = 'bind_app_2';
    // 打印 bind 绑定
    echo "bind_app1 = ".$bind_app1->name;
    echo "<br>";
    echo "bind_app2 = ".$bind_app2->name;
}

// 结果如下：
bind_app1 = bind_app_1
bind_app2 = bind_app_2
```

#### singleton 单例绑定测试
```php
public function register()
{
    // singleton 单例绑定
    $this->app->singleton('user',UserController::class);
    // 解析 singleton-1
    $singleton_app1 = $this->app->make('user');
    $singleton_app1->name = 'singleton_app_1';
    // 解析 singleton-2
    $singleton_app2 = $this->app->make('user');
    $singleton_app2->name = 'singleton_app_2';
    // 打印 singleton 绑定
    echo "singleton_app1 = ".$singleton_app1->name;
    echo "<br>";
    echo "singleton_app2 = ".$singleton_app2->name;
}

// 结果如下：
singleton_app1 = singleton_app_2
singleton_app2 = singleton_app_2
```
这样就能很容易看出差别了。。。