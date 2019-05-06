---
title: 控制反转(IoC) 与 依赖注入(DI)
date: 2019-01-24 23:10:11
tags: ['Laravel']
---
## 前言
一直在使用 Laravel 框架，也没有深入学习和总结，由于年后要项目重构，趁此机会提前再学习总结一下 Laravel 的一些功能，在新项目中能够发挥其作用  
本篇是关于`控制反转(IoC) 与 依赖注入(DI)`的学习笔记，如有错误，欢迎指出👏👏👏

## 什么是控制反转（IoC）
来自 [百度百科](https://baike.baidu.com/item/%E6%8E%A7%E5%88%B6%E5%8F%8D%E8%BD%AC/1158025?fr=aladdin) 的介绍:

    控制反转（Inversion of Control，缩写为IoC），是面向对象编程中的一种设计原则，可以用来减低计算机代码之间的耦合度。
    其中最常见的方式叫做依赖注入（Dependency Injection，简称DI），还有一种方式叫“依赖查找”（Dependency Lookup）。
    通过控制反转，对象在被创建的时候，由一个调控系统内所有对象的外界实体，将其所依赖的对象的引用传递给它。
    也可以说，依赖被注入到对象中。

控制反转：也就是说把创建对象的 **控制权** 进行 **转移**，依赖「插件」的实例化由 **应用程序** 转移到 **容器** 来完成操作，然后把「插件」的实例注入到应用程序。

## 什么是依赖注入（DI）
依赖注入（Dependency Injection，简称DI）：在应用程序运行过程中，动态的为应用程序注入依赖的资源。
+ 谁依赖谁？应用程序依赖各种「插件」
+ 谁注入谁？「插件」的实例注入到应用程序

## 控制反转 和 依赖注入的关系
根据上面的定义可以知道：控制反转是一种原则，而依赖注入就是实现这个原则的其中一种模式。
也就是说控制反转的目的是为了 **实现项目的高内聚低耦合**，而实现这种目标的方式则是通过 **依赖注入** 这种设计模式。

## 来个例子
我们在项目中也会经常用到发送站内消息的需求，我们就以用户注册成功，发送站内消息为例。我们写一个简单的例子：
```php
<?php
// 发送站内信
class WebMessage
{
    public function send($content)
    {
        echo "站内信：".$content;
    }
}

// 注册程序
class Register
{
    protected $message;

    public function __construct()
    {
        $this->message = new WebMessage();
    }
    public function index()
    {
        $this->message->send('注册成功');
    }
}

$register = new Register();
$register->index();
```
哈哈，so easy！很简单的就实现了（当然真是项目可能会复杂一些），但是，作为开发要坚信一个真理，一个产品会一成不变的（说直接一点就是永远不要相信产品），过了一天，产品来了，说站内信不好不要了，要改成发邮件，你又吭哧吭哧写了一个发邮件的类：
```php
<?php
// 发送邮件
class Email
{
    public function send($content)
    {
        echo "邮件：".$content;
    }
}

// 注册程序
class Register
{
    protected $message;

    public function __construct()
    {
        $this->message = new Email();
    }
    public function index()
    {
        $this->message->send('注册成功');
    }
}

$register = new Register();
$register->index();
```
记住那句话，过几天又来了，改成发短信，你又吭哧吭哧吭哧写了一个发短信的，这样每改一次都要去修改注册应用程序内部的代码，因为两个类之间有很强的依赖关系，我们可以把依赖的实例化操作放在外面，就不会每次都去修改主程序内部代码了，如下面写的：
```php
<?php
interface Message
{
    public function send($content);
}
// 发送站内信
class WebMessage implements Message
{
    public function send($content)
    {
        echo "站内信：".$content;
    }
}

// 发送邮件
class Email implements Message
{
    public function send($content)
    {
        echo "邮件：".$content;
    }
}

// 注册程序
class Register
{
    protected $message;

    public function __construct(Message $message)
    {
        $this->message = $message;
    }
    public function index()
    {
        $this->message->send('注册成功');
    }
}

// 发送站内信
$message = new WebMessage();
// 发送邮件
$message = new Email();
$register = new Register($message);
$register->index();
```
这样 Register 应用程序就和所依赖的 WebMessage、Email...等「插件」分离了。

## 如何实现依赖注入
依赖注入的方式有三种：
+ 构造函数注入（ Constructor Injection）
+ setter方法注入（ Setter Injection）
+ 接口注入（ Interface Injection）
### 通过构造函数注入
在 __construct() 方法中注入，例如：
```php
class Register
{
    protected $message;

    public function __construct(Message $message)
    {
        $this->message = $message;
    }
}
```
在解析函数中使用起来很方便，类中的所有方法都可以使用，但是如果依赖很多的话，还是在各个方法中只注入该方法需要的依赖，这样依赖不会太多，性能也会有所提高。
### 通过Setter方法注入
```php
class Register
{
    protected $message;

    public function setMessage(Message $message)
    {
        $this->message = $message;
    }
    ...
}

$message = new Email();
$register = new Register();
$register->setMessage($message);
$register->index();
```
其实也可以通过 __set() 设置
```php
// 注册程序
class Register
{
    protected $message;

    public function __set($messageType,Message $message)
    {
        $this->messageType = $message;
    }
    ...
}

$message = new Email();
$register = new Register();
$register->message = $message;
$register->index();
```

## 依赖注入容器
上面我们已经实现了依赖注入，应用程序的依赖不会在程序内部实例，但是在外部依然存在依赖
```php
$message = new WebMessage();
$message = new Email();
$register = new Register();
$register->message = $message;
$register->index();
```
现在是两种方式，随着需求的改变会越来越多，也就是说我们的实例化也会经常改变，所以就有了依赖注入容器，只需要把依赖绑定在容器内自动实例化、自动解析；下面是参考别人的小例子：
```php
<?php
// 消息类
class Message
{
    public function send($content){
        echo '消息：'.$content;
        echo "\n";
    }
}

// 发送站内信
class WebMessage extends Message
{
    public function __construct()
    {
        
    }
    public function send($content)
    {
        echo "站内信：".$content;
        echo "\n";
    }
}

// 发送邮件
class Email extends Message
{
    public function __construct()
    {
        
    }
    public function send($content)
    {
        echo "邮件：".$content;
        echo "\n";
    }
}

// 注册程序
class Register
{
    protected $message;

    public function __construct(Message $message)
    {
        $this->message = $message;
    }
    public function index()
    {
        $this->message->send('注册成功');
    }
}

// 服务容器
class Container
{
    private $container = [];

    public function __set($key, $value)
    {
        $this->container[$key] = $value;
    }

    public function __get($key)
    {
        if(!isset($this->container[$key])){
            throw new Exception('容器中没有属性'.$key);
        }
        return $this->build($this->container[$key]);
    }

    public function build($className)
    {
        // 如果是匿名函数（Anonymous Functions），也叫闭包函数（Closures）
        if($className instanceof Closure){
            // 执行闭包函数，返回结果
            return $className($this);
        }

        if(!class_exists($className)){
            return null;
            throw new Exception('类'.$className.'不存在');
        }

        /**
         * 反射
         * @var ReflectionClass $reflector
         */
        $reflector = new ReflectionClass($className);

        // 检查类是否可实例化，排除抽象类（abstract）和对象接口（interface）
        if(!$reflector->isInstantiable()){
            throw new Exception("类".$className."不能实例化");
        }
    
        /**
         * 获取类的构造函数、
         * @var ReflectionMethod $constructor
         */
        $constructor = $reflector->getConstructor();

        // 若无构造函数，直接实例化并返回
        if(is_null($constructor)){
            return new $className;
        }

        /**
         * 取构造函数参数，通过 ReflectionParameter 数组返回参数列表
         * @var ReflectionParameter $parameters
         */
        $parameters = $constructor->getParameters();
        
        // 递归解析构造函数的参数
        $dependencies = $this->getDependencies($parameters);

        // 创建一个类的新实例，给出的参数将传递到类的构造函数
        return $reflector->newInstanceArgs($dependencies);
    }

    public function getDependencies($parameters)
    {
        $dependencies = [];

        /**
         * 遍历构造函数的参数
         * @var ReflectionParameter $parameter
         */
        foreach($parameters as $parameter){
            /**
             * 查看参数的类
             * @var ReflectionClass $dependency
             */
            $dependency = $parameter->getClass();

            // 不是类，是变量
            if(is_null($dependency)){
                // 判断是否有默认值，有默认值返回默认值
                if($parameter->isDefaultValueAvailable()){
                    $dependencies[] =  $parameter->getDefaultValue();
                }
            }else{  // 是类，继续解析类的依赖
                $dependencies[] = $this->build($dependency->name);
            }
        }
        
        return $dependencies;
    }
}

// 下面这部分很麻烦，虽然看上去没实现自动化，但是融入到框架的时候，几乎不会让你手动去操作

// 实例化容器
$container = new Container();

 // 绑定类
$container->register = 'Register';
$register = $container->register;
$register->index();

// 绑定函数
$container->register = function(){
    return new Register(new Email());
};
$register = $container->register;
$register->index();

// 站内信
$container->webMessage = 'WebMessage';
$register = $container->webMessage;
$register->send('绑定邮件');
```
这只是个简单的程序，大部分是关于[反射](http://php.net/manual/zh/book.reflection.php)的知识点,有兴趣的可以试一下继续改进。

以上是我对控制反转(IoC) 与 依赖注入(DI)的学习笔记，参考了很多大家的资料，谢谢🙏

## 参考资料
[依赖注入系列教程](https://laravel-china.org/articles/11151/dependency-injection-series-tutorials) 
[php的依赖注入容器](https://www.cnblogs.com/phpper/p/7781810.html)
https://blog.csdn.net/bestone0213/article/details/47424255
