---
title: 常用激活函数
date: 2018-08-30 14:06:08
categories: 机器学习
tags: ['MachineLearning']
---
## 1、激活函数介绍
### 1.1、什么是激活函数
如下图，在神经元中，输入的 inputs 通过加权，求和后，还被作用了一个函数，这个函数就是激活函数 Activation Function。
![activate](/images/active.png)
<!-- more -->
### 1.2、激活函数的特点
非线性： 当激活函数是线性的时候，一个两层的神经网络就可以逼近基本上所有的函数了。
可微： 当优化方法是基于梯度的时候，这个性质是必须的。
单调性： 当激活函数是单调的时候，单层网络能够保证是凸函数。
_ ： 当激活函数满足这个性质的时候，如果参数的初始化是random的很小的值，那么神经网络的训练将会很高效。
输出值范围： 当激活函数输出值是 有限 的时候，基于梯度的优化方法会更加 稳定，因为特征的表示受有限权值的影响更显著；当激活函数的输出是 无限 的时候，模型的训练会更加高效，不过在这种情况小，一般需要更小的学习率。
### 1.3、为什么要用激活函数
如果不用激励函数，每一层输出都是上层输入的线性函数，无论神经网络有多少层，输出都是输入的线性组合。
如果使用的话，激活函数给神经元引入了非线性因素，使得神经网络可以任意逼近任何非线性函数，这样神经网络就可以应用到众多的非线性模型中。

## 2、sigmoid函数
公式：$$ \sigma(x) = \frac{1}{1 + e^{-x}} $$

![sigmoid](/images/sigmoid.png)
在sigmod函数中我们可以看到，其输出是在(0,1)这个开区间内，这点很有意思，可以联想到概率，但是严格意义上讲，不要当成概率。sigmod函数曾经是比较流行的，它可以想象成一个神经元的放电率，在中间斜率比较大的地方是神经元的敏感区，在两边斜率很平缓的地方是神经元的抑制区。
当然，流行也是曾经流行，这说明函数本身是有一定的缺陷的。

### 2.1、sigmoid函数作用
sigmoid函数也叫 Logistic 函数，用于隐层神经元输出，取值范围为(0,1)，它可以将一个实数映射到(0,1)的区间，可以用来做二分类。
在特征相差比较复杂或是相差不是特别大时效果比较好。
### 2.2、sigmoid缺点
1) 当输入稍微远离了坐标原点，函数的梯度就变得很小了，几乎为零。在神经网络反向传播的过程中，我们都是通过微分的链式法则来计算各个权重w的微分的。当反向传播经过了sigmod函数，这个链条上的微分就很小很小了，况且还可能经过很多个sigmod函数，最后会导致权重w对损失函数几乎没影响，这样不利于权重的优化，这个问题叫做梯度饱和，也可以叫梯度弥散。
2) 函数输出不是以0为中心的，这样会使权重更新效率降低。对于这个缺陷，在斯坦福的课程里面有详细的解释。
3) Sigmoids函数收敛缓慢；sigmod函数要进行指数运算，这个对于计算机来说是比较慢的。
### 2.3、sigmoid函数求导
下面解释为何会出现梯度消失：
反向传播算法中，要对激活函数求导，sigmoid 的导数表达式为：$$ \Phi'(x) =  \Phi(x)(1-\Phi(x)) $$
求导推理：$$ \sigma'(x) = (\frac {1}{1 + e^{-x}})' $$ 
=> $$ = \frac {e^{-x}}{(1 + e^{-x})^2} $$
=> $$ = \frac {1+e^{-x}-1}{(1+e^{-x})^2} $$
=> $$ = \frac {1}{1+e^{-x}}(1-\frac {1}{1+e^{-x}}) $$
<br/>
=> $$ = f(x)(1-f(x)) $$


求导图像如下：
![sigmoid](/images/sigmoid_re.png)
由图可知，导数从 0 开始很快就又趋近于 0 了，易造成“梯度消失”现象

python代码：
```python
from matplotlib import pyplot as plt
import numpy as np

# sigmoid函数公式
def sigmoid(x):
    y = 1 / (1 + np.exp(-x))
    return y
# sigmoid函数导数
def re_sigmoid(y):
    y_ = y * (1-y)
    return y_

# sigmoid 显示
def plot_sigmoid():
    x = np.arange(-8, 8, 0.2)
    y = sigmoid(x)
    y_ = re_sigmoid(y)

    # 设置坐标原点
    fig, ax = plt.subplots()
    # 隐藏上、右边
    ax.spines['right'].set_color('none')
    ax.spines['top'].set_color('none')
    # 设置左下边为轴
    ax.xaxis.set_ticks_position('bottom')
    ax.spines['bottom'].set_position(('data', 0))
    ax.yaxis.set_ticks_position('left')
    ax.spines['left'].set_position(('data', 0))
    ax.plot(x, y)
    ax.plot(y, y_)
    # 设置边距
    ax.set_xticks(np.arange(-5, 5.1, 2))
    ax.set_yticks(np.arange(-0.5, 1.1, 0.5))
    
    
plot_sigmoid()
```

## 3、正切函数（tanh函数）
公式：$$ \tanh(x) = \frac {\sinh(x)}{\cosh(x)} = \frac {e^x - e^{-x}}{e^x + e^{-x}} $$
![tanh](/images/tanh.png)
tanh是双曲正切函数，tanh函数和sigmod函数的曲线是比较相近的，咱们来比较一下看看。首先相同的是，这两个函数在输入很大或是很小的时候，输出都几乎平滑，梯度很小，不利于权重更新；不同的是输出区间，tanh的输出区间是在(-1,1)之间，而且整个函数是以0为中心的，这个特点比sigmod的好。

一般二分类问题中，隐藏层用tanh函数，输出层用sigmod函数。不过这些也都不是一成不变的，具体使用什么激活函数，还是要根据具体的问题来具体分析，还是要靠调试的。

python 代码：
```python
# tanh函数公式
def tanh(x=0, bool=False):
    if bool==False:
        y = (np.exp(x) - 1/np.exp(x)) / (np.exp(x) + 1/np.exp(x))
    else:
        y = np.tanh((0, np.pi*1j, np.pi*1j/2))
    
    return y
 
# tanh函数显示
def plot_tanh():
    x = np.arange(-8, 8, 0.2)
    y = tanh(x)
    # 设置坐标原点
    fig, ax = plt.subplots()
    # 隐藏上、右边
    ax.spines['right'].set_color('none')
    ax.spines['top'].set_color('none')
    # 设置左下边为轴
    ax.xaxis.set_ticks_position('bottom')
    ax.spines['bottom'].set_position(('data', 0))
    ax.yaxis.set_ticks_position('left')
    ax.spines['left'].set_position(('data', 0))
    ax.plot(x, y)
    # 设置边距
    ax.set_xticks(np.arange(-5, 5.1, 1))
    ax.set_yticks(np.arange(-1.0, 1.1, 0.5))
plot_tanh()
```

## 4、线性整流函数（ReLU函数）
### 4.1、定义（来自[wiki](https://zh.wikipedia.org/wiki/%E7%BA%BF%E6%80%A7%E6%95%B4%E6%B5%81%E5%87%BD%E6%95%B0)）
线性整流函数（Rectified Linear Unit, ReLU）,又称修正线性单元, 是一种人工神经网络中常用的激活函数（activation function），通常指代以斜坡函数及其变种为代表的非线性函数。
通常意义下，线性整流函数指代数学中的斜坡函数，即
$$ f(x)=max(0,x) $$
而在神经网络中，线性整流作为神经元的激活函数，定义了该神经元在线性变换 $$ \mathbf {w} ^{T}\mathbf {x} +b $$之后的非线性输出结果。换言之，对于进入神经元的来自上一层神经网络的输入向量 x，使用线性整流激活函数的神经元会输出
$$ \max(0,\mathbf {w} ^{T}\mathbf {x} +b) $$
至下一层神经元或作为整个神经网络的输出（取决现神经元在网络结构中所处位置）。
![relu](/images/relu.png)
### 4.2、优、缺点
优点：
1) 在输入为正数的时候，不存在梯度饱和问题，相比之下，逻辑函数在输入为0时达到 $$ \frac {1}{2} $$，即已经是半饱和的稳定状态。
2) 计算速度要快很多。ReLU函数只有线性关系，不管是前向传播还是反向传播，都比sigmod和tanh要快很多。（sigmod和tanh要计算指数，计算速度会比较慢）
3）更加有效率的梯度下降以及反向传播：避免了梯度爆炸和梯度消失问题

缺点：
1) 当输入是负数的时候，ReLU是完全不被激活的，这就表明一旦输入到了负数，ReLU就会死掉。这样在前向传播过程中，还不算什么问题，有的区域是敏感的，有的是不敏感的。但是到了反向传播过程中，输入负数，梯度就会完全到0，这个和sigmod函数、tanh函数有一样的问题。
2) 我们发现ReLU函数的输出要么是0，要么是正数，这也就是说，ReLU函数也不是以0为中心的函数。

### 4.3、ReLU的几种变形
4.3.1、带泄露线性整流（Leaky ReLU）
在输入值 x 为负的时候，带泄露线性整流函数（Leaky ReLU）的梯度为一个常数 $$ \lambda \in (0,1) $$，而不是0。在输入值为正的时候，带泄露线性整流函数和普通斜坡函数保持一致。
$$ f(x)={\begin{cases}x&{\mbox{if }}x>0\\\lambda x&{\mbox{if }}x\leq 0\end{cases}} $$

4.3.2、参数线性整流（Parametric ReLU）
在深度学习中，如果设定 $$ \lambda $$  为一个可通过[反向传播算法](https://zh.wikipedia.org/wiki/%E5%8F%8D%E5%90%91%E4%BC%A0%E6%92%AD%E7%AE%97%E6%B3%95)（Backpropagation）学习的变量，那么带泄露线性整流又被称为参数线性整流（Parametric ReLU）

4.3.3、带泄露随机线性整流（Randomized Leaky ReLU, RReLU）
带泄露随机线性整流（Randomized Leaky ReLU, RReLU）最早是在Kaggle全美数据科学大赛（NDSB）中被首先提出并使用的。相比于普通带泄露线性整流函数，带泄露随机线性整流在负输入值段的函数梯度 $$ \lambda $$  是一个取自连续性均匀分布 $$ U(l,u) $$概率模型的随机变量，即

$$ f(x)={\begin{cases}x&{\mbox{if }}x>0\\\lambda x&{\mbox{if }}x\leq 0\end{cases}} $$
其中 $$ \lambda \sim U(l,u),l<u $$ 且 $$ l,u\in [0,1) $$。

ReLU函数的python 代码：
```python
# ReLU函数公式
def relu(x):
    if x < 0:
        y = 0
    else:
        y = x
    return y

# ReLU函数显示
def plot_relu():
    x = np.arange(-10,10,0.1)
    y = list(map(relu,x))
    
    # 设置坐标原点
    fig, ax = plt.subplots()
    # 隐藏上、右边
    ax.spines['right'].set_color('none')
    ax.spines['top'].set_color('none')
    # 设置左下边为轴
    ax.xaxis.set_ticks_position('bottom')
    ax.spines['bottom'].set_position(('data', 0))
    ax.yaxis.set_ticks_position('left')
    ax.spines['left'].set_position(('data', 0))
    ax.plot(x, y)

plot_relu()
```

## 5、softmax函数（[wiki](https://zh.wikipedia.org/wiki/Softmax%E5%87%BD%E6%95%B0)）
在数学，尤其是概率论和相关领域中，Softmax函数，或称归一化指数函数，是逻辑函数的一种推广。它能将一个含任意实数的K维向量  $$ \mathbf {z} $$ “压缩”到另一个K维实向量  $$ \sigma (\mathbf {z} )$$ 中，使得每一个元素的范围都在 (0,1) 之间，并且所有元素的和为1。该函数的形式通常按下面的式子给出：

$$ \sigma (\mathbf {z} )_{j}={\frac {e^{z_{j}}}{\sum _{k=1}^{K}e^{z_{k}}}} j \in (1,k)$$
如图所示：
![softmax](/images/softmax.png)

Softmax函数实际上是有限项离散概率分布的梯度对数归一化。因此，Softmax函数在包括 多项逻辑回归[1]:206–209 ，多项线性判别分析，朴素贝叶斯分类器和人工神经网络等的多种基于概率的多分类问题方法中都有着广泛应用。[2] 特别地，在多项逻辑回归和线性判别分析中，函数的输入是从K个不同的线性函数得到的结果，而样本向量 x 属于第 j 个分类的概率为：

$$ P(y=j|\mathbf {x} )={\frac {e^{\mathbf {x} ^{\mathsf {T}}\mathbf {w} _{j}}}{\sum _{k=1}^{K}e^{\mathbf {x} ^{\mathsf {T}}\mathbf {w} _{k}}}} $$  
这可以被视作K个线性函数 $$ \mathbf {x} \mapsto \mathbf {x} ^{\mathsf {T}}\mathbf {w} _{1},\ldots ,\mathbf {x} \mapsto \mathbf {x} ^{\mathsf {T}}\mathbf {w} _{K}$$ Softmax函数的复合（ $${\displaystyle \mathbf {x} ^{\mathsf {T}}\mathbf {w} } {\displaystyle \mathbf {x} }  {\displaystyle \mathbf {w} }$$ ）。

python 代码：
```python
# softmax函数
def softmax(x):
    y = np.exp(x)/sum(np.exp(x))
    return y

# softmax函数显示
def plot_softmax():
    x = np.arange(-5, 5, 0.1)
    y = softmax(x)
    # 设置坐标原点
    fig, ax = plt.subplots()
    # 隐藏上、右边
    ax.spines['right'].set_color('none')
    ax.spines['top'].set_color('none')
    # 设置左下边为轴
    ax.xaxis.set_ticks_position('bottom')
    ax.spines['bottom'].set_position(('data', 0))
    ax.yaxis.set_ticks_position('left')
    ax.spines['left'].set_position(('data', 0))
    ax.plot(x, y)
    # 设置边距
    ax.set_xticks(np.arange(-6, 6.1, 1))
    ax.set_yticks(np.arange(-0.01, 0.12, 0.01))

plot_softmax()
```
## 6、激活函数图
![active_wiki](/images/active_wiki.jpg)