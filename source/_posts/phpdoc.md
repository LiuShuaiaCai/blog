---
title: phpDocumentor 标签
date: 2019-03-14 13:29:06
categories: PHP
tags: ['PHP']
---
phpDocumentor 标签与 JavaDoc 很相似。只有位于文本块(DocBlock)新行开头的标签才会被解析，并且在单行范围内，@ character后面的文本可以保持任意长度。例如：

```php
<?php
/**
 * tags demonstration
 * @author this tag is parsed, but this @version tag is ignored
 * @version 1.0 this version tag is parsed
 */
?>
```

<!--more-->

任何 phpDocumentor 无法识别的标签将不会被解析，但会将其以文本的形式作为文本快的一部分进行输出。以下是 phpDocumentor 支持的标签列表：

| 标签 | 适用 | 描述 |
| --- | --- | --- |
| api | 方法 | 声明此元素适用于第三方 |
| author | 任何 | 记录相关作者 |
| copyright | 任何 | 记录相关版权信息 |
| deprecated | 任何 | 声明次此元素不推荐使用，以后的版本中将会弃用 |
| exmaple | 任何 | 显示一部分代码 |
| filesource | 文件 | 在解析结果中包含当前文件的源 |
| global | 变量 | 全局变量及其用法 |
| ignore | 任何 | 忽略的元素 |
| internal | 任何 | 说明此元素是相关程序或库的内部元素，默认隐藏 |
| licence | 文件，类 | (开源)许可证 |
| link | 任何 | 相关链接 |
| method | 类 | 声明可调用的魔术方法 |
| package | 文件，类 | 所属包 |
| param | 方法，函数 | 声明程序或者方法所用到的参数 |
| property | 类 | 声明类存在的魔术属性 |
| property-read | 类 | 声明类存在的只读的魔术属性 |
| property-write | 类 | 声明类存在的只写的魔法属性 |
| return | 方法，函数 | 方法或者函数返回的值 |
| see | 任何 | 相关参数 |
| since | 任何 | 声明可用版本 |
| source | 任何（除了文件）| 参考来源 |
| subpackage | 文件，类 | 所属子包 |
| throws | 方法，函数 | 声明特定异常的类型 |
| todo | 任何 | 功能不完善，计划还要开发的任务 |
| uses | 任何 | 表示对单个关联元素的引用 |
| var | 属性 | 方法或者函数的属性 |
| version | 任何 | 当前版本 |

此以上常规标签(regular tags)外，phpDocumentor 中还有一种行内标签(inline tags)。与常规标签不同，行内标签不要求出现在新行的开头，而可以出现在文本流中。以下几个常用的行内标签：

    inline {@internal}
    inline {@inheritdoc}
    inline {@link}

看一下各个标签的例子：

# author
**语法**：`@author [name] [<email address>]`

**描述**：@author标记可用于指示谁创建了结构元素 或已对其进行了重大修改。此标记还可以包含电子邮件地址。

**适用**：全局变量(global variable)、引用(include)、常量(constant)、函数(function)、定义(define)、类(class)、变量(variable)、方法(method)、页面(page)

**示例**：
```php
<?php
/**
 * 函数的描述 - 显示作者的例子函数
 * @author LiuShuaicai <liushuaicai@100tal.com>
 * @author LiuShuaicai
 */
function authorFunction()
{
    return 0;
}
```

# copyright
**语法**：`@copyright [description]`

**描述**：@copyright 元素的版权声明。v1.2 新特性：@copyright 属性可以从父类直接遗传到子类，详情请参考 inline {inheritdoc}

**适用**：全局变量(global variable)、引用(include)、常量(constant)、函数(function)、定义(define)、类(class)、变量(variable)、方法(method)、页面(page)

**示例**：
```php
<?php
/**
 * 函数描述 - 显示版权的例子
 * @author LiuShauicai <liushuaicai@100tal.com>
 * @copyright Copyright (c) 2019, HaoWeiLai
 */
function copyrightFunnction()
{
    return 0;
}
```

# deprecated 
**语法**：`@deprecated [<version>] [<description]>]`

**描述**：
@deprecated标记声明在将来的版本中将删除关联的结构元素，因为它已过时，或者不建议使用它。

此标记还可以包含一个版本号，直到它被保证包含在软件中为止。从给定的版本开始，函数将被删除，或者可以在不另行通知的情况下删除。如果指定，版本号必须遵循与@version标记向量相同的规则。

建议（但不是必需）提供一个附加说明，说明为什么不推荐使用关联元素。如果它被另一个方法取代，建议在指向新元素的同一phpdoc中添加一个@see标记。

**适用**：全局变量(global variable)、引用(include)、常量(constant)、函数(function)、定义(define)、类(class)、变量 (variable)、方法(method)

**示例**：
```php
<?php
 /**
  * @deprecated
  * @deprecated 1.0.0
  * @deprecated No longer used by internal code and not recommended.
  * @deprecated 1.0.0 No longer used by internal code and not recommended.
  */
 function deprecatedFunction()
 {
    return 0;
 }
```

# example
**语法**：`@example [location] [<start-line> [<number-of-line>]] [<description>]`
 or inline：`{@example [location] [<start-line> [<number-of-line>]] [<description>]}`

**描述**：
@example标记可用于通过显示使用它们的文件的内容来演示结构元素的使用。

必须指定文件的位置。它可以指定为相对或绝对URI，或指定为相对或绝对文件路径。在位置周围使用双引号来明确指定它是文件路径。

如果指定，起始行必须是正整数。它指定了显示示例的行号；如果未指定起始行，则完整显示示例文件。
该行号可以可选地后跟另一个正整数，指定从起始行开始呈现的行数。如果省略，则示例文件从起始行显示到文件末尾。

建议（但不要求）提供附加说明以提供有关所呈现代码的更详细说明。

**示例**：
```php
<?php
 /**
  * @example example1.php Counting in action.
  * @example http://example.com/example2.phps Counting in action by a 3rd party.
  * @example "My Own Example.php" My counting.
  */
 function exampleFunction()
 {
     return 0;
 }
```

# global
**语法**：`@global [type] [name]` or `@global [type] [description]`

**描述**：@global语法可用于记录函数中全局变量的使用
http://manual.phpdoc.org/HTMLframesConverter/default/?spm=a2c4e.11153940.blogcont691719.9.12921de8uyH6wq

**示例**：
```php
<?php
class test
{
}
 
/**
 * @global test $GLOBALS['baz'] 
 * @name $bar
 */
$GLOBALS['bar'] = new test
 
/**
 * example of basic @global usage in a function
 * assume global variables "$foo" and "$bar" are already documented
 * @global bool used to control the weather
 * @global test used to calculate the division tables
 * @param bool $baz 
 * @return mixed 
 */
function function1($baz)
{
   global $foo,$bar;

   if ($baz)
   {
      $a = 5;
   } else
   {
      $a = array(1,4);
   }
   return $a;
}
```

# ignore
**语法**：`@ignore [<description>]`
**描述**：@ignore标记告诉phpDocumentor 不要处理与标记关联的结构元素。使用的一个示例可能是防止重复记录条件常量。
建议（但不要求）提供附加说明，说明为什么要忽略相关元素。

**示例**：
```php
<?php
 if ($ostest) {
     /**
      * This define will either be 'Unix' or 'Windows'
      */
     define("OS","Unix");
 } else {
     /**
      * @ignore
      */
     define("OS","Windows");
 }
```

# license
**语法**：`@license [<url>] [name]`
**描述**：@license标记为用户提供元素的许可证名称和URL
**适用**：引用(include)、页面(page)、函数(function)、定义(define)、类(class)、变量 (variable)、方法(method)
**示例**：
```php
<?php
/**
  * @license GPL
  * @license http://opensource.org/licenses/gpl-license.php GNU Public License
  */
class Test
{

}
```

# link
**语法**：`@link [URI] [<description>]` or inline `{@link [URI] [<description>]}`
**描述**：@link标记可用于定义结构元素之间的关系或链接，或者在内联使用时将长描述的一部分定义 到URI
**适用**：引用(include)、页面(page)、类(class)、函数(function)、定义(define)、方法(method)、变量 (variable)
**示例**：
普通标签：
```php
<?php
 /**
  * @link http://example.com/my/bar Documentation of Foo.
  *
  * @return integer Indicates the number of items.
  */
 function count()
 {
     <...>
 }
```
内联标签：
```php
<?php
/**
  * This method counts the occurrences of Foo.
  *
  * When no more Foo ({@link http://example.com/my/bar}) are given this
  * function will add one as there must always be one Foo.
  *
  * @return integer Indicates the number of items.
  */
 function count()
 {
     <...>
 }
```

# method
**语法**：`@method [return type] [name]([[type] [parameter]<, …>]) [<description>]`
**描述**：@method标记用于类包含 __call() 魔术方法并定义一些确定用途的情况。
**适用**：类（class）、接口（interface）
**示例**：
```php
<?php
/**
* show off @method
*
* @method int borp() borp(int $int1, int $int2) multiply two integers
*/
class Magician
{
    function __call($method, $params)
    {
        if ($method == 'borp') {
            if (count($params) == 2) {
                return $params[0] * $params[1];
            }
        }
    }
}
```

# package
**语法**：`@package [level 1]\[level 2]\[etc.]`
**描述**：
@package标记可以用作命名空间的对应物或补充。命名空间提供了结构元素的功能细分，其中@package标记可以提供逻辑细分，以哪种方式可以将元素与不同的层次结构分组。
**适用**：类(class)、页面（page）
**示例**：
文件级示例：
```php
<?php
/**
 * Page-Level DocBlock example.
 * This DocBlock precedes another DocBlock and will be parsed as the page-level.
 * Put your @package and @subpackage tags here
 * @package pagelevel_package
 */
/**
 * function bluh
 */
function bluh()
{
    return 0;
}
```
类级示例：
```php
<?php
/**
* class bluh
* class-level DocBlock example.
* @package applies_to_bluh
*/
class bluh
{
    /**
    * This variable is parsed as part of package applies_to_bluh
    */
    var $foo;
    
    /**
    * So is this function
    */
    function bar()
    {
    }
}
```

# param
**语法**：`@param [type] [name] [<description>]`
**描述**：
使用@param标记，可以记录函数或方法的单个参数的类型和功能。如果提供它必须包含一个 类型来表明预期的内容; 另一方面，描述是可选的，但在复杂结构的情况下，例如关联数组，则推荐使用。
**适用**：方法(method)、函数(function)
**示例**：
```php
<?php
 /**
  * Counts the number of items in the provided array.
  *
  * @param mixed[] $items Array structure to count the elements of.
  *
  * @return int Returns the number of elements.
  */
 function count(array $items)
 {
     <...>
 }
```

# property
**语法**：`@property [type] [name] [<description>]`
**描述**：@property标记用于类包含 __get()和__set()魔术方法并允许特定名称的情况。
**适用**：类（class）、接口（interface）
**示例**：
```php
<?php
/**
 * show off @property, @property-read, @property-write
 *
 * @property mixed $regular regular read/write property
 * @property-read int $foo the foo prop
 * @property-write string $bar the bar prop
 */
class Magician
{
    private $_thingy;
    private $_bar;
    
    function __get($var)
    {
        switch ($var) {
            case 'foo' :
                return 45;
            case 'regular' :
                return $this->_thingy;
        }
    }
    
    function __set($var, $val)
    {
        switch ($var) {
            case 'bar' :
                $this->_bar = $val;
                break;
            case 'regular' :
                if (is_string($val)) {
                    $this->_thingy = $val;
                }
        }
    }
}
```

# return
**语法**：`@return [type] [<description>]`
**描述**：@return标记用于记录函数或方法的返回值。
**适用**：方法(method)、函数(function)
**示例**：
返回多种类型：
```php
<?php
/**
  * @return string|null The label's text or null if none provided.
  */
 function getLabel()
 {
     <...>
 }

 /**
 * example of basic @return usage
 * @return mixed 
 */
function function1($baz)
{
   if ($baz)
   {
      $a = 5;
   } else
   {
      $a = array(1,4);
   }
   return $a;
}
```

Type表示的值可以是数组。必须按照以下选项之一的格式定义类型：

+ 未指定，没有给出所表示数组的内容的定义。例：@return array

+ 如果指定包含单个类型，则Type定义会通知读者每个数组元素的类型。然后只需要一个Type作为给定数组的元素。
例： @return int[]

+ 请注意，mixed也是单一类型，使用此关键字可以指示每个数组元素包含任何可能的类型。

+ 如果指定包含多个类型，则Type定义会通知读者每个数组元素的类型。每个元素可以是任何给定类型。例：@return (int|string)[]

# see
**语法**：`@see [URI | FQSEN] [<description>]` or online `{@see [URI | FQSEN] [<description>]}`
**描述**：
@see标记可用于定义对其他结构元素或URI 的引用 。

定义对另一个结构元素的引用时，可以通过附加双冒号并提供该元素的名称（也称为FQSEN）来提供特定元素。

@see仅显示元素文档的链接。如果要显示超链接，请使用@link或inline@link

**适用**：全局变量(global variable)、引用(include)、函数(function)、定义(define)、类(class)、变量(variable)、方法(method)、页面(page)

**示例**：
```php
<?php
/**
* class 1
* 
* example of use of the :: scope operator
* @see subclass::method()
*/
class main_class
{
    /**
    * example of linking to same class, outputs <u>main_class::parent_method()</u>
    * @see parent_method
    */
    var foo = 3;
    
    /**
    * subclass inherits this method.
    * example of a word which is either a constant or class name, in this case a classname
    * @see subclass
    * @see subclass::$foo
    */
    function parent_method()
    {
        if ($this->foo==9) die;
    }
}
    
/**
* this class extends main_class.
* example of linking to a constant, and of putting more than one element on the same line
* @see main_class, TEST_CONST
*/
subclass extends main_class
{
    /**
    * example of same class lookup - see will look through parent hierarchy to
    * find the method in { @link main_class}
    * the above inline link tag will parse as <u>main_class</u>
    * @see parent_method()
    */
    var $foo = 9;
}
     
    define("TEST_CONST","foobar");
```

# since
**语法**：`@since [version] [<description>]`
**描述**：@since标记可用于指示特定结构元素的版本可用。
**适用**：全局变量(global variable)、引用(include)、常量(constant)、函数(function)、定义(define)、类(class)、变量 (variable)、方法(method)、页面(page)
**示例**：
```php
<?php
/**
* Page-level DocBlock
* @package BigImportantProjectWithLotsofVersions
* @version 72.5
*/
/**
* function datafunction
* @since Version 21.1
*/
function datafunction()
{
    ...
}
```

# source
**语法**：`@source [<start-line> [<number-of-lines>]] [<description>]`
**描述**：
@source标记可以用于通过呈现源代码来传达结构元素的实现 ，或者更典型地 - 它的一部分。

如果指定，起始行必须是正整数。计数从结构元素的主体开始的线（即带有开口支撑的线）开始；如果未指定起始行，则结构元素的来源将完整呈现。

该行号可以可选地后跟另一个正整数，指定从起始行开始呈现的行数。如果省略，则结构元素的源从起始线到其末端（即具有右括号的线）呈现。

**示例**：
```php
<?php
/**
  * @source 2 1 Check that ensures lazy counting.
  */
function count()
{
    if (null === $this->count) {
        <...>
    }
}
```

# throws
**语法**：`@throws [Type] [<description>]`
**描述**：@throws标记可用于指示结构元素可能抛出特定类型的错误，提供的类型必须表示类Exception或其任何子类的对象。
**示例**：
```php
<?php
 /**
  * Counts the number of items in the provided array.
  *
  * @param mixed[] $array Array structure to count the elements of.
  *
  * @throws InvalidArgumentException if the provided argument is not of type
  *     'array'.
  *
  * @return int Returns the number of elements.
  */
 function count($items)
 {
     <...>
 }
 ```

# todo
**语法**：`@todo [description]`
**描述**：@todo记录对尚未实现的元素的计划更改。
**适用**：任何
**示例**：
```php
<?php
/**
 * Page-level DocBlock
 * @package unfinished
 * @todo finish the functions on this page
 */
/**
 * function datafunction
 * @todo make it do something
 */
function datafunction()
{
    return 0;
}
```

# uses
**语法**：`@uses [ FQSEN ] [<description>]`
**描述**：
@uses标签用于描述当前元素与任何其他结构元素之间的消费关系 。

@uses类似于@see（有关格式和结构的详细信息，请参阅@see的文档）。@uses标记与@see的不同之处在于@see是单向链接，这意味着包含@see标记的文档包含指向其他结构元素或URI的链接，但不暗示链接。

文档生成器应该在接收元素的文档中创建一个@ used-by标记，该标记链接回与@uses标记关联的元素。

定义对另一个结构元素的引用时，您可以通过提供FQSEN来引用特定元素 。

@uses标签COULD附加了一个描述，以提供有关目标元素用法的更多信息。

**示例**：
示例一：
```php
<?php
/**
* class 1
* 
*/
class main_class
{
    /**
    * @var integer 
    */
    var foo = 3;
    
    /**
    * subclass inherits this method.
    * example of a word which is either a constant or class name,
    * in this case a classname
    * @uses subclass sets a temporary variable
    * @uses subclass::$foo this is compared to TEST_CONST
    * @uses TEST_CONST compared to subclass::$foo, we
    *                   die() if not found
    */
    function parent_method()
    {
        if ($this->foo==9) die;
        $test = new subclass;
        $a = $test->foo;
        if ($a == TEST_CONST) die;
    }
}
    
/**
* this class extends main_class.
*/
subclass extends main_class
{
    /**
    * @var integer 
    */
    var $foo = 9;
}
    
define("TEST_CONST","foobar");
```
示例二：
```php
<?php
/**
* class 1
* 
*/
class main_class
{
    /**
    * @var integer 
    */
    var foo = 3;
    
    /**
    * subclass inherits this method.
    * example of a word which is either a constant or class name,
    * in this case a classname
    * @uses subclass sets a temporary variable
    * @uses subclass::$foo this is compared to TEST_CONST
    * @uses TEST_CONST compared to subclass::$foo, we
    *                   die() if not found
    */
    function parent_method()
    {
        if ($this->foo==9) die;
        $test = new subclass;
        $a = $test->foo;
        if ($a == TEST_CONST) die;
    }
}
    
/**
* this class extends main_class.
* @usedby main_class::parent_method() sets a temporary variable
*/
subclass extends main_class
{
    /**
    * @var integer 
    * @usedby main_class::parent_method() this is compared to TEST_CONST
    */
    var $foo = 9;
}
    
/**
* @usedby main_class::parent_method() compared to subclass::$foo, we
*                                      die() if not found
*/
define("TEST_CONST","foobar");
```

# var
**语法**：`@var [“Type”] [$element_name] [<description>]`
**描述**：
@var标记定义了属性值表示的数据类型。

@var标记必须包含它所记录的元素的名称。例外情况是属性声明仅引用单个属性。在这种情况下，可以省略属性的名称。

当复合语句用于定义一系列属性时使用此方法。这样的复合语句只能有一个DocBlock，而表示几个项目。

**示例**：
```php
class Foo
{
  /**
    * @var string|null Should contain a description 
    */
  protected $description = null;
}
```
记录复合语句:
```php
class Foo
{
  /**
   * @var string $name        Should contain a description
   * @var string $description Should contain a description
   */
  protected $name, $description;
}
```

# version
**语法**：`@version [<vector>] [<description>]`
**描述**：@version标记表示结构元素的当前版本
**示例**：
```php
/**
 * example of @version tag with CVS tag
 * @version $Id: tags.version.pkg,v 1.2 2006-04-29 04:08:27 cellog Exp $;
 */
function datafunction()
{
    return 0;
}
    
/**
 * Custom version string
 * @version customversionstring1.0
 */
class blah
{

}
```
# 更多标签内容查看
http://manual.phpdoc.org/HTMLframesConverter/default/?spm=a2c4e.11153940.blogcont691719.9.12921de8uyH6wq

https://docs.phpdoc.org/references/phpdoc/index.html