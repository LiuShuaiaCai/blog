---
title: git 知识总结
date: 2017-04-24 09:32:11
categories: PHP
tags: git
---
## Git 一般使用步骤
## 1、What is git
git是一个分布式的版本控制系统。
<!-- more -->
## 2、Git与SVN的区别
|Number|Git|SVN|
|:----|:--|:--|
|1|分布式|集中式|
|2|元数据存储|文件存储|
|3|本地服务器|中央服务器|
|4|可以不联网|必须要有网络|
## 3、Git命令
#### 3.1、git基本步骤
    
    1、创建本地仓库
    git init <filename>
    2、检出仓库
    git clone <path>
    3、把文件添加到缓存区
    git add .|git add <filename>
    4、提交文件到本地仓库
    git commit -m '修改注释'
    5、把文件推送到远程仓库
    git push
    
#### 3.2、git常用命令
|命令|说明|
|:---|:---|
|git status|查看修改状态<br />参数-s以简短形式输出结果|
|git push|把文件推送到远程仓库<br />将本地的master分支推送到origin主机的master分支。如果后者不存在，则会被新建:git push origin master<br />如果当前分支只有一个追踪分支，那么主机名都可以省略:git push|
|git pull|取回远程主机某个分支的更新，再与本地的指定分支合并<br />取回origin主机的next分支，与本地的master分支合并:git pull origin next:master<br />如果远程分支是与当前分支合并，则冒号后面的部分可以省略:git pull origin next<br />等同于先做git fetch origin，再做git merge origin/next<br />如果当前分支与远程分支存在追踪关系，git pull就可以省略远程分支名:git pull origin<br />如果当前分支只有一个追踪分支，连远程主机名都可以省略:git pull|
|git diff|查看执行 git status 的结果的详细信息<br />* 尚未缓存的改动：git diff<br />* 查看已缓存的改动： git diff --cached<br />* 查看已缓存的与未缓存的所有改动：git diff HEAD<br />* 显示摘要而非整个 diff：git diff --stat|
|git config|配置用户名和邮箱地址<br />git config --global user.name 'runoob'<br />git config --global user.email test@runoob.com|
|git reset HEAD|取消已经缓存的内容<br />git reset HEAD --change.php|
|git rm|从缓存区删除文件<br />将文件从缓存区和你的硬盘中（工作目录）删除：git rm file<br />只删除缓存区的文件：git rm --cached|
|git mv|重命名磁盘文件|
|git branch|分支管理:http://www.runoob.com/git/git-branch.html|

_参考教程_
* [http://www.yiibai.com/git](http://www.yiibai.com/git)
* [http://www.runoob.com/git](http://www.runoob.com/git)
* [廖雪峰的官方网站](http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)
* [http://www.bootcss.com/p/git-guide/](http://www.bootcss.com/p/git-guide/)

