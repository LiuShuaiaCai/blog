---
title: 实际项目中的常用的JS函数总结
date: 2017-04-09 23:50:35
categories: 前端
tags: ['JS']
---
## 1、JS去除所有的空格
```javascript
 replace(/\s+/g,'');
```
<!-- more -->
\s:匹配任何不可见字符，空格、制表符、换页符等等，相当于[ \f\n\r\t\v]。
g:全局匹配
## 2、JS检查一个字符串中知否包含另一个字符串
#### 2.1、test查找
```javascript
var patt = new RegExp('hello');  //or var patt = /hello/; 要查找的字符串
var str = 'hello world';         //在str中查找
var bool = patt.test(str);       //返回值
```
#### 2.2、exec查找
exec() 返回第一个匹配的值,和test一样 
```javascript
var str = 'hello world';
var patt = /hello/g;
var array = patt.exec(str);       //返回数组
```
#### 2.3、match查找
```javascript
var str = 'hello world';
var patt = /hello/g;
var array = str.match(patt);    //返回数组
```
#### 2.4、search查找
Search()返回与正则表达式查找内容匹配的第一个子字符串的位置（偏移位）
```javascript
var str = 'hello world';
var res = str.search('world'); //res=6
var res = str.search(/world/g); //res=1
```
用正则匹配和用字符串搜索的结果可能会不一样
#### 2.5、indexOf查找
indexOf()返回某个指定的字符串值在字符串中首次出现的位置。如果没有则返回-1 
```javascript
var str = 'Hello world, welcome to the universe.';
var n = str.indexOf('welcome');   //n=13
```
## 3、JS割成字符串
函数：split() 将字符串分割成数组
```javascript
var str = 'hello world php';
var arr = str.split(' '); //用指定字符分割
var arr2 = str.split('/\s+/g') //用正则分割
```
## 4、JS页面跳转刷新
#### 4.1、页面跳转
    
    前进：history.go(1) 
    后退：history.go(-1) or history.back() //只返回，不刷新
    返回并刷新页面:location.replace(document.referrer);
                document.referrer //前一个页面的URL
    
#### 4.2、页面刷新
1、js刷新

    刷新：history.go(0) or window.location.reload();
    
2、页面自动刷新：把如下代码加入<head>区域中

    <meta http-equiv="refresh" content="20">
    <meta http-equiv="refresh" content="20;url=http://www.baidu.com">
    
3、JS刷新框架的脚本语句 

    //刷新包含该框架的页面用  
    <script language=JavaScript>
       parent.location.reload();
    </script>
    //子窗口刷新父窗口
    <script language=JavaScript>
        self.opener.location.reload();
    </script>
    (　或　<a href="javascript:opener.location.reload()">刷新</a>   )
    //刷新另一个框架的页面用  
    <script language=JavaScript>
       parent.另一FrameID.location.reload();
    </script>
    
 ## 5、JS打开页面自动跳到锚点
 ```javascript
 window.onload=function(){
    location.hash='你锚点的名称';
 }
 ```
## 6、JS判断多选框是否被选中
    
    if ($(“#checkbox-id”)get(0).checked) {
        // do something
    }
    if($(‘#checkbox-id’).is(‘:checked’)) {
        // do something
    }
    if ($(‘#checkbox-id’).attr(‘checked’)) {
        // do something
    }