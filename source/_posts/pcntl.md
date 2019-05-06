---
title: PHP进程管理pcntl
date: 2017-04-24 17:01:33
categories: PHP
tags: pcntl
---
其实很早就想学习一下多进程、多线程，一直赖宇自己没用到这个东西，没认真去看过，这次有时间研究一下（了解了解-_-），PHP的扩展安装想必大家都已经很熟悉了，这里就不在叙述了。如果真不知道，可以参考我的另一篇博客[刘帅才的博客园](http://www.cnblogs.com/sweet521/p/6062859.html)。
下面一块来学习一下吧（我也不会..._-_）。
## Pcntl函数
#### pcntl_alarm
* int pcntl_alarm（int $seconds）：为进程设置一个alarm闹钟信号
* 参数$seconds:等待的秒数，为0的话不会创建信号
* 返回值：返回上次调用剩余的秒数
