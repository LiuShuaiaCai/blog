---
title: ElasticSearch集群搭建
date: 2018-09-13 18:04:05
categories: ElasticSearch
tags: ['ES']
---
## 1、需要下载的文件
文件安装包

    * elasticsearch-head-master
    * elasticsearch
<!-- more -->
下载地址：

    * https://www.elastic.co/downloads/elasticsearch  
    * https://github.com/mobz/elasticsearch-head

文件列表：

    * elasticsearch-head-master
    * elasticsearch1
    * elasticsearch2

## 2、修改host文件
127.0.0.1    host1  
127.0.0.1    host2

## 3、修改ES的配置文件
修改elasticsearch.yml文件
```
#配置文件中未改动的位置我就不展示了

　　　　#第一个配置文件改动如下
　　　　#集群名称(必须一样)
　　　　cluster.name: carryless-es
　　　　#节点名称(必须不一样)
　　　　node.name: node-1
　　　　#本机的IP地址
　　　　network.host: host1
　　　　#服务的端口号(在本地配置多个时，请注意修改为不一样的端口)
　　　　http.port: 9201
　　　　#服务发现端口
　　　　transport.tcp.port: 9301
　　　　#集群发现IP集合
　　　　discovery.zen.ping.unicast.hosts: ["host1:9301", "host2:9302"]

　　　　#第二个配置文件改动如下
　　　　cluster.name: carryless-es
　　　　node.name: node-2
　　　　network.host: host2
　　　　http.port: 9202
　　　　transport.tcp.port: 9302
　　　　discovery.zen.ping.unicast.hosts: ["host1:9301", "host2:9302"]
```
解决elasticsearch服务与elasticsearch-head之间的跨域问题，在各自的配置文件中添加如下两行：
```
http.cors.enabled: true
http.cors.allow-origin: "*"
```

## 4、elasticsearch-head插件安装
elasticsearch-head是一个用来浏览、与elasticsearch进行交互的web前端展示插件,使用node.js编写，要使用elasticsearch-head插件，需要有node环境，node.js的安装在此不做赘述，不明白的小伙伴请自行搜索。
* 首先我们使用命令窗口cmd,进入elasticsearch-head插件的目录中，执行以下代码
```
npm install
```
* 执行完成后，在当前目录下会多出一个名为node_modules的目录，此目录为自动下载所需模块的文件
* 运行head插件
```
npm run start
```
* 然后在浏览器中访问 http://localhost:9100
![es_cluster](/images/es_cluster.png)