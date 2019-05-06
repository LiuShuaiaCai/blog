---
title: phptrace 简单使用
date: 2019-03-02 14:29:16
categories: PHP
tags: ['PHP','调试工具']
---
## 1、介绍
phptrace 是一个 `Qihoo360` 开源的一个低开销的用于跟踪(trace)、分析PHP运行情况的工具。

它可以跟踪PHP在运行时的函数调用、请求信息、执行流程，并且提供有过滤器、统计信息、当前状态等实用功能。 在任何环境下，它都能很好的定位阻塞问题以及在高负载下Debug，尤其是线上生产环境。
<!--more-->
具有以下特性：

    低开销，在只加载模块不开启Trace功能时对性能影响极低
    稳定性，已经稳定运行在Qihoo 360线上服务中，并针对主流框架进行测试
    易用性，对于未安装trace扩展的环境，也能够追踪运行状态

phptrace是类strace的一个实现，不同的是，strace用来追踪系统调用，而phptrace用来追踪PHP函数调用。无论是开发测试 还是线上追查问题，代码执行流程往往会提供许多有用的信息，大大提高了开发人员的工作效率；

## 2、安装
### 2.1、下载地址：
+ GitHub: https://github.com/Qihoo360/phptrace
+ PECL: https://pecl.php.net/package/trace

### 2.2、下载解压
```php
curl -LOk https://github.com/Qihoo360/phptrace/archive/master.zip
unzip master.zip    // unzip解压
cd phptrace-master/extension/  // 进入解压后的扩展目录
```

### 2.3、源码编译
2.3.1、PHP 扩展安装（以下命令是在 phptrace-master/extension/ 目录中执行的）
```sh
phpize
./configure --with-php-config=/usr/local/php7/bin/php-config
make
```
php-config 的路径要根据自己的位置进行修改。

2.3.2、命令行工具
```sh
make cli
```

2.3.3、安装PHP扩展、命令行工具至PHP目录
```sh
make install-all
```

### 2.4、添加扩展
编辑配置文件php.ini(如果没有 php.ini 文件，复制源码中的 php.ini-development 或者 php.ini-production 到安装目录的 etc文件夹下，命名为 php.ini )，增加下面配置信息。
```php
[phptrace]
extension=trace.so
phptrace.enabled = 1
```
php-fpm需要手动重启。
```
kill -USR2 24612
```
master进程可以理解以下信号

    INT, TERM 立刻终止
    QUIT 平滑终止
    USR1 重新打开日志文件
    USR2 平滑重载所有worker进程并重新载入配置和二进制模块

查看扩展安装：
```php
root@VM_173_23_centos:/usr/local/php7# php -m | grep trace
trace
```

或者查看 phpinfo()，查看 /usr/local/php7/bin 下已经有了 phptrace
```sh
root@VM_173_23_centos:/usr/local/php7/bin# ls
pear  peardev  pecl  phar  phar.phar  php  php-cgi  php-config  phpdbg  phpize  phptrace
```

创建一个软连接：
```
ln -s /usr/local/php7/bin/phptrace /usr/local/bin/phptrace
```

## 3、使用
### 3.1、查看命令参数
```
root@VM_173_23_centos:/usr/local/php7/bin# phptrace -h
phptrace - A low-overhead tracing tool for PHP

Usage: phptrace -p <pid>...
       phptrace -h | --help

Commands:
    trace               Trace a running PHP process [default]
    status              Display current status of specified PHP process
    version             Show version

Options:
        --ptrace        Fetch data using ptrace, only in status mode
    -p, --pid           Process id
    -h, --help          Show this screen
    -v, --verbose
    -f, --filter        Filter data by type [url,function,class] and content
    -l, --limit         Limit output count
```

    trace 追踪运行的PHP进程(默认)
    status 展示PHP进程的运行状态
    version 版本
    -p 指定php进程id('all'追踪所有的进程)
    -h 帮助
    -v 同version
    -f 通过类型(url,function,class)和内容过滤数据
    -l 限制输出次数
    --ptrace 在追踪状态的模式下通过ptrace获取数据

### 3.2、官方实例
phptrace 官方实例 example.php 文件如下：
```php
<?php
class Me
{
    public function say($words)
    {
        echo $words."\n";
    }
    public function sleep()
    {
        $this->say('sleeping...');
        sleep(2);
    }
    public function run()
    {
        $this->say('good night');
        $this->sleep();
        $this->say('wake up');
    }
}
$pid = getmypid();
echo "**phptrace sample**\n";
echo "Type these command in a new console:\n";
echo "\n";
echo "trace:                    phptrace -p $pid\n";
echo "trace with filter:        phptrace -p $pid -f type=function,content=sleep\n";
echo "trace with filter:        phptrace -p $pid -f type=class,content=Me\n";
echo "trace with count limit:   phptrace -p $pid -l 2\n";
echo "view status:              phptrace status -p $pid\n";
echo "view status by ptrace:    phptrace status -p $pid --ptrace\n";
echo "\n";
printf("Press enter to continue...\n");
$fp = fopen('php://stdin', 'r');
fgets($fp);
fclose($fp);
usleep(100000);
(new Me)->run();
```

`php example.php` 运行结果
```php
root@VM_173_23_centos:~/phptrace-master# php example.php
**phptrace sample**
Type these command in a new console:

trace:                    phptrace -p 32194
trace with filter:        phptrace -p 32194 -f type=function,content=sleep
trace with filter:        phptrace -p 32194 -f type=class,content=Me
trace with count limit:   phptrace -p 32194 -l 2
view status:              phptrace status -p 32194
view status by ptrace:    phptrace status -p 32194 --ptrace

Press enter to continue...
```

可以看到上面的几个追踪（trace）命令，再开一个窗口，运行 trace 命令

```php
 root@VM_173_23_centos:~# phptrace -p 32194
process attached
[pid 32194]    > Me->run() called at [/root/phptrace-master/example.php:57]
[pid 32194]        > Me->say("good night") called at [/root/phptrace-master/example.php:33]
[pid 32194]        < Me->say("good night") = NULL called at [/root/phptrace-master/example.php:33] ~ 0.000s 0.000s
[pid 32194]        > Me->sleep() called at [/root/phptrace-master/example.php:34]
[pid 32194]            > Me->say("sleeping...") called at [/root/phptrace-master/example.php:27]
[pid 32194]            < Me->say("sleeping...") = NULL called at [/root/phptrace-master/example.php:27] ~ 0.000s 0.000s
[pid 32194]            > sleep(2) called at [/root/phptrace-master/example.php:28]
[pid 32194]            < sleep(2) = 0 called at [/root/phptrace-master/example.php:28] ~ 2.000s 2.000s
[pid 32194]        < Me->sleep() = NULL called at [/root/phptrace-master/example.php:34] ~ 2.000s 0.000s
[pid 32194]        > Me->say("wake up") called at [/root/phptrace-master/example.php:35]
[pid 32194]        < Me->say("wake up") = NULL called at [/root/phptrace-master/example.php:35] ~ 0.000s 0.000s
[pid 32194]    < Me->run() = NULL called at [/root/phptrace-master/example.php:57] ~ 2.000s 0.000s
[pid 32194]< cli php example.php
process detached
```

```php
 root@VM_173_23_centos:~# phptrace status -p 5368
------------------------------- Status --------------------------------
PHP Version:       7.3.2
SAPI:              cli
script:            /root/phptrace-master/example.php
elapse:            11.902s
memory:            0.40m
memory peak:       0.44m
real-memory:       2.00m
real-memory peak   2.00m
------------------------------ Arguments ------------------------------
$0                 example.php
------------------------------ Backtrace ------------------------------
#0  Me->run() called at [/root/phptrace-master/example.php:57]
#1  {main}() called at [/root/phptrace-master/example.php:57]
```
可以看到在脚本运行过程，以及各个PHP函数的调用。其他几个命令都可以试试，不过我这边运行最后一个命令会出错，没找出问题。

### 3.3、验证 PHP 后期静态绑定
[PHP 后期静态绑定](http://blog.feifan.news/2019/02/13/php-callstatic/#4%E3%80%81%E6%9C%80%E5%90%8E%E4%B8%80%E4%B8%AA%E4%BE%8B%E5%AD%90)的例子，我们验证一下两种调用方法的执行过程。
```php
> Model::find(1, 2) called at [/root/php/index.php:39]
[pid  7715]        > Model::__callStatic("find", array(2)) called at [/root/php/index.php:39]
[pid  7715]            > Model->find(1) called at [/root/php/index.php:23]
[pid  7715]            < Model->find(1) = "php" called at [/root/php/index.php:23] ~ 0.000s 0.000s
[pid  7715]            > Model->find(2) called at [/root/php/index.php:23]
[pid  7715]            < Model->find(2) = "python" called at [/root/php/index.php:23] ~ 0.000s 0.000s
[pid  7715]        < Model::__callStatic("find", array(2)) = NULL called at [/root/php/index.php:39] ~ 0.000s 0.000s
[pid  7715]    < Model::find(1, 2) = NULL called at [/root/php/index.php:39] ~ 0.000s 0.000s
[pid  7715]    > Model->find(3, 4) called at [/root/php/index.php:42]
[pid  7715]        > Model->__call("find", array(2)) called at [/root/php/index.php:42]
[pid  7715]            > Model->find(3) called at [/root/php/index.php:16]
[pid  7715]            < Model->find(3) = "go" called at [/root/php/index.php:16] ~ 0.000s 0.000s
[pid  7715]            > Model->find(4) called at [/root/php/index.php:16]
[pid  7715]            < Model->find(4) = "c" called at [/root/php/index.php:16] ~ 0.000s 0.000s
[pid  7715]        < Model->__call("find", array(2)) = NULL called at [/root/php/index.php:42] ~ 0.000s 0.000s
[pid  7715]    < Model->find(3, 4) = NULL called at [/root/php/index.php:42] ~ 0.000s 0.000s
[pid  7715]    > sleep(2) called at [/root/php/index.php:44]
[pid  7715]    < sleep(2) = 0 called at [/root/php/index.php:44] ~ 2.000s 2.000s
```
可以看到在执行 `Product::find(1,2);` 的时候，先调用 `__callStatic` 方法，随后调用 find() 方法；
执行 `$p = new Product(); $p->find(3,4);` 先调用 `__call` 方法，随后调用 find() 方法；

官方教程：https://github.com/Qihoo360/phptrace/blob/master/README_ZH.md