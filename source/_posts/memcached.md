---
title: Memcached的工作原理及内存分配
date: 2017-04-20 14:41:21
categroies: PHP
tags: memcached
---
## 1、Memcached的原理
Memcache是一个高性能的分布式的内存对象缓存系统，通过在内存里维护一个统一的巨大的hash表，它能够用来存储各种格式的数据，包括图像、视频、文件以及数据库检索的结果等。简单的说就是将数据调用到内存中，然后从内存中读取，从而大大提高读取速度。
Memcache是项目的名称，Memcached是一个程序。
<!-- more -->
## 2、Memcached的应用
    1>、处理数据库高并发的读写
    2>、对海量数据的处理
## 3、事件处理
Memcached基于libevent库进行事件处理。

    * libevent是个事件通知库，将系统的kqueue等事件处理功能封装成一个统一的接口，这样即使对服务器的连接数增加，也能发挥O(1)的性能。

## 4、内存管理 
#### 4.1、基础知识（[摘自](http://www.cnblogs.com/coder2012/p/4458015.html)）

    * slab：内存块是memcached一次申请内存的最小单元，在memcached中一个slab的默认大小为1M；
    * slabclass：特定大小的chunk的组。  
    * chunk：缓存的内存空间，一个slab被划分为若干个chunk；  
    * item：存储数据的最小单元，每一个chunk都会包含一个item；  
    * factor:增长因子，默认为1.25，相邻slab中的item大小与factor成比例关系；

#### 4.2、基本原理（[摘自](http://www.cnblogs.com/coder2012/p/4458015.html)）
* memcached使用预分配方法，避免频繁的调用malloc和free；

* memcached通过不同的slab来管理不同chunk大小的内存块，从而满足存储不同大小的数据。

* slab的申请是通过在使用item时申请slab大小的内存空间，然后再把内存切割为大小相同的item，挂在到slab的未使用链表上。

* 过期和被删除item并不会被free掉，memcached并不会删除已经分配的内存；

* Memcached会优先使用已超时的记录空间，通过LRU算法；

* memcached使用lazy expiration来判断元素是否过期，所以过期监视上不会占用cpu时间。
    
#### 4.3、分配内存（[可参考](http://www.open-open.com/lib/view/open1376034527667.html)）
Memcached使用[slab](https://www.ibm.com/developerworks/cn/linux/l-linux-slab-allocator/#icomments)分配算法保存数据，分配内存。
Memcached 的内存分配以page为单位，默认情况下一个page是1M，可以通过-I参数在启动时指定。
储存变量时，Memcached根据slab算法检查是否有相同的slab类，如果有空闲的块，就把数据储存在该块上，没有则申请新的内存。
Memcached的存储结构：
![结构](http://onx0p7mg5.bkt.clouddn.com/272357235313577.png)

#### 4.4、淘汰数据
Memcached使用LRU（Least Recently Used）近期最少使用算法将数据移除内存。
    
    * LRU：内存管理的一种页面置换算法

#### 4.5、memcached服务器增多
Memcached在添加或者减少服务器的时候，服务端的缓存将会失效，Memcached采用Consistent hashing算法，当实例数量的变化将只可能导致其中的一小部分键的哈希值发生改变。
#### 4.6、虚拟节点（[摘自](http://www.111cn.net/sys/linux/58748.htm)）
Consistent hashing算法在服务节点太少时，容易因为节点分部不均匀而造成数据倾斜问题。例如我们的系统中有两台 server，其环分布如下：

![virtual](http://onx0p7mg5.bkt.clouddn.com/20140312125612748.png)

此时必然造成大量数据集中到Server 1上，而只有极少量会定位到Server 2上。为了解决这种数据倾斜问题，一致性哈希算法引入了虚拟节点机制，即对每一个服务节点计算多个哈希，每个计算结果位置都放置一个此服务节点，称为虚拟节点。

具体做法可以在服务器ip或主机名的后面增加编号来实现。例如上面的情况，我们决定为每台服务器计算三个虚拟节点，于是可以分别计算“Memcached Server 1#1”、“Memcached Server 1#2”、“Memcached Server 1#3”、“Memcached Server 2#1”、“Memcached Server 2#2”、“Memcached Server 2#3”的哈希值，于是形成六个虚拟节点：
![virtual2](http://onx0p7mg5.bkt.clouddn.com/20140312125616365.png)

## 5、错误指令
|指令|说明|
|:----|:-----|
|ERROR|普通错误信息|
|CLIENT_ERROR|客户端错误|
|SERVER_ERROR|服务器端错误|

    以上是我搜了好多资料，不是很理解内存的分配原理，用的话大家都会用