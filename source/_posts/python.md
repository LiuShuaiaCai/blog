---
title: python2.7学习总结
date: 2017-05-03 10:12:32
categories: Python
tags: python
---
## Python基础
#### ** 列表（list） **
* 列表的截取。
```python
>>> list = [1,2,3,4,5];
>>> list[0]
1
>>> list[-1]
5
>>> list[3:100]
[4, 5]
```
<!-- more -->
* 列表的重复。
```python
>>> list * 3
[1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5]
```
* 列表的组合
```python
>>> list = [1,2,3,4,5]
>>> list2 = ['a','b','c','d','e']
>>> list+list2
[1, 2, 3, 4, 5, 'a', 'b', 'c', 'd', 'e']
```
+ 获取列表长度
```python
>>> print len(list)
5
```
+ 在列表末尾添加新的元素(append、extend、insert)
```python
>>> list.append('append')
>>> list
[1, 2, 3, 4, 5, 'append']
```
    在列表末尾追加另一个列表
    ```python
    >>> list.extend(list2)
    >>> list
    [1, 2, 3, 4, 5, 'append', 'a', 'b', 'c', 'd', 'e']
    ```
    在指定位置添加元素
    ```python
    >>> list.insert(0,10)
    >>> list
    [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ```
* 删除列表元素（del命令、pop()、remove()）
```python
>>> del list[-1]
>>> list
[1, 2, 3, 4, 5, 'append', 'a', 'b', 'c', 'd']
```

    pop移除列表中的某个元素（默认最后一个）,并返回改元素的值
    ```python
    >>> list
    [1, 2, 3, 4, 5, 'append', 'a', 'b', 'c', 'd']
    >>> list.pop()
    'd'
    >>> list
    [1, 2, 3, 4, 5, 'append', 'a', 'b', 'c']
    >>> list.pop(0)
    1
    >>> list
    [2, 3, 4, 5, 'append', 'a', 'b', 'c']
    ```
* 更新列表,<span style='color:red'>更新一个列表中不存在的键时，会报错。</span>
```python
>>> list
[1, 2, 3, 4, 5]
>>> list[4]='new'
>>> list
[1, 2, 3, 4, 'new']
>>> list[10]='new10'
Traceback (most recent call last):
  File "<interactive input>", line 1, in <module>
IndexError: list assignment index out of range
```
* 元素是否存在列表中(in、count、index)
```python
>>> list
[1, 2, 3, 4, 5, 'append', 'a', 'b', 'c', 'd']
>>> 'append' in list
True
>>> 'hello' in list
False
```
    ```python
    >>> list
    [1, 2, 3, 4, 5, 'append', 'a', 'b', 'c', 'd']
    >>> list.count('count')
    0
    >>> list.count('append')
    1
    ```
    ```python
    >>> list.index('append')
    5
    >>> list.index('index')
    Traceback (most recent call last):
      File "<interactive input>", line 1, in <module>
    ValueError: 'index' is not in list
    ```
* 列表迭代
```python
>>> list
[2, 3, 5, 'append', 'a', 'b', 'c', 'd']
>>> for i in list:
... 	print i
... 	
2
3
5
append
a
b
c
d
```
* 反向列表中的元素
```python
>>> list
[2, 3, 5, 'append', 'a', 'b', 'c', 'd']
>>> list.reverse()
>>> list
['d', 'c', 'b', 'a', 'append', 5, 3, 2]
```
* 对列表进行排序
```python
>>> list = [1,9,3,4,6,2,5,8,7,0]
>>> list.sort()
>>> list
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
>>> list.reverse()
>>> list
[9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
```
* 列表最值
```python
>>> list
[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
>>> max(list)
10
>>> min(list)
0
```
#### ** 元组（tuple）**
* 元组和列表基本相同，只是<span style='color:red'>元组中的元素不能修改</span>

|list|tuple|
|:---|:---|
|可以修改|不可以修改|

* 元组和列表的相互转换
列表转为元组
```python
>>> _list = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
>>> _tuple = tuple(_list)
>>> _tuple
(10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0)
```
    元组转为列表
    ```python
    >>> t_list = list(_tuple)
    >>> t_list
    [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ```
* 无关闭分隔符
任意无符号的对象，以逗号隔开，默认是元组
```python
>>> _tuple_ = 1,2,3,4,5
>>> _tuple_
(1, 2, 3, 4, 5)
```
* 修改元组的方法
    * 通过元组连接
    * 通过内嵌列表的形式
* 一个元素的元组

|错误形式|正确格式|
|:------|:------|
|>>> _tuple = (1)<br/>>>> _tuple<br/>1|>>> _tuple = (1,)<br/>>>> _tuple<br/>(1,)|
#### 字典（dictionary）
也可称为map，以键值（key=>value）形式存在的可变容器
* 字典键的特性：
    * 键不能相同，否则后者会覆盖前者
    * 键必须不可变，可以用数字、字符串、元组，但不能用列表可变的对象。
* 用字符串输出字典
```python
>>> _info = {'name':'liushuaicai','age':'25'}
>>> str(_info)
"{'age': '25', 'name': 'liushuaicai'}"
```
* 查看变量的类型
```python
>>> type(_info)
<type 'dict'>
>>> type(_tuple)
<type 'tuple'>
>>> type(_list)
<type 'list'>
```
* 创建一个字典，以序列中的值作为键，val作为值
```python
>>> dict.fromkeys(_list1,_val)
{1: 'hello', 2: 'hello', 3: 'hello', 4: 'hello', 5: 'hello'}
```
* 浅复制字典
```python
>>> _info
{'age': '25', 'name': 'liushuaicai'}
>>> c_info = _info.copy()
>>> c_info
{'age': '25', 'name': 'liushuaicai'}
```
* 获取字典中的值，如果不存在，返回默认值
```python
>>> _info.get('name')
'liushuaicai'
>>> _info.get('adress','北京')
'\xe5\x8c\x97\xe4\xba\xac'
```
* 设置字典的键，如果不存在，则为默认值,如果存在，也不改变其值
```python
>>> _info.setdefault('sex')
>>> _info
{'age': '25', 'name': 'liushuaicai', 'sex': None}
>>> _info.setdefault('sex','man')
>>> _info
{'age': '25', 'name': 'liushuaicai', 'sex': None}
>>> _info.setdefault('phone','15201557941')
'15201557941'
>>> _info
{'phone': '15201557941', 'age': '25', 'name': 'liushuaicai', 'sex': None}
```
* 把一个字典的键值更新到另一个字典
```python
>>> _email = {'email':'shuaicai_liu@qq.com'}
>>> _info.update(_email)
>>> _info
{'phone': '15201557941', 'age': '25', 'email': 'shuaicai_liu@qq.com', 'name': 'liushuaicai', 'sex': None}
```
* 以列表返回可遍历的元组（数组）
```python
>>> _list = _info.items()
>>> _list
[('phone', '15201557941'), ('age', '25'), ('email', 'shuaicai_liu@qq.com'), ('name', 'liushuaicai')]
>>> for key,value in _list:
... 	print key,'=>',value
... 	
phone => 15201557941
age => 25
email => shuaicai_liu@qq.com
name => liushuaicai
```
* 获取字典中所有的键|值
```python
>>> _info.keys()
['phone', 'age', 'email', 'name']
>>> _info.values()
['15201557941', '25', 'shuaicai_liu@qq.com', 'liushuaicai']
```
* 判断字典中是否含有某个键
```python
>>> _info.has_key('name')
True
>>> _info.has_key('height')
False
```
* 删除字典中的值(del命令、pop())
```python
>>> del _info['sex']
>>> _info
{'phone': '15201557941', 'age': '25', 'email': 'shuaicai_liu@qq.com', 'name': 'liushuaicai'}
```
    ```python
    >>> _info
    {'age': 25, 'name': 'liushuaicai', 'sex': 'man'}
    >>> _info.pop('sex')
    'man'
    >>> _info
    {'age': 25, 'name': 'liushuaicai'}
    ```
* 删除字典中的所有元素
```python
>>> _info.clear()
>>> _info
{}
```
#### set序列
set和dict类似，也是一组key的集合，但不存储value。由于key不能重复，所以，在set中，没有重复的key，不能有空值。
    
    >>> _set = set([1,1,2,2,3,4,5,7,7])
    >>> _set
    set([1, 2, 3, 4, 5, 7])
    
* set添加元素
```python
>>> _set
set([2, 3, 4, 5, 7])
>>> _set.add('new')
>>> _set
set([2, 3, 4, 5, 7, 'new'])
```
* 删除元素（pop、remove）
```python
>>> _set.remove('new')
>>> _set
set([2, 3, 4, 5, 7])
```
    ```python
    >>> _set.pop()
    2
    >>> _set
    set([3, 4, 5, 7])
    ```
* 字符串是不可变对象，用replace替换值时，相当于赋给了另外一个变量。
```python
>>> _name = 'liushuaicai'
>>> _name.replace('l','L')
'Liushuaicai'
```