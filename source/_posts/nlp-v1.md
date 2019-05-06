---
title: 自然语言处理（一）
date: 2018-09-10 15:17:34
categories: 机器学习
tags: ['NLP']
---
自然语言处理（Natural Language Processing,NLP）是研究能够实现人与计算机之间用自然语言进行有效通信的各种理论和方法，也是人工智能领域中一个最重要、最艰难的方向。

近些年NLP的突破：中文分词、词性标注、词汇语义、语法解析
<!-- more -->

文本方面：基于自然语言理解的智能搜索引擎、智能搜索、机器翻译、自动摘要、文本综合、文本分类、信息过滤、垃圾邮件处理、文本数据挖掘等

语音方面：智能客服、聊天机器人、多媒体信息提取与文本转化

## 现在自然语言系统
自然语言系统基础模块：语言的解析、语义的理解、语言的生成
![nlp-1](/images/nlp-1.png)
自然语言处理的一般构架：
![nlp-2](/images/nlp-2.png)
左侧是语法层面的模块：中文分词、词性标注、句法解析
右侧侧重于语义层面：命名实体识别主要用来识别语料中专有名词和未登录词的成词情况，如人名、地名、组织结构名等。受到左侧的中文分词和此行标注的影响。
## 开源的中文NLP系统
名称 | 包含模块 | 开发语言
---|---|---
[哈工大LTP](https://www.ltp-cloud.com/) | 中文分词、词性标注、未登录词识别、句法分析、语义角色标注、关键字提取<br>文档：[https://ltp.readthedocs.io/zh_CN/latest/index.html](https://ltp.readthedocs.io/zh_CN/latest/index.html)<br>Python文档：[https://pyltp.readthedocs.io/zh_CN/latest/](https://pyltp.readthedocs.io/zh_CN/latest/) | C++
[Stanford](https://nlp.stanford.edu/software/index.html) | 中文分词、词性标注、未登录词识别、句法分析、关键词提取 | Java
[jieba](https://github.com/fxsjy/jieba) | 中文分词、关键词提取、词性标注、并行分词 | Python

## 整合中文分词模块
汉语自然语言处理的第一步就是中文分词，按照算法的不同，介绍两大类中文分词模块：
* 基于条件随机场（CRF）的中文分词算法开源系统（哈工大的HIT LTP）
* 基于张华平NShort的中文分词算法开源系统（结巴分词）

## 整合词性标注模块
词性标注（Port-Of-Speech Tagging）,又称为词类标注，是指判断出在一个句子中每一词所扮演的语法角色。例如：表示人、事物、地点或抽象概念的名称等，词性标注算法比较统一。
* 大多数使用HMM（隐马尔科夫模型）或者最大熵算法（如：结巴分词的词性实现）
* 使用CRF算法实现（例如：哈工大的LTP3.3中的词性标注）
目前最流行的中文词性标签有两大类：北大词性标注集和宾州词性标注集