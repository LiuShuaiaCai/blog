---
title: GCC基本使用
date: 2019-11-25 22:02:30
categories: GCC
tags: ['GCC', 'CC']
---
## 1、GCC编译流程
`GCC`编译器在编译`C语言`程序时需要经过以下四步：
1. 预处理：将C语言源程序预处理，生成`.i`文件
2. 编译：预处理后的`.i`文件编译成为汇编语言，生成`.s`文件
3. 汇编：将汇编语言文件经过汇编，生成目标文件`.o`文件
4. 链接：将各个模块的`.o`文件链接起来，生成可执行的程序文件
<!--more-->
备注：可执行程序的内部是一系列计算机指令和数据的集合，它们都是二进制形式的，CPU 可以直接识别，毫无障碍

## 2、GCC常用命令

编译选项 | 选项意义 
:-:|:-:
-E | 预处理指定的源文件，但不进行编译，生成.i文件
-S | 编译指定的源文件，但不进行汇编，生成.s文件
-c | 编译、汇编指定的源文件，但不进行链接，生成.o文件
 -o [file1] [file2] | 将文件 file2 编译成可执行文件 file1
 -I directory | 指定 include 包含文件的搜索目录 
 -g | 生成调试信息，该程序可以被调试器调试

## 3、GCC实例
下面展示GCC的编译过程，实例如下：
```c
#include <stdio.h>

int main()
{
    puts("GCC常用命令");
    return 0;
}
```

### 3.1、预处理(Pre-processing)
在该阶段，编译器将C源代码中的包含的头文件如stdio.h编译进来，用户可以使用gcc的选项”-E”进行查看。
执行命令：`gcc -E gcc.c -o gcc.i`。

```c
[0:18:35] liushuaicai:gcc $ gcc -E gcc.c -o gcc.i
[0:18:59] liushuaicai:gcc $ ls
gcc.c gcc.i
```

### 3.2、编译阶段(Compiling)
第二步进行的是编译阶段，在这个阶段中，Gcc首先要检查代码的规范性、是否有语法错误等，以确定代码的实际要做的工作，在检查无误后，Gcc把代码翻译 成汇编语言。用户可以使用”-S”选项来进行查看，该选项只进行编译而不进行汇编，生成汇编代码。
执行命令：`gcc -S gcc.i -o gcc.s`

```c
[0:24:44] liushuaicai:gcc $ gcc -S gcc.i -o gcc.s
[0:25:18] liushuaicai:gcc $ ls
gcc.c gcc.i gcc.s
```

### 3.3、汇编阶段(Assembling)
汇编阶段是把编译阶段生成的”.s”文件转成二进制目标代码，选项 -c。
执行命令：`gcc -c gcc.s -o gcc.o`

```c
[0:25:19] liushuaicai:gcc $ gcc -c gcc.s -o gcc.o
[0:28:17] liushuaicai:gcc $ ls
gcc.c gcc.i gcc.o gcc.s
```

### 3.4、链接阶段(Link)
在成功编译之后，就进入了链接阶段。
执行命令：`gcc gcc.o -o gcc.out`

```c
0:30:04] liushuaicai:gcc $ gcc gcc.o -o gcc.out
[0:32:50] liushuaicai:gcc $ ls
gcc.c   gcc.i   gcc.o   gcc.out gcc.s
[0:32:51] liushuaicai:gcc $ ./gcc.out
GCC常用命令
```