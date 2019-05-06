---
title: word2vec原理分析笔记
date: 2018-08-30 11:46:09
categories: 机器学习
tags: ['Word2Vec']
mathjax: true
---

## 1、word2vec介绍
word2vec 是 Google 于 2013 年开源推出的一个用于获取 word vector (词向量)的工具包。
特点：简单、高效
作用：把文本转化为词向量
<!-- more -->
## 2、预备知识
word2vec 中用到的一些重要知识点：sigmoid函数、Beyes公式、Huffman编码

#### 2.1、sigmoid函数
sigmoid 函数是神经网络中常用的激活函数之一，其定义为：


$$\overline{X} = \frac{\sum_{i=1}^{n}X_i}{n}$$  
`$x^{y^z} = (1+e^x)^{-2xy^w}$`


$$
\require{enclose}\begin{array}{}
\enclose{horizontalstrike}{x+y}\\
\enclose{horizontalstrike}{x*y}\\
\end{array}
$$