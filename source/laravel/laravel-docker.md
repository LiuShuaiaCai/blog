---
title: Laravel-Docker 快速搭建WEB
date: 2019-06-27 09:28:00
tags: ['Laravel','Docker']
---

## 1、Docker 搭建 Web 环境
我使用 docker-compose 搭建了一些常用的Web组件（PHP、MySQL、Nginx、Redis、RabbitMQ等）  
GitHub地址：[https://github.com/LiuShuaiaCai/docker-web](https://github.com/LiuShuaiaCai/docker-web)

## 2、遇到的问题
这里使用了 Laravel 框架做一些小的功能的测试，可是在链接过程中遇到了一些个问题，下面也总结了一下：
### 2.1 数据库链接失败
我用 Navicat 链接 127.0.0.1 是成功的，可是用 Laravel 链接失败。
Laravel env环境配置如下：

    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=rbac
    DB_USERNAME=root
    DB_PASSWORD=liushuaicai

链接失败原因：链接被拒绝
```php
SQLSTATE[HY000] [2002] Connection refused (SQL: select * from users)
```

解决方法：
+ 方法一： 使用docker环境的mysql内部ip链接
```php
[9:50:38] liushuaicai:~ $ docker ps|grep db
1a4ba633aa93        compose_db          "docker-entrypoint.s…"   2 months ago        Up About an hour    0.0.0.0:3306->3306/tcp, 33060/tcp                                                                           db
[9:51:11] liushuaicai:~ $ docker inspect 1a4ba633aa93|grep IPAddress
            "SecondaryIPAddresses": null,
            "IPAddress": "172.17.0.3",
                    "IPAddress": "172.17.0.3",
```

+ 方法二：用本地地址链接(我的：192.168.104.125)
```php
[10:00:32] liushuaicai:~ $ ifconfig|grep "inet "
	inet 127.0.0.1 netmask 0xff000000
	inet 192.168.104.125 netmask 0xfffffc00 broadcast 192.168.107.255
```

### 2.2 未定义：SOCKET_EWOULDBLOCK
在把数据推入RabbitMQ队列的时候，报了一个错误：
```php
    Use of undefined constant SOCKET_EWOULDBLOCK - assumed 'SOCKET_EWOULDBLOCK'
```
原因：PHP没有安装 `sockets` 扩展
解决办法：在 PHP 的dockerfile文件中添加 sockets 扩展
```php
RUN docker-php-ext-install sockets
```

### 2.3 未定义：bcadd
RabbitMQ 的另一个问题：
```php
Call to undefined function PhpAmqpLib\Wire\bcadd()
```
原因：PHP没有安装 `bcmath` 扩展
解决办法：在 PHP 的dockerfile文件中添加 sockets 扩展
```php
RUN docker-php-ext-install bcmath
```