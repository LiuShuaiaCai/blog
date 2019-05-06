---
title: Mysql的sql分析（explain|profile）
date: 2017-04-05 21:44:51
category: Mysql
tags: mysql
---
### 1、Explain详解
explain 显示了Mysql如何使用索引处理select语句以及连接表。通过explain分析可以更好的选择索引，优化select语句。<!-- more -->
```mysql
mysql> explain SELECT pre_products.id,pre_products.name,pre_product_pictures.filepath,pre_product_spec.rate_profit,pre_product_spec.purchase_price,pre_product_config.moq FROM `pre_products` INNER JOIN
 pre_product_config ON pre_products.id = pre_product_config.product_id INNER JOIN pre_product_spec ON pre_products.id = pre_product_spec.product_id INNER JOIN pre_product_pictures ON pre_products.id =
 pre_product_pictures.product_id INNER JOIN pre_product_categorys ON pre_products.id = pre_product_categorys.product_id WHERE pre_product_pictures.type = 1 AND pre_products.status = 2 AND pre_products
.id IN ('374','378','385','386','387','388','389','390') AND ( pre_product_config.moq=pre_product_spec.lower_limit ) GROUP BY pre_products.id ORDER BY id;
+----+-------------+-----------------------+-------+-------------------------+--------------+---------+--------------------------+------+--------------------------+
| id | select_type | table                 | type  | possible_keys           | key          | key_len | ref                      | rows | Extra                    |
+----+-------------+-----------------------+-------+-------------------------+--------------+---------+--------------------------+------+--------------------------+
|  1 | SIMPLE      | pre_products          | range | PRIMARY                 | PRIMARY      | 3       | NULL                     |    8 | Using where              |
|  1 | SIMPLE      | pre_product_config    | ref   | product_id,moq          | product_id   | 5       | qiyegood.pre_products.id |    1 | Using where              |
|  1 | SIMPLE      | pre_product_categorys | ref   | product_id_2,product_id | product_id_2 | 4       | qiyegood.pre_products.id |    1 | Using where; Using index |
|  1 | SIMPLE      | pre_product_pictures  | ref   | product_id              | product_id   | 4       | qiyegood.pre_products.id |    4 | Using where              |
|  1 | SIMPLE      | pre_product_spec      | ref   | product_id              | product_id   | 5       | qiyegood.pre_products.id |    4 | Using where              |
+----+-------------+-----------------------+-------+-------------------------+--------------+---------+--------------------------+------+--------------------------+
5 rows in set (0.00 sec)
```

#### 1.1、每一列的意思
id：MySQL Query Optimizer 选定的执行计划中查询的序列号。表示查询中执行 select 子句或操作表的顺序,id值越大优先级越高,越先被执行。id 相同,执行顺序由上至下。
select_type：查询的类型

|类型           		|说明           										|
|:-----------------------|:---------------------------------------------------------------|
|SIMPLE     			|简单的 select 查询,不使用 union 及子查询					|
|PRIMARY 			|最外层的 select 查询 									|
|UNION 	UNION 		|中的第二个或随后的 select 查询,不 依赖于外部查询的结果集		|
|DEPENDENT UNION 	|UNION 中的第二个或随后的 select 查询,依 赖于外部查询的结果集	|
|SUBQUERY 			|子查询中的第一个 select 查询,不依赖于外 部查询的结果集		|
|DEPENDENT SUBQUERY 	|子查询中的第一个 select 查询,依赖于外部 查询的结果集			|
|DERIVED 			|用于 from 子句里有子查询的情况。 MySQL 会 递归执行这些子查询, 结果放在临时表里。|
|UNCACHEABLE SUBQUERY |结果集不能被缓存的子查询,必须重新为外 层查询的每一行进行评估。|
|UNCACHEABLE UNION 	|UNION 中的第二个或随后的 select 查询,属 于不可缓存的子查询 	|

table：输出行所引用的表
type：显示连接使用的类型，按照从最优到最差的类型排序 

|类型           		|说明           										|
|:-----------------------|:---------------------------------------------------------------|
|System 				|表仅有一行(=系统表)。这是 const 连接类型的一个特例。			|
|const  				|const 用于用常数值比较 PRIMARY KEY 时。当 查询的表仅有一行时,使用 System。|
|eq_ref  			|const 用于用常数值比较 PRIMARY KEY 时。当 查询的表仅有一行时,使用System。|
|ref  				|连接不能基于关键字选择单个行,可能查找到多个符合条件的行。叫做ref是因为索引要跟某个参考值相比较。这个参考值或者是一 个常数,或者是来自一个表里的多表查询的 结果值|
|ref_or_null  		|如同 ref, 但是 MySQL 必须在初次查找的结果 里找出 null 条目,然后进行二次查找。|
|index_merge  		|说明索引合并优化被使用了。|
|unique_subquery  	|在某些 IN 查询中使用此种类型,而不是常规的 ref:value IN (SELECT primary_key FROM single_table WHERE some_expr)|
|index_subquery  	|在 某 些 IN 查 询 中 使 用 此 种 类 型 , 与 unique_subquery类&#20284;,但是查询的是非唯一 性索引: value IN (SELECT key_column FROM single_table WHERE some_expr)|
|range  				|只检索给定范围的行,使用一个索引来选择 行。key 列显示使用了哪个索引。当使用=、<>、>、>=、<、<=、IS NULL、<=>、BETWEEN 或者 IN操作符,用常量比较关键字列时,可 以使用 range。|
|index  				|全表扫描,只是扫描表的时候按照索引次序 进行而不是行。主要优点就是避免了排序, 但是开销仍然非常大。|
|all  				|最坏的情况,从头到尾全表扫描。 |

possible_keys：指出Mysql能在该表中使用哪些索引有助于查询，如果为空，说明没有可用的索引
key：MySQL 实际从 possible_key 选择使用的索引。 如果为 NULL,则没有使用索引。很少的情况 下,MYSQL会选择优化不足的索引。这种情 况下,可以在 SELECT 语句中使用 USE INDEX (indexname)来强制使用一个索引或者用IGNORE INDEX(indexname)来强制 MYSQL 忽略索引。
key_len：使用的索引的长度。在不损失精确性的情况 下,长度越短越好。
ref：显示索引的哪一列被使用了。
rows：MYSQL 认为必须检查的用来返回请求数据的行数。
Extra：extra 中出现以下 2 项意味着 MYSQL 根本不能使用索引,效率会受到重大影响。应尽可能对此进行优化。

|extra项          		|说明           										|
|:-----------------------|:---------------------------------------------------------------|
|Using filesort  	|表示MySQL会对结果使用一个外部索引排序,而不是从表里按索引次序读到相关内容。可能在内存或者磁盘上进行排序。MySQL 中无法利用索引完成的排序操作称为“文件排序”|
|Using temporary  	|表示MySQL在对查询结果排序时使用临时表。常见于排序 order by 和分组查询 group by。 |

	注意点：1、join语句的使用，永远用小结果集驱动大结果集。2、仔细分析上面字段的类型。

### 2、压力测试
压力测试[select benchmark(count,sql)]();计算sql语句执行count次所花费的时间
```mysql
mysql> select benchmark(1000000000,"select count(*) from pre_templet_floor");
+----------------------------------------------------------------+
| benchmark(1000000000,"select count(*) from pre_templet_floor") |
+----------------------------------------------------------------+
|                                                              0 |
+----------------------------------------------------------------+
1 row in set (4.63 sec)

mysql> select count(*) from pre_templet_floor;
+----------+
| count(*) |
+----------+
|       27 |
+----------+
1 row in set (0.00 sec)
```

### 3、Profile详解
profile用于查看一个sql的具体消耗。
#### 3.1、查看profile是否开启，默认为关闭
方法一：
```
mysql> select @@profiling;
+-------------+
| @@profiling |
+-------------+
|           0 |    --0为关闭，1为开启
+-------------+
1 row in set (0.00 sec)
```
方法二：
```
mysql> show variables like '%profil%';
+------------------------+-------+
| Variable_name          | Value |
+------------------------+-------+
| have_profiling         | YES   |    --只读变量，用于控制是否由系统变量开启或禁用profiling 
| profiling              | OFF   |    --开启SQL语句剖析功能 
| profiling_history_size | 15    |    --设置保留profiling的数目，缺省为15，范围为0至100，为0时将禁用profiling 
+------------------------+-------+
3 rows in set (0.00 sec)
```
#### 3.2、开启profile
```
mysql> set profiling=1;
Query OK, 0 rows affected (0.00 sec)
```
查看profile的状态（已经开启）
```
mysql> select @@profiling;
+-------------+
| @@profiling |
+-------------+
|           1 |
+-------------+
1 row in set (0.00 sec)
```

#### 3.3、profile具体操作
```
mysql> show profiles;
+----------+--------------+---------------------------------------------------+
| Query_ID | Duration     | Query                                          |
+----------+--------------+---------------------------------------------------+
|       57 |   0.00070650 | select count(*) from pre_templet_loor     	  |
+----------+--------------+---------------------------------------------------+
1 rows in set (0.00 sec)
```

type的类型有一下9种：

    ALL：显示所有性能信息。
    BLOCK IO：显示块IO（块的输入输出）的次数。
    CONTEXT SWITCHES：显示自动和被动的上下文切换数量。
    CPU：显示用户和系统的CPU使用情况。
    IPC：显示发送和接收的消息数量。
    MEMORY：MySQL5.6中还未实现，只是计划实现。
    PAGE FAULTS：显示主要的和次要的页面故障。
    SOURCE：显示源代码的函数名称，以及在源码文件名称与行数（即源码中的位置）。
    SWAPS：显示swap的次数。 

具体分析上面的SQL语句:
```
mysql> show profile for query 57;
+----------------------+----------+
| Status               | Duration |
+----------------------+----------+
| starting             | 0.000060 |
| checking permissions | 0.000007 |
| Opening tables       | 0.000275 |
| System lock          | 0.000008 |
| init                 | 0.000009 |
| optimizing           | 0.000003 |
| statistics           | 0.000008 |
| preparing            | 0.000005 |
| executing            | 0.000003 |
| Sending data         | 0.000056 |
| end                  | 0.000003 |
| query end            | 0.000003 |
| closing tables       | 0.000004 |
| freeing items        | 0.000226 |
| logging slow query   | 0.000001 |
| logging slow query   | 0.000036 |
| cleaning up          | 0.000001 |
+----------------------+----------+
17 rows in set (0.00 sec)
```

上图中纵向栏意义:

|类型           			|说明           				|
|:----------------------------|:---------------------------------|
|starting				|开始						|
|checking permissions	|检查权限						|
|Opening tables			|打开表						|
|init					|初始化						|
|System lock				|系统锁						|
|optimizing				|优化						|
|statistics				|统计						|
|preparing				|准备						|
|executing				|执行 						|
|Sending data 			|发送数据						|
|Sorting result 			|排序						|
|end 					|结束						|
|query end 				|查询 结束					|
|closing tables 			|关闭表 ／去除TMP 表 			|
|freeing items 			|释放物品						|
|cleaning up				|清理						|

	
	通过对以上数据的分析可以知道SQL的具体消耗情况。