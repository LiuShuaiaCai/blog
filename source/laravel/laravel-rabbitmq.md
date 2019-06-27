---
title: Laravel 中使用 RabbitMQ
date: 2019-06-27 11:50:00
tags: ['Laravel','RabbitMQ']
---
## 1、安装扩展
安装 laravel-queue-rabbitmq 扩展

    composer require vladimir-yuldashev/laravel-queue-rabbitmq

## 2、添加provider
在 config/app.php 文件中，providers 中添加：

    VladimirYuldashev\LaravelQueueRabbitMQ\LaravelQueueRabbitMQServiceProvider::class,

## 3、配置队列信息
在 app/config/queue.php 配置文件中的 connections 数组中加入以下配置

    'connections' => [
        // ...
        'rabbitmq' => [
        
            'driver' => 'rabbitmq',
        
            /*
            * Set to "horizon" if you wish to use Laravel Horizon.
            */
            'worker' => env('RABBITMQ_WORKER', 'default'),
        
            'dsn' => env('RABBITMQ_DSN', null),
        
            /*
            * Could be one a class that implements \Interop\Amqp\AmqpConnectionFactory for example:
            *  - \EnqueueAmqpExt\AmqpConnectionFactory if you install enqueue/amqp-ext
            *  - \EnqueueAmqpLib\AmqpConnectionFactory if you install enqueue/amqp-lib
            *  - \EnqueueAmqpBunny\AmqpConnectionFactory if you install enqueue/amqp-bunny
            */
            
            'factory_class' => Enqueue\AmqpLib\AmqpConnectionFactory::class,
        
            'host' => env('RABBITMQ_HOST', '127.0.0.1'),
            'port' => env('RABBITMQ_PORT', 5672),
        
            'vhost' => env('RABBITMQ_VHOST', '/'),
            'login' => env('RABBITMQ_LOGIN', 'guest'),
            'password' => env('RABBITMQ_PASSWORD', 'guest'),
        
            'queue' => env('RABBITMQ_QUEUE', 'default'),
        
            'options' => [
        
                'exchange' => [
        
                    'name' => env('RABBITMQ_EXCHANGE_NAME'),
        
                    /*
                    * Determine if exchange should be created if it does not exist.
                    */
                    
                    'declare' => env('RABBITMQ_EXCHANGE_DECLARE', true),
        
                    /*
                    * Read more about possible values at https://www.rabbitmq.com/tutorials/amqp-concepts.html
                    */
                    
                    'type' => env('RABBITMQ_EXCHANGE_TYPE', \Interop\Amqp\AmqpTopic::TYPE_DIRECT),
                    'passive' => env('RABBITMQ_EXCHANGE_PASSIVE', false),
                    'durable' => env('RABBITMQ_EXCHANGE_DURABLE', true),
                    'auto_delete' => env('RABBITMQ_EXCHANGE_AUTODELETE', false),
                    'arguments' => env('RABBITMQ_EXCHANGE_ARGUMENTS'),
                ],
        
                'queue' => [
        
                    /*
                    * Determine if queue should be created if it does not exist.
                    */
                    
                    'declare' => env('RABBITMQ_QUEUE_DECLARE', true),
        
                    /*
                    * Determine if queue should be binded to the exchange created.
                    */
                    
                    'bind' => env('RABBITMQ_QUEUE_DECLARE_BIND', true),
        
                    /*
                    * Read more about possible values at https://www.rabbitmq.com/tutorials/amqp-concepts.html
                    */
                    
                    'passive' => env('RABBITMQ_QUEUE_PASSIVE', false),
                    'durable' => env('RABBITMQ_QUEUE_DURABLE', true),
                    'exclusive' => env('RABBITMQ_QUEUE_EXCLUSIVE', false),
                    'auto_delete' => env('RABBITMQ_QUEUE_AUTODELETE', false),
                    'arguments' => env('RABBITMQ_QUEUE_ARGUMENTS'),
                ],
            ],
        
            /*
            * Determine the number of seconds to sleep if there's an error communicating with rabbitmq
            * If set to false, it'll throw an exception rather than doing the sleep for X seconds.
            */
            
            'sleep_on_error' => env('RABBITMQ_ERROR_SLEEP', 5),
        
            /*
            * Optional SSL params if an SSL connection is used
            * Using an SSL connection will also require to configure your RabbitMQ to enable SSL. More details can be founds here: https://www.rabbitmq.com/ssl.html
            */
            
            'ssl_params' => [
                'ssl_on' => env('RABBITMQ_SSL', false),
                'cafile' => env('RABBITMQ_SSL_CAFILE', null),
                'local_cert' => env('RABBITMQ_SSL_LOCALCERT', null),
                'local_key' => env('RABBITMQ_SSL_LOCALKEY', null),
                'verify_peer' => env('RABBITMQ_SSL_VERIFY_PEER', true),
                'passphrase' => env('RABBITMQ_SSL_PASSPHRASE', null),
            ],   
            
        ],
        // ...    
    ],

## 4、配置env

    QUEUE_CONNECTION=rabbitmq    #这个配置env一般会有先找到修改为这个

    #以下是新增配置

    RABBITMQ_HOST=rabbitmq  #mq的服务器地址，我这里用的是laradock，具体的就具体修改咯
    RABBITMQ_PORT=5672  #mq的端口
    RABBITMQ_VHOST=/
    RABBITMQ_LOGIN=guest    #mq的登录名
    RABBITMQ_PASSWORD=guest   #mq的密码
    RABBITMQ_QUEUE=queue_name   #mq的队列名称

## 5、创建队列任务
创建一个测试队列：TestQueue

    php artisan make:job TestQueue

生成文件 `app/Jobs/TestQueue.php`，简单的向 users 数据表中添加数据
```php
<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class TestQueue implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $data;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try{
            $insert = [
                'passport_id' => $this->data['passportId'],
                'company_id' => $this->data['companyId'],
                'name' => $this->data['name'],
                'sign' => $this->data['sign'],
            ];
            $result = User::create($insert);
            echo json_encode(['code' => 0, 'msg' => $result]);
        }catch (\Exception $exception) {
            echo json_encode(['code' => 0, 'msg' => $exception->getMessage()]);
        }
    }
}
```

## 6、队列的调用
创建一个 Controller 来调用刚才创建好的队列 TestQueue，往队列中添加数据。

    php artisan make:controller RabbitMqController

```php
<?php

namespace App\Http\Controllers;

use App\Jobs\TestQueue;

class RabbitMqController extends Controller
{
    public function add()
    {
        $data = collect([
            'passportId' => 2,
            'companyId' => 2,
            'name' => 'sweet',
            'sign' => 'liusweet521!',
        ]);

        $this->dispatch(new TestQueue($data));

    }
}
```

## 7、消费队列数据
执行命令：

    php artisan queue:work --queue=test

执行效果如下：
```php
[13:15:47] liushuaicai:rabbit.lsc.com $ php artisan queue:work --queue=test
[2019-06-27 05:15:55][5d14390dae86e3.72918490] Processing: App\Jobs\TestQueue
{"code":0,"msg":{"passport_id":2,"company_id":2,"name":"sweet","sign":"liusweet521!","updated_at":"2019-06-27 05:15:55","created_at":"2019-06-27 05:15:55","id":2}}
```
数据库添加了一条：

    2	2	2	sweet				liusweet521!		2019-06-27 05:15:55	2019-06-27 05:15:55	