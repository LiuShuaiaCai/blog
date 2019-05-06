---
title: Monolog - 为PHP创建
date: 2019-05-04 12:58:07
categories: PHP
tags: ['PHP']
---
![monolog](/images/monolog.png)
在我们的平常工作中，通过日志排查问题、收集数据等是很常见的方法，Monolog 就是专门为PHP的日志而创建的库，它让日志记录变得更加方便。
<!--more-->
Monolog 的特点： 

    Monolog 将您的日志发送到文件，套接字，收件箱，数据库和各种 Web 服务；
    实现了 PSR-3 接口，您可以在自己的库中键入提示，以保持最大的互操作性；

## 1、安装方法
创建一个目录，初始化 composer 包
```
composer init
```
一路点击 `Enter` 键创建 `composer.json` 文件。
安装 monolog 包
```
composer require monolog/monolog
```
结构目录如下：

    .
    ├── composer.json
    ├── composer.lock
    └── vendor
        ├── autoload.php
        ├── composer
        ├── monolog
        └── psr

    4 directories, 3 files

## 2、基本用法
以下来自[官方](https://github.com/Seldaek/monolog)实例：
```php
<?php
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

// create a log channel
$log = new Logger('name');
$log->pushHandler(new StreamHandler('path/to/your.log', Logger::WARNING));

// add records to the log
$log->warning('Foo');
$log->error('Bar');
```

## 3、使用说明
### 3.1、核心概念
每个 Logger 实例都有一个「通道（channel）」和一个「处理器（handler)栈」。
```php
// create a log channel
$log = new Logger('name');
// create a handler
$log->pushHandler(new StreamHandler('./log/stat/'.date('Ymd').'.log', Logger::WARNING));
```
每次向记录器添加记录时，都会遍历一遍「处理器（handler)栈」，每个处理器都会判断是否处理该条记录，如果处理，遍历结束。
```php
// add records to the log
$log->warning('Foo');
```
warning 方法
```php
public function warning($message, array $context = array())
{
    return $this->addRecord(static::WARNING, $message, $context);
}

public function addRecord($level, $message, array $context = array())
{
    // 如果处理器栈为空，直接输出记录
    if (!$this->handlers) {
        $this->pushHandler(new StreamHandler('php://stderr', static::DEBUG));
    }
    // 记录等级的名称-WARNING
    $levelName = static::getLevelName($level);

    /**
     * 检查是否有任何处理程序将处理此消息，以便我们可以提前返回并保存周期
     * check if any handler will handle this message so we can return early and save cycles
     */
    $handlerKey = null;
    reset($this->handlers);
    // 循环遍历处理器栈
    while ($handler = current($this->handlers)) {
        /**
         * +------------------------------------------------
         * + 判断是否处理该条记录，只要record的级别大于处理器的级别，就处理该条记录
         * +------------------------------------------------
         * + public function isHandling(array $record)
         * + {
         * +    return $record['level'] >= $this->level;
         * + }
         * +------------------------------------------------
         */
        if ($handler->isHandling(array('level' => $level))) {
            $handlerKey = key($this->handlers);
            break;
        }

        next($this->handlers);
    }
    // 如果没有处理器，返回false
    if (null === $handlerKey) {
        return false;
    }

    // 设置时区
    if (!static::$timezone) {
        static::$timezone = new \DateTimeZone(date_default_timezone_get() ?: 'UTC');
    }

    // php7.1+ always has microseconds enabled, so we do not need this hack
    if ($this->microsecondTimestamps && PHP_VERSION_ID < 70100) {
        $ts = \DateTime::createFromFormat('U.u', sprintf('%.6F', microtime(true)), static::$timezone);
    } else {
        $ts = new \DateTime(null, static::$timezone);
    }
    $ts->setTimezone(static::$timezone);

    $record = array(
        'message' => (string) $message,
        'context' => $context,
        'level' => $level,
        'level_name' => $levelName,
        'channel' => $this->name,
        'datetime' => $ts,
        'extra' => array(),
    );
    
    try {
        // 对额外的数据进行处理
        foreach ($this->processors as $processor) {
            $record = call_user_func($processor, $record);
        }
        // 写入日志
        while ($handler = current($this->handlers)) {
            if (true === $handler->handle($record)) {
                break;
            }

            next($this->handlers);
        }
    } catch (Exception $e) {
        $this->handleException($e, $record);
    }

    return true;
}
```

### 3.2、日志级别
Monolog支持 [RFC 5424](http://tools.ietf.org/html/rfc5424) 描述的日志记录级别

Level|Number|Desc
--|--|--
DEBUG|100|调试：详细的调试信息
INFO|200|信息：关注的事件。示例：用户登录、SQL日志
NOTICE|250|注意：正常但重要的事件
WARNING|300|警告：非错误发生的例外情况。示例：使用不推荐使用的API，使用不当的API，不一定错误的不良内容
ERROR|400|错误：运行时错误，不需要立即执行，但通常应记录和监视
CRITICAL|500|严重：危急情况。示例：应用程序组件不可用，意外异常
ALERT|550|警报：必须立即采取行动。示例：整个网站关闭，数据库不可用等。这应该触发SMS警报并唤醒您
EMERGENCY|600|紧急情况：系统无法使用

### 3.3、在日志中添加额外数据
Monolog 提供了两种不同的方法来实现在日志中添加额外的数据：

+ **使用日志记录上下文**
第一种方式是上下文，可以给日志传递一个数组：
```php
$log->warning('Foo', ['name' => 'lsc']);
```
打印日志：

    [2019-05-06 09:49:52] name.WARNING: Foo {"name":"lsc"} []

简单的处理程序（例如StreamHandler）将简单地将数组格式化为字符串，但更丰富的处理程序可以利用上下文（例如，FirePHP能够以非常方式显示数组，没研究怎么使用）。

+ **使用处理器**
第二种方法是使用处理器为所有记录添加额外数据。处理器可以是任何可调用的。他们将获取记录作为参数，并且必须在最终更改extra它的一部分后返回它。
```php
$log->pushProcessor(function($record) {
    $record['message'] = 'Hello ' . $record['message'];
    $record['extra']['age'] = 28;
    return $record;
});
```
打印日志：

    [2019-05-06 09:56:55] name.WARNING: Hello Foo {"name":"lsc"} {"age":28}

### 3.4、利用通道
通道是识别记录与应用程序的哪个部分相关的好方法。这在大型应用程序中很有用（并且由Symfony中的MonologBu​​ndle使用）。
例如：多个Logger实例共享一个写入单个日志文件的处理器。
```php
<?php
require_once "./vendor/autoload.php";

use Monolog\Logger;
use Monolog\Handler\StreamHandler;

// Create some handlers
$stream = new StreamHandler('./log/log2.log', Logger::DEBUG);

// 创建一个Logger实例
$logger = new Logger('channel1');
$logger->pushHandler($stream);
$logger->error('this is channel1');

// 创建一个新的Logger实例
$logger2 = new Logger('channel2');
$logger2->pushHandler($stream);
$logger2->error('this is channel2');

// 复制 channel2 的实例
$logger3 = $logger->withName('channel2');
$logger3->error('this is logger3');
```
打印日志：

    [2019-05-06 02:08:42] channel1.ERROR: this is channel1 [] []
    [2019-05-06 02:08:42] channel2.ERROR: this is channel2 [] []
    [2019-05-06 02:08:42] channel2.ERROR: this is logger3 [] []

流处理器 StreamHandler 的参数：

名称|类型|默认值|描述
--|--|--|--
stream|resource 或者 string|无（必传）|文件流
level|int|100(debug)|将触发此处理程序的最低日志记录级别
bubble|bool|true|消息处理后，指示消息是否推送到其他通道
filePermission|int 或者 null|644|日志文件权限
useLocking|bool|false|写入之前尝试锁定日志文件


### 3.5、自定义日志格式
在 Monolog 中，可以通过 `setFormatter` 方法设置自定义的日志格式：
```php
<?php
require_once "./vendor/autoload.php";

use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Formatter\LineFormatter;
use Monolog\Formatter\JsonFormatter;

// 创建处理器
$stream = new StreamHandler('./log/log3.log', Logger::DEBUG);


/**
 * 自定义日志格式
 * 
 * @var string $dateFormat 时间格式
 * 默认时间格式："Y-m-d H:i:s"
 */
$dateFormat = "Y-m-d H:i:s";

/**
 * @var string $output 输出格式
 * 默认输出格式："[%datetime%] %channel%.%level_name%: %message% %context% %extra%\n"
 */
$output = "%datetime%#%channel%#%level_name%#%message% %context% %extra%\n";
// 格式化日志
$formatter = new LineFormatter($output, $dateFormat);
$stream->setFormatter($formatter);
// $stream->setFormatter(new JsonFormatter());


// 创建一个Logger实例
$logger = new Logger('channel');
$logger->pushHandler($stream);
$logger->error('自定义日志格式');
```
打印日志：

    2019-05-06 03:02:25#channel#ERROR#自定义日志格式 [] []

## 参考文章
[Laravel 的日志系统 - monolog](https://learnku.com/articles/8108/the-log-system-of-laravel-monolog)
[官方文档](https://github.com/Seldaek/monolog)
想了解更多可以查看官方文档。