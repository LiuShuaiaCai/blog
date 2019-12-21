---
title: RPC学习总结
date: 2019-12-21 12:49:56
categories: RPC
tags: []
---
学习背景：由于公司内部项目之间的相互调用很多，并且很慢，有时会导致我们项目的接口超时，所以就决定使用RPC替换之前的REST请求。
<!--more-->

## 1、什么是RPC

`RPC`（Remote Procedure Call）远程过程调用，是一种通过网络从远程计算机程序上请求服务，而不需要了解底层网络技术的“协议”。

简单的说就是对 <span style='color:cornflowerblue'>一个服务器能够直接调用另一台服务器方法</span> 的封装。

<span style='color:darkgoldenrod'>备注：“协议”之所以加上引号是因为不太确定RPC是不是一种真的协议，也有人说它是一种技术思想而非一种规范或者协议。</span>

## 2、RPC执行流程

![RPC](/images/rpc.jpg)
> 执行流程如下（[WIKI](https://wiki.tw.wjbk.site/wiki/%E9%81%A0%E7%A8%8B%E9%81%8E%E7%A8%8B%E8%AA%BF%E7%94%A8))：

    1、客户端（Client）接收到请求，调用客户端Stub。
    2、客户端存根（Client Stub）将这些方法、参数进行序列化（serialize），常见方式：XML、JSON、二进制编码。
    3、客户端（Client）通过网络（NetWork）把包装后的信息发送到服务端（Service）。
    4、服务端（Service）接收到消息，把消息发送到服务端存根（Service Stub）。
    5、服务端存根（Service Stub）把接收到的消息进行反序列化（unserialize）。
    6、服务端存根（Service Stub）调用服务端（Service）的程序，获取执行结果，并通过类似的方式返回给客户端。

从上面的流程可以看出，RPC主要有`Client`，`Client Sub`，`NetWork`，`Server`，`Server Sub`五部分组成，

## 3、RPC标准化沟通机制

为了允许不同种类的客户端（PHP、GO...）都能访问同一个服务端，产生很多标准话的RPC系统，其中大部分采用IDL（Interface Description Language 接口描述语言，protobuf / thrift），方便跨平台的远程调用过程。

## 4、RPC调用方式

调用方式和HTTP请求一样，分为`同步调用` 和 `异步调用`
+ 同步调用
    客户方等待调用执行完成并等待返回结果。
+ 异步调用
    客户方调用后不用等待执行结果返回，但依然可以通过回调通知等方式获取返回结果。 

## 5、RPC VS REST

Rest（Representational State Transfer）表述性状态传递，是指某个瞬间状态的资源数据的快照，包括资源数据的内容、表述格式(XML、JSON)等信息；是一种软件架构风格。这种风格的典型应用，就是HTTP。
RPC（ Remote Procedure Call Protocol ）远程过程调用，它可以实现客户端像调用本地服务(方法)一样调用服务器的服务(方法)

可能大家和我一样，第一次听到RPC的时候，第一反应就是RPC和我们经常使用的REST有什么区别？虽然也有大佬说两者是不同的两个东西，不能拿来比较，但是还是忍不住搜了一下。

比较方向 | RPC | REST
---|---|---
面向对象 | 面向方法 | 面向资源 
通信协议 | HTTP、TCP、UDP | HTTP
序列化方式 | IDL（protobuf｜thrift）、JSON-RPC、XML-RPC | JSON、XML
性能 | 较高 | 一般
灵活性 | 低 | 高
使用场景 | 内部系统之间的调用 | 外部系统之间的调用

## 6、常见框架
已经有很多的RPC开源框架，下面看一下一些常见的框架：

功能 | Dubbox | thrift | gRpc | rpcx | Hprose
--- | --- | --- | --- | --- | ---
支持语言 | Java | 跨语言 | 跨语言 | Go | 跨语言
分布式服务治理 | Y | 可以配合zookeeper,Eureka等实现 | 可以配合etcd(go),zookeeper,consul等实现 | 自带服务注册中心，也支持zookerper,etcd等发现方式 | 可以配合zookeeper, Eureka等实现
底层协议 | Dubbo 协议、 Rmi 协议、 Hessian 协议、 HTTP 协议、 WebService 协议、Dubbo Thrift 协议、Memcached 协议 | tpc/http/frame | http2 | tcp长链接 | tpc/http
消息序列化 | hessian2,json,resr,kyro,FST等，可扩展protobuf等 | thrift | protobuf | Gob、Json、MessagePack、gencode、ProtoBuf等 | xml/json等
注册中心 | zookeeper | zookeeper | etcd,zookeeper,consul | etcd,zookeeper | zookeeper
性能 | ★★ | ★★★★<br/>比grpc快2-5倍 | ★★★ <br/>比dubbox,motan快 | ★★★★★ <br/>比thrift快1-1.5倍 | 无

原文链接：[thrift,gRPC,rpcx,motan,dubbox等rpc框架对比](https://blog.csdn.net/xuduorui/article/details/77938644)
这些框架的性能我并没有去尝试，在网上找了一些文章了解了一下：
[流行的rpc框架性能测试对比](https://blog.csdn.net/quuqu/article/details/79304614#%E6%9C%AC%E6%96%87%E6%B5%8B%E8%AF%95%E7%9A%84RPC%E6%A1%86%E6%9E%B6)
[分布式RPC框架性能大比拼 dubbo、motan、rpcx、gRPC、thrift的性能比较](https://blog.csdn.net/zixiao217/article/details/53675678)
[6种微服务RPC框架，你知道几个？](https://developer.51cto.com/art/201908/601617.htm)