---
title: ElasticSearch学习笔记（一）
date: 2018-09-06 08:43:11
categories: ElasticSearch
tags: ['ES']
---

## （一）ES的安装
### 1、安装前准备
elasticsearch是使用java开发的，所以必须安装Java环境
```python
[root@iZ2zee30op42zedrik59weZ ~]# yum install java
```
<!-- more -->

### 2、直接下载安装包后，解压即可
```python
[root@iZ2zee30op42zedrik59weZ ~]# https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.5.0.zip
[root@iZ2zee30op42zedrik59weZ ~]# unzip elasticsearch-5.5.0.zip
```

### 3、运行elasticsearch
进入elasticsearch目录，运行 bin/elasticsearch (or bin\elasticsearch.bat on Windows)

### 4、验证
在shell中输入 curl http://localhost:9200/ or Invoke-RestMethod http://localhost:9200 

### 5、遇到的问题
问题一：OpenJDK 64-Bit Server VM warning: INFO: os::commit_memory(0x0000000085330000, 2060255232, 0) failed; error='Cannot allocate memory' (errno=12)

	解决办法：
	由于elasticsearch5.0默认分配jvm空间大小为2g，修改jvm空间分配
	```python
	 22 # -Xms2g
	 23 # -Xmx2g
	 24 -Xms512m
	 25 -Xmx512m
	 ```
问题二：Caused by: java.lang.RuntimeException: can not run elasticsearch as root

	解决办法：
	+ 异常描述为不能以root权限运行Elasticsearch.解决办法是运行时加上参数：
	```python
	bin/elasticsearch -Des.insecure.allow.root=true
	```
	+ 或者修改bin/elasticsearch，加上ES_JAVA_OPTS属性：
	```python
	ES_JAVA_OPTS="-Des.insecure.allow.root=true"
	```

问题三：ERROR: D is not a recognized option

	解决办法：
	其实上一个错误可以忽略，直接运行下面即可
	+ 创建用户组和用户
	```python
	[root@iZ2zee30op42zedrik59weZ bin]# groupadd es
	[root@iZ2zee30op42zedrik59weZ bin]# useradd liushuaicai -g es -p liushuaicai
	[root@iZ2zee30op42zedrik59weZ local]# chown -R liushuaicai:es elasticsearch-5.5.0/
	[root@iZ2zee30op42zedrik59weZ local]# su liushuaicai
	[liushuaicai@iZ2zee30op42zedrik59weZ local]$ cd elasticsearch-5.5.0/
	[liushuaicai@iZ2zee30op42zedrik59weZ elasticsearch-5.5.0]$ ./bin/elasticsearch
	```


> 安装结束。。。

---

## （二）Python连接ES
这里主要是使用Python来操作ElasticSearch，先介绍一下Python怎样连接ES。
### 1、安装elasticsearch扩展包
```python
pip3 install elasticsearch
```
### 2、连接方式
有以下几种连接方式:  
a)、本地连接方式
```python
from elasticsearch import Elasticsearch

es = Elasticsearch()
```
b)、连接多个ES
```python
from elasticsearch import Elasticsearch

es = Elasticsearch(['localhost:443', 'other_host:443'])
```
b)、用户密码连接方式
```python
from elasticsearch import Elasticsearch

# you can use RFC-1738 to specify the url
es = Elasticsearch(['https://user:secret@localhost:443'])

# ... or specify common parameters as kwargs
es = Elasticsearch(
    ['localhost', 'otherhost'],
    http_auth=('user', 'secret'),
    scheme="https",
    port=443,
)

# SSL client authentication using client_cert and client_key
from ssl import create_default_context
context = create_default_context(cafile="path/to/cert.pem")
es = Elasticsearch(
    ['localhost', 'otherhost'],
    http_auth=('user', 'secret'),
    scheme="https",
    port=443,
    ssl_context=context,
)
```
更多的连接方式，可以查看 [官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)或者[elasticsearch-py](https://elasticsearch-py.readthedocs.io/en/master/)

⚠️ 警告

    elasticsearch-py不附带默认的根证书集。
    有工作的SSL证书验证您需要可以指定自己的作为cafile或capath或cadata 或安装CERTIFI将被自动拾取。



## （三）创建索引
ES的索引和MySql的作用是一样的，优化索引可以提高搜索速度
### 1、非正规创建

```python
from elasticsearch import Elasticsearch
es = Elasticsearch()
doc = {
    'name': 'lsc',
    'age': 23,
    'sex': 1,
    'job': 'php',
    'other': {
        'from': 'henan',
        'city': 'beijing'
    }
}

res = es.index(index='crm', doc_type='user', id=1, body=doc)
print(res['result'])
```

## （最后）ES小笔记
#### ES和关系型数据库的区别
```
Relational DB -> Databases -> Tables -> Rows -> Columns
ElasticSearch -> Indices -> Types -> Documents -> Fields
```
#### 集群健康
> ES根据status判断集群的健康状态，status包括：green|yellow|red 三种颜色

颜色 | 意义
---|---
green | 所有主分片和副分片都可用
yellow | 所有主分片都可用，但不是所有的副分片都可用
red | 不是所有的主分片都可用

#### 分片
```
1、一个分片是一个最小级别的“工作单元”，只是保存索引中所有数据的一小片；
2、是一个单一的Lucene实例
3、本身就是一个完整的搜素引擎
```
###### 作用
```
1、在集群中分配数据
2、文档存储在分片上，分片分配给你的集群节点上
3、索引中的每个文档都属于一个单独的主分片，主分片的数量决定了你最多存储多少数据（理论上主分片对存储多少数据并没有限制，限制取决于实际的使用情况）
```
###### 主分片、复制分片
```
1、复制分片只是主分片的一个副本
2、主分片的数量会在其索引创建完成后修正，但是复制分片的数量会随时变化的
3、下面就是创建的3个主分片1个复制分片(每一个主分片有一个复制分片对应，也就是相当于有3个复制分片)
{
    "settings" : {
        "number_of_shards" : 3,
        "number_of_replicas" : 1
    }
}
4、同一个节点上保存相同的数据副本是没用的，如果这个节点故障了，所有的数据也就丢失了
```

#### 数据
###### 请求方法
```
GET：获取数据
POST：新增数据
PUT：更新|新增指定数据，也就是带上ID
DELETE：删除文档
HEAD：判断数据是否存在
```