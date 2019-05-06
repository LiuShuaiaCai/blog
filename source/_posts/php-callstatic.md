---
title: PHP 后期静态绑定
date: 2019-02-13 21:53:45
categories: PHP
tags: ['PHP']
---
从 PHP 5.3.0 开始，PHP 增加了一个叫做`后期静态绑定`的功能，用于在继承范围内引用静态调用的类。简单的说就是：使用 `static::` 关键字时，类名称不是当前方法所在的类，而是当前对象实例所属的类或者当前调用的类。
使用(static)关键字来表示这个别名，和静态方法，静态类没有半毛钱的关系，static::不仅支持静态类，还支持对象（动态类）。
<!--more-->
## 工作原理
后期静态绑定工作原理是存储了在上一个 "非转发调用" （non-forwarding call）的类名。

## 转发调用
“转发调用”（forwarding call）指的是通过以下几种方式进行的静态调用：self::，parent::，static:: 以及 forward_static_call()

## 非转发调用
"非转发调用" （non-forwarding call）指的是：
1、当进行静态方法调用时，该类名即为明确指定的那个（通常在 :: 运算符左侧部分），例如：foo::bar()；
2、当进行非静态方法调用时，即为该对象所属的类，例如：$foo->bar()。

## 例子
### 1、self 的限制
使用 `self` 或者 `__CLASS__` 对当前类的静态引用，取决去定义当前方法所在的类。
官方实例：
```php
<?php
class A
{
    public static function who()
    {
        echo __CLASS__;
    }

    public static function test()
    {
        self::who();
    }
}

class B extends A
{
    public static function who()
    {
        echo __CLASS__;
    }
}

B::test();
```
结果如下：
```
A
```

### 2、后期静态绑定用法
从上面的官方小例子也可以看到，self 限制了对象为方法自身所属的类，后期静态绑定就是想绕过这种限制，简单的说，就是想让上面的输出结果是 B ，而不是 A，但并没有引入什么新的关键字或者函数，而是使用已经预留的 static 关键字。
下面就是把 self 换成 static，看一下输出结果。
```php
<?php
class A
{
    public static function who()
    {
        echo __CLASS__;
    }

    public static function test()
    {
        static::who(); // 后期静态绑定从这里开始
    }
}

class B extends A
{
    public static function who()
    {
        echo __CLASS__;
    }
}

B::test();
```
输出结果：
```php
B
```

输出结果就是我们预期的B。上面我们都是使用的静态方法，在非静态方法下，我们看一下 $this 和 static 的差别。
```php
<?php
class A
{
    private function foo()
    {
        echo __method__."\n";
    }

    public function test()
    {
        $this->foo();
        static::foo();
    }

    
}

class B extends A
{
    // foo()将被复制到b，因此它的作用域仍然是a，调用将成功
}

class C extends B
{
    private function foo()
    {
        // 替换原有方法；新方法的范围为C
        echo __method__."\n";
    }

    /**
     * 方法重载，调用不存在或者不可见的属性或者方法
     * 不加这个方法，调用$c->test(),static::foo()时会报错，因为类C的foo()不可以被访问
     */
    public static function __callStatic($name, $arguments)
    {
        (new static)->$name($arguments);
    }
}


$b = new B();
$b->test();
/**
 * 输出结果
 * A::foo
 * A::foo
 */

$c = new C();
$c->test();
/**
 * 输出结果
 * A::foo
 * C::foo
 */
```


从结果可以看到 `$this->` 调用的是类A的foo()，而 static 调用的是类C的foo()方法，所以 `$this` 的作用范围只限于当前类，而 static 是对象的实例所属的类。

    官方注解 Note:
    在非静态环境下，所调用的类即为该对象实例所属的类。由于 $this-> 会在同一作用范围内尝试调用私有方法，而 static:: 则可能给出不同结果。另一个区别是 static:: 只能用于静态属性。 

### 3、转发和非转发调用
后期静态绑定的解析会一直到取得一个完全解析的静态调用为止。另一方面，如果静态调用使用 parent:: ，self:: ， static:: 或者 forward_static_call() 将转发调用信息。 
```php
<?php
class A
{
    public static function foo()
    {
        static::who(); // 后期静态绑定
    }

    public static function who()
    {
        echo __method__."\n";
    }
}

class B extends A
{
    public static function test()
    {
        A::foo();
        self::foo();
        parent::foo();
        static::foo();
        forward_static_call(['A','foo']);
    }

    public static function who()
    {
        echo __method__."\n";
    }
}

class C extends B
{
    public static function who()
    {
        echo __method__."\n";
    }
}

C::test();
```
输出结果：
```php
A::who
C::who
C::who
C::who
C::who
```
### 4、最后一个例子
我们经常使用 sql 查询 find 方法，我们来模拟一下：
```php
<?php
class Model
{
    protected function find(int $id)
    {
        $data = static::$datas;
        $result = $data[$id] ?? '';

        echo $result."\n";
        return $result;
    }

    public function __call($name, $arguments)
    {
        foreach($arguments as $argv){
            $this->$name($argv);
        }
    }

    public static function __callStatic($name, $arguments)
    {
        foreach($arguments as $argv){
            (new static)->$name($argv);
        }
    }
}

class Product extends Model
{
    protected static $datas = array(
        1 => 'php',
        2 => 'python',
        3 => 'go',
        4 => 'c'
    );
}

Product::find(1,2);

$p = new Product();
$p->find(3,4);
```
输出结果：
```php
php
python
go
c
```
## 总结
后期静态绑定大致就这些了，都是参考 [官方网站](http://php.net/manual/zh/language.oop5.late-static-bindings.php) 学习的，大家想了解更多，可以去看一下。