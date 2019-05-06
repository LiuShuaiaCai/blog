---
title: 模型常用属性
date: 2019-02-13 09:51:00
tags: ['Laravel']
---

## 前言
这几天又把文档缕了一遍，发现模型的很多属性都很方便，但是不经常使用，看了有忘，忘了又看，所以干脆敲一遍，加深一下印象。

## 定义模型
使用 Artisan 命令创建模型：
```
php artisan make:model Models/AuthUser
```
在 `App/Models` 下新建 `AuthUser.php` 文件
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuthUser extends Model
{

}
```

## 模型所有属性
下面列表是模型的所有属性，大部分是我们不需要修改的
```php
AuthUser {#212 ▼
  #table: "auth_user"
  +timestamps: true
  #guarded: array:1 [▶]
  #connection: null
  #primaryKey: "id"
  #keyType: "int"
  +incrementing: true
  #with: []
  #withCount: []
  #perPage: 15
  +exists: false
  +wasRecentlyCreated: false
  #attributes: []
  #original: []
  #changes: []
  #casts: []
  #dates: []
  #dateFormat: null
  #appends: []
  #dispatchesEvents: []
  #observables: []
  #relations: []
  #touches: []
  #hidden: []
  #visible: []
  #fillable: []
}
```

## 数据库链接（connection）
我们在 `config/database.php` 文件中的 `connections` 数组中定义数据库的链接方式，默认使用 `default` 所对应的链接。
```php
/**
* 模型的连接名称.
*
* @var string
*/
protected $connection;
```

## 数据表名称（table）
模型默认对应的数据表是模型的文件名称所对应的复数形式，例如：模型 `AuthUser` 对应数据表 `auth_users`。但是往往我们定义的模型名称和数据表对应不上，所以我们也可以使用 `$table` 属性自定义数据表名称。
```php
/**
* 与模型关联的数据表
*
* @var string
*/
protected $table = 'auth_user';
```

## 时间戳维护（timestamps）
```php
/**
* 执行模型是否自动维护时间戳
*
* @var bool
*/
public $timestamps = true;
```

## 批量赋值（fillable | guarded）
```php
/**
* 可批量赋值的属性
* @var array
*/
protected $fillable = ['site','pid','name','real_name','quickmark','status','tel','email'];

/**
* 不可批量赋值的属性，除了这些属性其他属性都可以被赋值，与fillable只能二选一，如果同时使用，该属性不起作用
* 将 $guarded 定义为空数组，则所有属性都可以被批量赋值
*
* @var array
*/
protected $guarded = ['id'];
```

## 属性隐藏与显示（hidden | visible）
```php
/**
* 隐藏的属性，我们调用模型的 toArray 方法的时候不会得到该数组中的属性，
* 如果需要也得到隐藏属性，可以通过 withHidden 方法
*
* @var array
*/
protected $hidden = ['id'];

/**
* 只显示数组中的属性，并且排除隐藏数组中的属性
* 
* @var array
*/
protected $visible = ['id','name'];
```

## 自动格式转换（casts）
```php
/**
* 自动格式转换，定义方式： protected $casts = ['info' => 'json'];
* 所有可用格式： int、integer、real、float、double、string、bool、boolean、
*              object、array、json、collection、date、datetime
* 应用场景：
*      我们想要保存某些特殊格式到数据库(如json、object)，我们可以使用该数组对我们的数据进行自动转换,
* usage:
*      $user = User::create([
*          'name' => 'ruby',
*          'info' => ['city' => 'Guangzhou']
*      ]);
*
*      $query_user = User::find($user['id']);
*      dd($query_user->info);
* 这里我们可以看数据库保存的 info 字段，实际上是 json 编码的，并且取出来的是 json 解码后的数据
*/
protected $casts = [];
```

## 日期转换（dates | dateFormat）
```php
/**
* 需要转成日期的属性
*
* @var array
*/
protected $dates = ['deleted_at'];

/**
* 模型中日期字段的存储格式
* http://php.net/manual/zh/function.date.php
*
* @var string
*/
protected $dateFormat = 'U';
```

## 添加新属性（appends）
```php
/**
* 添加属性，模型 toArray 的时候显示
*
* @var array
*/
protected $appends = ['new_name'];

/**
* 定义新属性 new_name 的值
* 
* @return string
*/
public function getNewNameAttribute()
{
    return $this->name . ' - ' . $this->id;
}
```
查询结果中会有 new_name 字段



> 上面这几个是我平时常用到的，下面几个基本上没用到

## 模型主键（primaryKey）
模型主键默认为 id ，如果不是id，可以修改 $primaryKey 变量
```php
/**
* 模型主键.
*
* @var string
*/
protected $primaryKey = 'id';
```

## 自增ID的类型（keyType）
```php
/**
* 自增ID的类型
*
* @var string
*/
protected $keyType = 'int';
```

## 主键自增长（incrementing）
```php
/**
* 主键是否默认自增长
*
* @var bool
*/
public $incrementing = true;
```
没有使用过这样的场景。

## 需要预加载的关联（with）
```php
/**
* 查询的渴求式加载
*
* @var array
*/
protected $with = [];
```
比如，我在 AuthUser 模型中添加一个 authRole 的关联关系，看一下代码：
```php
protected $with=['authRole'];

// 与角色中间表关联
public function authRole()
{
    return $this->hasMany('App\Models\AuthUserRole','user_pid','pid');
}
```
然后我在控制器中查询用户数据，会自动查询用户所属的角色，在查询的结果中并添加 auth_role 字段：
```php
$data = (new AuthUser())->find(301);
dd($data->toArray());
```
查询结果如下：
```php
array:19 [▼
  "id" => 301
  "site" => 4
  "pid" => 3001399
  "name" => "ul01"
  "real_name" => "测试账号一下"
  "quickmark" => "http://img.kmf.com/da/2017/d4b/d4bfa4b646279c7c219e25dfe8bb0042.png"
  "status" => 0
  "tel" => ""
  "email" => "wangya71@100tal.com"
  "wx_id" => ""
  "wechat" => "hmily_vvv"
  "cc_order" => 0
  "real_site" => 0
  "meiqia_token" => ""
  "ding_id" => ""
  "created_at" => "2019-02-01 14:38:41"
  "updated_at" => "2019-02-01 14:43:47"
  "deleted_at" => null
  "auth_role" => array:2 [▼
    0 => array:6 [▼
      "id" => 86
      "user_pid" => 3001399
      "role_id" => 22
      "create_time" => 1548302359
      "modify_time" => 0
      "status" => 0
    ]
    1 => array:6 [▼
      "id" => 87
      "user_pid" => 3001399
      "role_id" => 23
      "create_time" => 1548302359
      "modify_time" => 0
      "status" => 1
    ]
  ]
]
```
不使用该属性，也可以在控制器中使用 with 方法，是一样的
```php
$data = (new AuthUser())->with('authRole')->find(301);
```

## 模型关联数量（withCount）
```php
/**
* with 关联的数量，使用方法和 with 一样
*
* @var array
*/
protected $withCount = [];
```
使用起来和 with 一样，也看一下代码吧，毕竟大家都不喜欢听 “和...一样” 这样的话。
```php
 protected $withCount = ['authRole'];
 ```
 输出结果，多了一个 auth_role_count 字段：
 ```php
 array:20 [▼
  "id" => 301
  "site" => 4
  "pid" => 3001399
  "name" => "ul01"
  "real_name" => "测试账号一下"
  "quickmark" => "http://img.kmf.com/da/2017/d4b/d4bfa4b646279c7c219e25dfe8bb0042.png"
  "status" => 0
  "tel" => ""
  "email" => "wangya71@100tal.com"
  "wx_id" => ""
  "wechat" => "hmily_vvv"
  "cc_order" => 0
  "real_site" => 0
  "meiqia_token" => ""
  "ding_id" => ""
  "created_at" => "2019-02-01 14:38:41"
  "updated_at" => "2019-02-01 14:43:47"
  "deleted_at" => null
  "auth_role_count" => 2
  "auth_role" => array:2 [▶]
]
```
也可以在控制器使用 withCount 方法：
```php
$data = (new AuthUser())->withCount('authRole')->find(301);
```

## 模型分页（perPage）
```php
/**
* 模型数据的分页数量
*
* @var int
*/
protected $perPage = 15;

在使用 simplePaginate 和 paginate 方法对模型分页的时候，显示数据的数量
```php
$data = (new AuthUser())->paginate();
```
输出结果：
```php
array:12 [▼
  "current_page" => 1
  "data" => array:15 [▼
    0 => array:20 [▶]
    1 => array:20 [▶]
    2 => array:20 [▶]
    3 => array:20 [▶]
    4 => array:20 [▶]
    5 => array:20 [▶]
    6 => array:20 [▶]
    7 => array:20 [▶]
    8 => array:20 [▶]
    9 => array:20 [▶]
    10 => array:20 [▶]
    11 => array:20 [▶]
    12 => array:20 [▶]
    13 => array:20 [▶]
    14 => array:20 [▶]
  ]
  "first_page_url" => "http://localhost?page=1"
  "from" => 1
  "last_page" => 20
  "last_page_url" => "http://localhost?page=20"
  "next_page_url" => "http://localhost?page=2"
  "path" => "http://localhost"
  "per_page" => 15
  "prev_page_url" => null
  "to" => 15
  "total" => 286
]
```
在上面的输出结果中也有一个 per_page 字段，就是这个属性设置的。

## 时间戳
```php
/**
* 创建时间戳字段名称
*/
const CREATED_AT = 'created_at';

/**
* 更新时间戳字段名称
*/
const UPDATED_AT = 'updated_at';
```
如果设计的不是这两个字段可以更改

## 模型属性（attributes | original）
```php
/**
* 我们在给模型对象设置非 public 属性的时候，会通过 setAttributes 方法，保存到该数组中
* usage：
*      $user = new User();
*      $user->name = 'laravel';
*      User 中没有定义 public $name 的时候， $attributes 就会多了 'name' => 'laravel' 的键值对
*/
protected $attributes = [];

/**
* 保存模型的原始数据，后续修改模型属性只会修改 $attributes，以便侦测变化
*/
protected $original = [];
```

## 其他
下面是没用过，也不太理解是什么意思，摘自 [laravel 5.1 Model 属性详解](https://www.cnblogs.com/eleven24/p/8148945.html) 先记录一下，以备不时之需。
```php
/**
* 需要同步更新 updated_at 的关联，调用 save 方法的时候会更新该数组里面定义的关联的 updated_at 字段
*/
protected $touches = [];

/**
* todo 自定义事件，目前还没用过  -_-
*/
protected $observables = [];

/**
* 模型是否存在
*/
public $exists = false;

/**
* 判断模型是否是当前请求插入的
*/
public $wasRecentlyCreated = false;

/**
* 模型属性名是否是下划线形式的
*/
public static $snakeAttributes = true;

/**
* 用来建立数据库连接
*
* @var \Illuminate\Database\ConnectionResolverInterface
*/
protected static $resolver;

/**
* 用来分发模型事件
*
* @var \Illuminate\Contracts\Events\Dispatcher
*/
protected static $dispatcher;

/**
* 模型 new 的时候调用模型的 bootXXX 方法， XXX 是模型名称
*/
protected static $booted = [];

/**
* 全局查询条件，需要定义
*
* @see \Illuminate\Database\Eloquent\ScopeInterface
*/
protected static $globalScopes = [];

/**
* 批量设置属性的时候是否不需要筛选字段
*/
protected static $unguarded = false;

/**
* 缓存 getXXAttribute 的值
*/
protected static $mutatorCache = [];

/**
* 多对多关联方法，不知道哪里用了
*/
public static $manyMethods = ['belongsToMany', 'morphToMany', 'morphedByMany'];
```

## 控制器中设置属性
以上属性大部分都可以在控制器中通过 setXX 来设置，但是设置之后，通过链式（->）可以起到作用，但是能通过静态方法（::）进行查询，是不起作用的。查了一下，通过静态方法查询是通过 [后期静态绑定](/2019/02/13/php-callstatic/) 的方式查询的。
```php
$authUser = new AuthUser();
$authUser->setConnection('pgsql');
$authUser->find(301);   // 正确
$authUser::find(301);   // 错误
```