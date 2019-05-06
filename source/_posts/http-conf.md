---
title: 了解Apache的配置http.conf
date: 2017-04-18 15:50:06
categories: PHP
tags: Apache
---
最近想研究一下Apache的配置文件，顺便记录一下。
#### 1、ServerRoot "/xampp/apache"

    Apache运行的目录，服务启动之后自动将目录改变为当前目录，在后面使用到的所有相对路径都是想对这个目录下
    
<!-- more -->
#### 2、Listen 80

    服务器监听端口号
    
#### 3、KeepAlive On|Off

    保持连接活跃，大家都知道客户端和服务器端的连接是通过TCP协议三次握手创建连接，请求结束后会立即断开连接，下次请求会重新建立连
    接。每次请求都要新建一个连接而加重服务器的负担。
    On：
        用户完成一次访问后，不会立即断开连接，如果还有请求，那么会继续在这一次 TCP 连接中完成，而不用重复建立新的 TCP 连接和关
        闭TCP 连接，可以提高用户访问速度。
        
    Off：如上面所说
    
#### 4、KeepAliveTimeout 5

    保持活跃连接的时间。这个参数只有在KeepAlive开启时起作用，改值的设置影响服务器的性能。
    KeepAliveTimeout 太小发挥不了持续连接的作用；太大了，持续连接迟迟不断， 浪费TCP连接数不说，更糟糕的是系统中的 httpd 进程数
    目会因此不断增加， 使得系统负载升高，甚至会导致服务器失去响应。
    
    可以通过access_log统计出连续HTTP请求出现的次数、间隔时间、访问量， 以确定 MaxKeepAliveRequests 和 KeepAliveTimeout 的值
    
#### 5、MaxKeepAliveRequests 100

    每个连接的最大请求数量。如果设为0，将不限制请求的数量，建议设置的大一点，确保服务器的性能最优。
    
#### 6、Timeout 300

    请求超时的时间。当KeepAlive 设置为Off时起作用，当KeepAlive为On时，KeepAliveTimeout为超时时间

#### 7、系统默认模块
##### 7.1、进程模块（prefork MPM）

    <IfModule mpm_prefork_module>
        StartServers             5      //开始服务时启动5个进程
        MinSpareServers          5      //最少空闲5个进程
        MaxSpareServers         10      //最多空闲10个进程
        MaxRequestWorkers      250      //允许启动的服务器进程的最大数目
        MaxConnectionsPerChild   0      //每个子进程在其生存期内允许伺服的最大请求数量
    </IfModule>

表示为每个访问启动一个进程（即当有多个连接公用一个进程的时候，在同一时刻只能有一个获得服务）。如下图：

![prefork](http://onx0p7mg5.bkt.clouddn.com/prefork.jpg)

    优点：成熟稳定，兼容所有新老模块。同时，不需要担心线程安全的问题。（我们常用的mod_php，PHP的拓展不需要支持线程安全）
    缺点：一个进程相对占用更多的系统资源，消耗更多的内存。而且，它并不擅长处理高并发请求，在这种场景下，它会将请求放进队列中，一直等到有可用进程，请求才会被处理。
    
MaxRequestsPerChild：每个子进程在其生存期内允许伺服的最大请求数量，默认为10000.到达MaxRequestsPerChild的限制后，子进程将会结束。如果MaxRequestsPerChild为"0"，子进程将永远不会结束。将MaxRequestsPerChild设置成非零值有两个好处：
1.可以防止(偶然的)内存泄漏无限进行，从而耗尽内存。
2.给进程一个有限寿命，从而有助于当服务器负载减轻的时候减少活动进程的数量。
##### 7.2、进程、线程模块（worker MPM）

    <IfModule mpm_event_module>
        StartServers             3
        MinSpareThreads         75
        MaxSpareThreads        250
        ThreadsPerChild         25      //每个子进程生存期间常驻执行线程数，子线程建立之后将不再增加
        MaxRequestWorkers      400
        MaxConnectionsPerChild   0
    </IfModule>
    
worker模式使用了多进程和多线程的混合模式。

    优点：占据更少的内存，高并发下表现更优秀，如果一个线程挂了，不会影响整个进程，只会影响局部。
    
    缺点：必须考虑线程安全的问题，因为多个子线程是共享父进程的内存地址的。如果使用keep-alive的长连接方式，某个线程会一直被占据，也许中间几乎没有请求，需要一直等待到超时才会被释放。如果过多的线程，被这样占据，也会导致在高并发场景下的无服务线程可用。（该问题在prefork模式下，同样会发生）

注：keep-alive的长连接方式，是为了让下一次的socket通信复用之前创建的连接，从而，减少连接的创建和销毁的系统开销。保持连接，会让某个进程或者线程一直处于等待状态，即使没有数据过来。

##### 7.3、event MPM
这个是Apache中最新的模式，在现在版本里的已经是稳定可用的模式。它和worker模式很像，最大的区别在于，它解决了keep-alive场景下，长期被占用的线程的资源浪费问题（某些线程因为被keep-alive，空挂在哪里等待，中间几乎没有请求过来，甚至等到超时）。event MPM中，会有一个专门的线程来管理这些keep-alive类型的线程，当有真实请求过来的时候，将请求传递给服务线程，执行完毕后，又允许它释放。这样增强了高并发场景下的请求处理能力。

event MPM在遇到某些不兼容的模块时，会失效，将会回退到worker模式，一个工作线程处理一个请求。官方自带的模块，全部是支持event MPM的。

注意一点，event MPM需要Linux系统（Linux 2.6+）对EPoll的支持，才能启用。

还有，需要补充的是HTTPS的连接（SSL），它的运行模式仍然是类似worker的方式，线程会被一直占用，知道连接关闭。部分比较老的资料里，说event MPM不支持SSL，那个说法是几年前的说法，现在已经支持了。

摘自: [http://blog.jobbole.com/91920/](http://blog.jobbole.com/91920/)

#### 8、LoadModule xxxxxx
启动时加载的模块

#### 9、Include conf/extra/*.conf
需要加载的配置文件

#### 10、切换身份

    User daemon
    Group daemon
    
启动服务后转换的身份，在启动服务时通常以root身份，然后转换身份，这样增加系统安全
#### 11、ServerAdmin
ServerAdmin postmaster@localhost    管理员的邮箱
#### 12、ServerName
ServerName localhost:80     服务器名称

***
下面的比较重要了。。。
#### 13、DocumentRoot
DocumentRoot "/xampp/htdocs"    //根目录
#### 14、目录的权限设置

    <Directory "/xampp/htdocs">
        Options FollowSymLinks Includes ExecCGI //不显示目录
        AllowOverride All //表示允许这个目录下的访问控制文件.htaccess来改变这里的配置,None:不允许
        Require all granted //允许所有用户访问
        Order Deny,Allow    //对页面的访问控制顺序
        Allow from All
    </Directory>
    
是否显示文件的目录：
显示目录：Options Indexes FollowSymLinks
不显示目录：Options Includes FollowSymLinks ExecCGI
目录、文件的访问权限：
2.2

    Order Allow,Deny
    Allow from All
    Deny from IP1   //禁止IP1对该目录的访问
   
2.4

    Require all granted //允许所有用户访问
    Require all denied //拒绝所有用户访问
    Require host google.com //允许特定域名主机的访问
    Require ip 192.120 192.168.100 192.168.1.1  //允许特定IP或者IP段的访问
    Require not ip 192.168.1.1  //拒绝来自特定IP或IP段的访问请求
    
 例：允许所有访问请求，但拒绝某些User-Agent的访问请求（通过User-Agent屏蔽垃圾网络爬虫）
使用mod_setenvif通过正则表达式匹配来访请求的User-Agent，并设置内部环境变量BADBOT，最后拒绝BADBOT的访问请求。

    <Directory xxx/www/yoursite>
        SetEnvIfNoCase User-Agent ".*(FeedDemon|JikeSpider|AskTbFXTV|CrawlDaddy|Feedly|Swiftbot|ZmEu|oBot).*" BADBOT
        SetEnvIfNoCase User-Agent "brandwatch" BADBOT
        SetEnvIfNoCase User-Agent "rogerbot" BADBOT
        <RequireAll>
            Require all granted
            Require not env BADBOT
            Require not ip 192.168.100.1
        </RequireAll>
    </Directory>
    
#### 15、日志
LogLevel warn：Apache的日志级别
ErrorLog "logs/error.log"：错误日志存放的位置
LogFormat 日志的格式：
    
    LogFormat "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\"" combined
    LogFormat "%h %l %u %t \"%r\" %>s %b" common
    
CustomLog "logs/access.log" combined ：说明日志的记录位置
#### 16、ServerSignature
ServerSignature On  定义当客户请求的网页不存在时，或者错误时是否提示apache的版本信息，Off为关闭
#### 17、别名
Alias:定义一些不在DocumentRoot目录下的文件，而可以将其映射到网页的根目录下，这也是访问其他目录的一种方法，但声明时要在目录后面加上'/'。

    Alias /webpath /full/filesystem/path

ScriptAlias:对CGI（Common Gateway Interface）模块的别名，与Alias相似

    ScriptAlias /cgi-bin/ "/xampp/cgi-bin/"
    
#### 18、其他
HostnameLookups off是否进行域名的解析，一般关掉,,,会占用资源，而且一般的ip地址没有反向解析，或者不允许；apache有一个日志叫XXX，里面记录了每个客户端的访问信息，包括ip地址，那些请求，访问了那些页面···如果开启了，apache会将这些源ip地址解析到域名
ServerTokens Full：默认地，服务器HTTP响应头会包含apache和php版本号，Prod禁止发送版本号


以上是大致看了一下http.conf的文件，了解了一下基本的配置以及配置的作用。