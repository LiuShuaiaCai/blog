---
title: apache性能测试工具ab
date: 2017-04-17 12:37:56
categories: Tool
tags: ['调试工具']
---
## 1、ab原理
ab是apachebench的缩写
ab命令会创建多个并发访问线程，对同一个URL访问来测试apache的负载压力。测试目标是URL。
同样适用于Nginx、Lighthttp、Tomcat、IIS等其它服务器
ab命令不会占用很高的CPU，也不会占用很多内存，但却给目标服务器造成巨大的负载，如果负载太多，可能导致目标服务器死机，其原理类似CCI攻击，所以大家测试的时候需要注意。
<!-- more -->
## 2、ab的参数
Apache自身已经带了ab工具，所以不需要安装（Apache的安装自己可以百度了）。
ab的参数比较多，常用的用 -c 和 -n ，其它的自己可以去了解一下（ab --help）。
以下是对参数的说明
    
    -n在测试会话中所执行的请求个数。默认时，仅执行一个请求。
    
    -c一次产生的请求个数。默认是一次一个。
    
    -t测试所进行的最大秒数。其内部隐含值是-n 50000，它可以使对服务器的测试限制在一个固定的总时间以内。默认时，没有时间限制。
    
    -p包含了需要POST的数据的文件。
    
    -P对一个中转代理提供BASIC认证信任。用户名和密码由一个:隔开，并以base64编码形式发送。无论服务器是否需要(即, 是否发送了401认证需求代码)，此字符串都会被发送。
    
    -T POST数据所使用的Content-type头信息。
    
    -v设置显示信息的详细程度-4或更大值会显示头信息，3或更大值可以显示响应代码(404,200等),2或更大值可以显示警告和其他信息。
    
    -V显示版本号并退出。
    
    -w以HTML表的格式输出结果。默认时，它是白色背景的两列宽度的一张表。
    
    -i执行HEAD请求，而不是GET。
    
    -x设置<table>属性的字符串。
    
    -X对请求使用代理服务器。
    
    -y设置<tr>属性的字符串。
    
    -z设置<td>属性的字符串。
    
    -C对请求附加一个Cookie:行。其典型形式是name=value的一个参数对，此参数可以重复。
    
    -H对请求附加额外的头信息。此参数的典型形式是一个有效的头信息行，其中包含了以冒号分隔的字段和值的对(如,"Accept-Encoding:zip/zop;8bit")。
    
    -A对服务器提供BASIC认证信任。用户名和密码由一个:隔开，并以base64编码形式发送。无论服务器是否需要(即,是否发送了401认证需求代码)，此字符串都会被发送。
    
    -h显示使用方法。
    
    -d不显示"percentage served within XX [ms] table"的消息(为以前的版本提供支持)。
    
    -e产生一个以逗号分隔的(CSV)文件，其中包含了处理每个相应百分比的请求所需要(从1%到100%)的相应百分比的(以微妙为单位)时间。由于这种格式已经“二进制化”，所以比'gnuplot'格式更有用。
    
    -g把所有测试结果写入一个'gnuplot'或者TSV(以Tab分隔的)文件。此文件可以方便地导入到Gnuplot,IDL,Mathematica,Igor甚至Excel中。其中的第一行为标题。
    
    -i执行HEAD请求，而不是GET。
    
    -k启用HTTP KeepAlive功能，即在一个HTTP会话中执行多个请求。默认时，不启用KeepAlive功能。
    
    -q如果处理的请求数大于150，ab每处理大约10%或者100个请求时，会在stderr输出一个进度计数。此-q标记可以抑制这些信息。

## 3、ab的性能指标
在性能测试中以下几个指标比较重要：
#### 3.1吞吐率

    吞吐率（Requests pre second）：服务器并发处理能力的量化描述，单位reqs/s，是指在某个并发用户数下单位时间内处理的请求数。
    \* 吞吐率是基于并发用户数的：
    a、吞吐率合并发用户数相关
    b、不同的并发用户数下，吞吐率一般是不相同的

#### 3.2、并发连接数

    并发连接数（The number of concurrent connections）：某个时刻服务器所接受的请求数目，简单的说就是一个回话

#### 3.3、并发用户数

    并发用户数（Concurrency Level）：请求的用户数量，一个用户可能同时产生多个回话（连接数）。
    在HTTP/1.1下，IE7支持两个并发连接，IE8支持6个并发连接，FireFox3支持4个并发连接，所以相应的，我们的并发用户数就得除以这个基数。

#### 3.4、用户平均请求的等待时间

    用户平均请求的等待时间（Time pre request）的计算方法：
    处理完成所有请求所花费的时间/（总请求数/并发用户数），即：
    Time per request=Time taken for tests/（Complete requests/Concurrency Level）

#### 3.5、服务器平均请求等待时间

    服务器平均请求等待时间（Time per request:across all concurrent requests）计算方法：
    处理完成所有请求数所花费的时间/总请求数，即：
    Time taken for/testsComplete requests

## 4、ab的使用
常用命令： ab -c 并发数 -n 总的请求数 URL
下面以百度为例；来测试一下（对不住了=_=）,还有就是ab不支持HTTPS。
```php
[root@VM_161_199_centos bin]# ./ab https://www.baidu.com/
This is ApacheBench, Version 2.3 <$Revision: 1757674 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking www.baidu.com (be patient).....done


Server Software:        bfe/1.0.8.18
Server Hostname:        www.baidu.com
Server Port:            443
SSL/TLS Protocol:       TLSv1.2,ECDHE-RSA-AES128-GCM-SHA256,2048,128
TLS Server Name:        www.baidu.com

Document Path:          /
Document Length:        227 bytes

Concurrency Level:      1
Time taken for tests:   0.028 seconds
Complete requests:      1
Failed requests:        0
Total transferred:      1033 bytes
HTML transferred:       227 bytes
Requests per second:    35.17 [#/sec] (mean)
Time per request:       28.432 [ms] (mean)
Time per request:       28.432 [ms] (mean, across all concurrent requests)
Transfer rate:          35.48 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:       22   22   0.0     22      22
Processing:     7    7   0.0      7       7
Waiting:        7    7   0.0      7       7
Total:         28   28   0.0     28      28
```
在模仿10个用户，发送100条请求
```php
[root@VM_161_199_centos bin]# ./ab -c 10 -n 100 https://www.baidu.com/
This is ApacheBench, Version 2.3 <$Revision: 1757674 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking www.baidu.com (be patient).....done


Server Software:        bfe/1.0.8.18
Server Hostname:        www.baidu.com
Server Port:            443
SSL/TLS Protocol:       TLSv1.2,ECDHE-RSA-AES128-GCM-SHA256,2048,128
TLS Server Name:        www.baidu.com

Document Path:          /
Document Length:        227 bytes

#表示并发用户数，这是我们设置的参数之一
Concurrency Level:      10
#整个测试持续的时间
Time taken for tests:   0.482 seconds
#完成的请求数量
Complete requests:      100
#失败的请求数量
Failed requests:        0
#整个过程中的网络传输量
Total transferred:      103296 bytes
#整个过程中的HTML内容传输量
HTML transferred:       22700 bytes
#最重要的指标之一，吞吐率-每秒请求数，后面括号中的mean表示这是一个平均值
Requests per second:    207.58 [#/sec] (mean)
#最重要的指标之二，用户平均请求等待时间，后面括号中的mean表示这是一个平均值
Time per request:       48.174 [ms] (mean)
#最重要的指标之三，服务器平均请求等待时间
Time per request:       4.817 [ms] (mean, across all concurrent requests)
# 平均每秒网络上的流量，可以帮助排除是否存在网络流量过大导致响应时间延长的问题
Transfer rate:          209.40 [Kbytes/sec] received

#网络上消耗的时间的分解： 
Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:       20   36   8.6     35      60
Processing:     6   10   5.3      8      30
Waiting:        6   10   4.2      8      28
Total:         31   46   8.4     45      69

 #整个场景中所有请求的响应情况。在场景中每个请求都有一个响应时间，
 #其中50％的用户响应时间小于45毫秒，
 #66％的用户响应时间小于49毫秒，
 #最大的响应时间小于69毫秒。
 #对于并发请求，cpu实际上并不是同时处理的，而是按照每个请求获得的时间片逐个轮转处理的，所以基本上第一个Time per request时间约等于第二个Time per request时间乘以并发请求数。
Percentage of the requests served within a certain time (ms)
  50%     45
  66%     49
  75%     50
  80%     52
  90%     60
  95%     62
  98%     68
  99%     69
 100%     69 (longest request)

```
以上是压力测试的对比，主要关注一下几个地方：
* 整个测试持续的时间
Time taken for tests:   0.482 seconds
* 最重要的指标之一，吞吐率-每秒请求数，后面括号中的mean表示这是一个平均值
Requests per second:    207.58 [#/sec] (mean)
+ 最重要的指标之二，用户平均请求等待时间，后面括号中的mean表示这是一个平均值
Time per request:       48.174 [ms] (mean)
- 最重要的指标之三，服务器平均请求等待时间
Time per request:       4.817 [ms] (mean, across all concurrent requests)
