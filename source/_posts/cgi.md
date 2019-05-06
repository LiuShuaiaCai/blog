---
title: 学习 CGI 和 Fast CGI
date: 2017-04-10 11:47:32
categories: PHP
tags: ['CGI']
---
## 1、了解CGI
CGI(Common Gateway Interface)：通用网关接口
CGI应用是通过标准的POSIX流(stdin,stdout,stderr和环境变量)加上环境变量，来与HTTP服务器进行通信。
功能：绝大数的cgi程序被用来解释、处理来自表单的输入信息，在服务器产生相应的信息的处理，或将相应的信息反馈给浏览器。
<!-- more -->
#### 1.1、工作原理：
（1）、 浏览器通过HTML表单或者超链接请求指向一个CGI应用程序的UTL
（2）、 web服务器接收用户请求并交给CGI程序处理，包括查询数据库、计算数值或调用系统中其他程序
（3）、 CGI程序把处理结果传送给web服务器
（4）、 web服务器把结果返回给用户
#### 1.2、环境变量列表
* SERVER_NAME：运行CGI序为机器名或IP地址。
* SERVER_INTERFACE：WWW服务器的类型，如：CERN型或NCSA型。
+ SERVER_PROTOCOL：通信协议，应当是HTTP/1.0。
+ SERVER_PORT：TCP端口，一般说来web端口是80。
+ HTTP_ACCEPT：HTTP定义的浏览器能够接受的数据类型。
- HTTP_REFERER：发送表单的文件URL。（并非所有的浏览器都传送这一变量）
- HTTP_USER-AGENT：发送表单的浏览的有关信息。
* GETWAY_INTERFACE：CGI程序的版本，在UNIX下为 CGI/1.1。
* PATH_TRANSLATED：PATH_INFO中包含的实际路径名。
* PATH_INFO：浏览器用GET方式发送数据时的附加路径。
* SCRIPT_NAME：CGI程序的路径名。
* QUERY_STRING：表单输入的数据，URL中问号后的内容。
* REMOTE_HOST：发送程序的主机名，不能确定该值。
* REMOTE_ADDR：发送程序的机器的IP地址。
+ REMOTE_USER：发送程序的人名。
+ CONTENT_TYPE：POST发送，一般为application/xwww-form-urlencoded。
- CONTENT_LENGTH：POST方法输入的数据的字节数。
结构图如下：
![cgi](http://onx0p7mg5.bkt.clouddn.com/cgi.jpg)
每当客户请求CGI的时候，WEB服务器就请求操作系统生成一个新的CGI解释器进程(如php-cgi.exe)，CGI 的一个进程则处理完一个请求后退出，下一个请求来时再创建新进程。当然，这样在访问量很少没有并发的情况也行。可是当访问量增大，并发存在，这种方式就不 适合了。于是就有了fastcgi

## 2、了解Fast CGI
FastCGI像是一个常驻(long-live)型的CGI，它可以一直执行着，只要激活后，不会每次都要花费时间去fork一次（这是CGI最为人诟病的fork-and-execute 模式）
#### 2.1、Fast CGI原理
1、Web Server启动时载入FastCGI进程管理器（IIS ISAPI或Apache Module)
2、FastCGI进程管理器自身初始化，启动多个CGI解释器进程(可见多个php-cgi)并等待来自Web Server的连接。
3、当客户端请求到达Web Server时，FastCGI进程管理器选择并连接到一个CGI解释器。Web server将CGI环境变量和标准输入发送到FastCGI子进程php-cgi。
4、FastCGI子进程完成处理后将标准输出和错误信息从同一连接返回Web Server。当FastCGI子进程关闭连接时，请求便告处理完成。FastCGI子进程接着等待并处理来自FastCGI进程管理器(运行在Web Server中)的下一个连接。 在CGI模式中，php-cgi在此便退出了。
#### 2.2、缺点
Fast CGI因为是多进程，所以比CGI多线程消耗更多的服务器内存
