---
title: Artisan命令大全
date: 2019-10-10 14:32:36
tags: ['Laravel']
---

## 1、Available commands
命令 | 中文 | English
---|---|---
clear-compiled | 删除已编译的类文件 | Remove the compiled class file
down | 将应用程序置于维护模式 | Put the application into maintenance mode
dump-server | 启动转储服务器以收集转储信息 | Start the dump server to collect dump information
env | 显示当前的框架环境 | Display the current framework environment
help | 显示命令的帮助 | Displays help for a command
inspire | -- | Display an inspiring quote
list | 列出命令 | Lists commands
migrate | 运行数据库迁移 | Run the database migrations
optimize | 缓存框架引导程序文件 | Cache the framework bootstrap files
preset | 为应用程序交换前端脚手架 | Swap the front-end scaffolding for the application
serve | 在 PHP 开发服务器上提供应用程序 | Serve the application on the PHP development server
tinker | 应用程序互动 | Interact with your application
up | 使应用程序退出维护模式 | Bring the application out of maintenance mode

## 2、app
命令 | 中文 | English
---|---|---
app:name | 设置应用程序命名空间 | Set the application namespace

## 3、auth
命令 | 中文 | English
---|---|---
auth:clear-resets | 刷新过期的密码重置令牌 | Flush expired password reset tokens

## 4、cache
命令 | 中文 | English
---|---|---
cache:clear | 刷新应用程序缓存 | Flush the application cache
cache:forget | 从缓存中删除项目 | Remove an item from the cache
cache:table | 为缓存数据库表创建迁移 | Create a migration for the cache database table

## 5、config
命令 | 中文 | English
---|---|---
config:cache | 创建缓存文件以加快配置速度 | Create a cache file for faster configuration loading
config:clear | 删除配置缓存文件 | Remove the configuration cache file

## 6、db
命令 | 中文 | English
---|---|---
db:seed | 填充数据库 | Seed the database with records

## 7、event
命令 | 中文 | English
---|---|---
event:generate | 根据注册生成缺少的事件和侦听器 | Generate the missing events and listeners based on registration

## 8、key
命令 | 中文 | English
---|---|---
key:generate | 生成应用程序key | Set the application key

## 9、lang
命令 | 中文 | English
---|---|---
lang:publish | 将语言文件发布到资源目录 | publish language files to resources directory

## 10、make
命令 | 中文 | English
---|---|---
make:auth | --- | Scaffold basic login and registration views and routes
make:channel | 创建一个新的 channel 类 | Create a new channel class
make:command | 创建一个新的 Artisan 命令 | Create a new Artisan command
make:controller | 创建一个新的控制器类 | Create a new controller class
make:event | 创建一个新的 event 类 | Create a new event class
make:exception | 创建一个新的自定义异常类 | Create a new custom exception class
make:factory | 创建一个新的模型工厂 | Create a new model factory
make:job | 创建一个新的工作类 | Create a new job class
make:listener | 创建一个新的事件监听器类 | Create a new event listener class
make:mail | 创建一个新的电子邮件类 | Create a new email class
make:middleware | 创建一个新的中间件类 | Create a new middleware class
make:migration | 创建一个新的迁移文件 | Create a new migration file
make:model | 创建一个新的 Eloquent 模型类 | Create a new Eloquent model class
make:notification | 创建一个新的通知类 | Create a new notification class
make:observer | 创建一个新的观察者类 | Create a new observer class
make:policy | 创建一个新的策略类 | Create a new policy class
make:provider | 创建一个新的服务提供者类 | Create a new service provider class
make:request | 创建一个新的表单请求类 | Create a new form request class
make:resource | 创建一个新资源 | Create a new resource
make:rule | 创建新的验证规则 | Create a new validation rule
make:scaffold | 代码生成器 —— Laravel 5.x Scaffold Generator | Create a laralib scaffold
make:seeder | 创建一个新的 seeder 类 | Create a new seeder class
make:test | 创建一个新的测试类 | Create a new test class

## 11、migrate
命令 | 中文 | English
---|---|---
migrate:fresh | 删除所有表并重新运行所有迁移 | Drop all tables and re-run all migrations
migrate:install | 创建迁移存储库 | Create the migration repository
migrate:refresh | 重置并重新运行所有迁移 | Reset and re-run all migrations
migrate:reset | 回滚所有数据库迁移 | Rollback all database migrations
migrate:rollback | 回滚上次数据库迁移 | Rollback the last database migration
migrate:status | 显示每次迁移的状态 | Show the status of each migration

## 12、notifications
命令 | 中文 | English
---|---|---
notifications:table | 为通知表创建迁移 | Create a migration for the notifications table

## 13、optimize
命令 | 中文 | English
---|---|---
optimize:clear | 删除缓存的引导程序文件 | Remove the cached bootstrap files

## 14、package
命令 | 中文 | English
---|---|---
package:discover | 重建缓存的包清单 | Rebuild the cached package manifest

## 15、queue
命令 | 中文 | English
---|---|---
queue:failed | 列出所有 failed 队列工作 | List all of the failed queue jobs
queue:failed-table | 为 failed 队列工作数据库表创建迁移 | Create a migration for the failed queue jobs database table
queue:flush | 刷新所有 failed 队列工作 | Flush all of the failed queue jobs
queue:forget | 删除 failed 队列工作 | Delete a failed queue job
queue:listen | 监听一个给定的队列 | Listen to a given queue
queue:restart | 在当前工作之后重新启动队列工作器守护程序 | Restart queue worker daemons after their current job
queue:retry | 重试 failed 队列作业 | Retry a failed queue job
queue:table | 为队列工作数据库表创建迁移 | Create a migration for the queue jobs database table
queue:work | 开始将队列上的工作作为守护程序处理 | Start processing jobs on the queue as a daemon

## 16、route
命令 | 中文 | English
---|---|---
route:cache | 创建路由缓存文件以加快路由注册速度 | Create a route cache file for faster route registration
route:clear | 删除路由缓存文件 | Remove the route cache file
route:list | 列出所有注册的路由 | List all registered routes

## 17、schedule
命令 | 中文 | English
---|---|---
schedule:run | 运行预定的命令 | Run the scheduled commands

## 18、session
命令 | 中文 | English
---|---|---
session:table | 为会话数据库表创建迁移 | Create a migration for the session database table

## 19、storage
命令 | 中文 | English
---|---|---
storage:link | 创建从 “公共 / 存储” 到 “存储 / 应用 / 公共” 的符号链接 | Create a symbolic link from "public/storage" to "storage/app/public"

## 20、vendor
命令 | 中文 | English
---|---|---
vendor:publish | 从供应商包中发布任何可发布的资产 | Publish any publishable assets from vendor packages

## 21、view
命令 | 中文 | English
---|---|---
view:cache | 编译所有应用程序的 Blade 模板 | Compile all of the application's Blade templates
view:clear | 清除所有编译的视图文件 | Clear all compiled view files

原文：https://learnku.com/articles/22514

https://www.cnblogs.com/BeautyFuture/articles/6253438.html