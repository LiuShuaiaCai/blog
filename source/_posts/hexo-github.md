---
title: hexo+github 搭建个人博客
date: 2017-04-04 22:25:16
categories: hexo
tags: ['Hexo','github']
---

> 回头想想自己一直在摆弄着买空间、域名、vps，买了一年的空间马上就有到了，想着换一个vps，后来看了看github个人博客，感觉还不错，博客就是记录自己的在工作中的遇到的问题以及对工作的总结，这个应该够用了。所以就在网上搜了一下，发现有好多hexo主题，个人比较喜欢简单的，最后选择了[hexo-theme-light](https://github.com/hexojs/hexo-theme-light).进行了简单的修改,博客刚成型，还在修改中，先记录一下。<!--more--> 

博客需要准备：
* github帐号
* 域名（非必须）
* nodejs环境
以上这些东西不知道怎么弄就百度 ，主要记录一下自己比较陌生的几个地方。

### 1、配置SSH Key 
使用ssh key解决本地和github的链接问题，获取github权限，提交代码到github
检查是否存在ssh密钥
```
cd ~/.ssh
```
如果提示：No such file or directory 说明你是第一次使用git。
```
ssh-keygen -t rsa
```
然后连续3次回车，最终会生成一个文件在用户目录下，打开用户目录，找到.ssh\id_rsa.pub文件，记事本打开并复制里面的内容，打开你的github主页，进入个人设置 -> SSH and GPG keys -> New SSH key：将刚复制的内容粘贴到key那里，title随便填，保存。
测试是否成功
```
$ ssh -T git@github.com # 注意邮箱地址不用改
```
如果提示：Are you sure you want to continue connecting (yes/no)?，输入yes，然后会看到：

	Hi liushuaicai! You've successfully authenticated, but GitHub does not provide shell access.

看到这个信息说明SSH已配置成功！
此时你还需要为git设置用户名和邮箱：
```
$ git config --global user.name "liushuaicai"// 你的github用户名，非昵称
$ git config --global user.email  "xxx@qq.com"// 填写你的github注册邮箱
```

### 2、上传代码到github
安装hexo-deployer-git插件（也可用淘宝 NPM 镜像cnpm安装）
```
npm install hexo-deployer-git --save
```
配置_config.yml（在文件中加入以下内容）：

	deploy:
	  type: git
	  repository: git@github.com:LiuShuaiaCai/liushuaicaiblog.github.io.git
	  branch: master

然后用 hexo g 命令生成public文件夹，不要忘记在提交代码之前github上的代码clone一份，然后把clone下来的CNAME文件cp一份到刚生成的public文件夹（CNAME文件中是在前面的域名绑定时生成的文件，里面是你的域名），不然会提交失败。最后用 hexo d 提交到github，会把以前的代码覆盖。

### 3、[本地的搜索引擎](http://hahack.com/codes/local-search-engine-for-hexo/#%E5%AE%89%E8%A3%85%E5%92%8C%E9%85%8D%E7%BD%AE-hexo-generator-search)
以下是我复制的内容，为了自己以后使用方便，大家可以去作者的[网站](http://hahack.com/codes/local-search-engine-for-hexo/#%E5%AE%89%E8%A3%85%E5%92%8C%E9%85%8D%E7%BD%AE-hexo-generator-search)看更详细的介绍
安装和配置 hexo-generator-search

```
$ npm install --save hexo-generator-search
```
然后，在站点根 _config.yml 里头添加设置项：

	search:
	  path: search.xml
	  field: post

其中：

    path - 指定生成的索引数据的文件名。默认为 search.xml 。
    field - 指定索引数据的生成范围。可选值包括：
        post - 只生成博客文章（post）的索引（默认）；
        page - 只生成其他页面（page）的索引；
        all - 生成所有文章和页面的索引。

完成后，可以试试访问预览站点的 search.xml 页面。例如，如果你的预览站点域名是 http://0.0.0.0:4000 ，那么可以访问 http://0.0.0.0:4000/search.xml 看看是否会打开一个 xml 页面。
编写搜索界面

搜索界面由一个输入框（input）和一个用于动态插入搜索结果的 div 组成。例如：
```html
<div id="site_search">
  <input type="text" id="local-search-input" name="q" results="0" placeholder="search my blog..." class="form-control"/>
  <div id="local-search-result"></div>
</div>
```
你也可以根据自己的喜好写成其他的形式，例如把用于插入结果的 div 移动到页面的其他地方。
实现本地搜索函数

接下来编写一个 search.js 脚本，用来实现基于 search.xml 的本地检索函数 searchFunc ：
```javascript
var searchFunc = function(path, search_id, content_id) {
    'use strict';
    $.ajax({
        url: path,
        dataType: "xml",
        success: function( xmlResponse ) {
            // get the contents from search data
            var datas = $( "entry", xmlResponse ).map(function() {
                return {
                    title: $( "title", this ).text(),
                    content: $("content",this).text(),
                    url: $( "url" , this).text()
                };
            }).get();
            var $input = document.getElementById(search_id);
            var $resultContent = document.getElementById(content_id);
            $input.addEventListener('input', function(){
                var str='<ul class=\"search-result-list\">';                
                var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
                $resultContent.innerHTML = "";
                if (this.value.trim().length <= 0) {
                    return;
                }
                // perform local searching
                datas.forEach(function(data) {
                    var isMatch = true;
                    var content_index = [];
                    var data_title = data.title.trim().toLowerCase();
                    var data_content = data.content.trim().replace(/<[^>]+>/g,"").toLowerCase();
                    var data_url = data.url;
                    var index_title = -1;
                    var index_content = -1;
                    var first_occur = -1;
                    // only match artiles with not empty titles and contents
                    if(data_title != '' && data_content != '') {
                        keywords.forEach(function(keyword, i) {
                            index_title = data_title.indexOf(keyword);
                            index_content = data_content.indexOf(keyword);
                            if( index_title < 0 && index_content < 0 ){
                                isMatch = false;
                            } else {
                                if (index_content < 0) {
                                    index_content = 0;
                                }
                                if (i == 0) {
                                    first_occur = index_content;
                                }
                            }
                        });
                    }
                    // show search results
                    if (isMatch) {
                        str += "<li><a href='"+ data_url +"' class='search-result-title'>"+ data_title +"</a>";
                        var content = data.content.trim().replace(/<[^>]+>/g,"");
                        if (first_occur >= 0) {
                            // cut out 100 characters
                            var start = first_occur - 20;
                            var end = first_occur + 80;
                            if(start < 0){
                                start = 0;
                            }
                            if(start == 0){
                                end = 100;
                            }
                            if(end > content.length){
                                end = content.length;
                            }
                            var match_content = content.substr(start, end); 
                            // highlight all keywords
                            keywords.forEach(function(keyword){
                                var regS = new RegExp(keyword, "gi");
                                match_content = match_content.replace(regS, "<em class=\"search-keyword\">"+keyword+"</em>");
                            });
                            
                            str += "<p class=\"search-result\">" + match_content +"...</p>"
                        }
                        str += "</li>";
                    }
                });
                str += "</ul>";
                $resultContent.innerHTML = str;
            });
        }
    });
}
```
searchFunc 包含三个参数：

    path - 用 hexo-generator-search 生成的搜索索引文件的路径。注意这个 path 和前面 hexo-generator-search 的 path 选项有所不同。这里的 path 才是指这个文件的路径，而前面的 path 指的是生成的文件名 2 2也许第二个 path 叫 filename 更合适。 ；
    search_id - 搜索框的 id 。对于我们的例子，就是 local-search-input;
    content_id - 结果框的 id 。对于我们的例子，就是 local-search-result。

调用搜索函数

有了上面的检索函数，接下来可以在适当时机调用它。由于 path 的实际地址是根 _config.yml 里 config.root + config.search.path 两个值组成，所以我们最好将这个调用写在页面模板中，以方便获取站点的设置信息。例如，对于 ejs 模板：
```javascript
<script type="text/javascript">      
     var search_path = "<%= config.search.path %>";
     if (search_path.length == 0) {
     	search_path = "search.xml";
     }
     var path = "<%= config.root %>" + search_path;
     searchFunc(path, 'local-search-input', 'local-search-result');
</script>
```
至此就完成了本地检索引擎的实线，最后的工作就是修改样式，让检索页面更美观。在 searchFunc 函数中，我已经为几个关键的页面元素设定了 css 名：

    ul.search-result-list - 搜索结果列表的样式名；
    a.search-result-title - 搜索结果文章标题的样式名；
    p.search-result - 搜索结果每篇文章的预览段落的样式名；
    em.search-keyword - 搜索结果每篇文章的预览段落中匹配关键词的样式名。

最后给出 hexo-theme-freemind 主题的相关样式：
```css
ul.search-result-list {
  padding-left: 10px;
}
a.search-result-title {
  font-weight: bold;
}
p.search-result {
  color=#555;
}
em.search-keyword {
  border-bottom: 1px dashed #4088b8;
  font-weight: bold;
}
```

## 4、更换googleapis相关的链接
4.1 文件 layout/_partial/after_footer.ejs
找到

	ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js

替换为

	ajax.useso.com/ajax/libs/jquery/2.0.3/jquery.min.js

4.2 文件 source/css/_base/variable.styl
找到

	fonts.googleapis.com/css?family=Lato:400,400italic

替换为	

	fonts.useso.com/css?family=Lato:400,400italic

4.3 文件 layout/_partial/head.ejs
找到

	fonts.googleapis.com/css?family=Source+Code+Pro

替换为

	fonts.useso.com/css?family=Source+Code+Pro

## 5、分享
默认自带的是AddThis，进文章一看便发现都是分享到facebook、twitter等之类的网站，换成百度分享。
5.1 文件 layout/_partial/post/share.ejs
内容全部替换为
```javascript
<div class="bdsharebuttonbox">
    <a href="#" class="bds_more" data-cmd="more"></a>
    <a href="#" class="bds_qzone" data-cmd="qzone"></a>
    <a href="#" class="bds_tsina" data-cmd="tsina"></a>
    <a href="#" class="bds_tqq" data-cmd="tqq"></a>
    <a href="#" class="bds_renren" data-cmd="renren"></a>
    <a href="#" class="bds_weixin" data-cmd="weixin"></a>
</div>

<script>
    window._bd_share_config = {
        "common": {
            "bdSnsKey": {},
            "bdText": "",
            "bdMini": "2",
            "bdPic": "",
            "bdStyle": "0",
            "bdSize": "16"
        },
        "share": {},
        "image": {
            "viewList": ["qzone", "tsina", "tqq", "renren", "weixin"],
            "viewText": "分享到",
            "viewSize": "16"
        },
        "selectShare": {
            "bdContainerClass": null,
            "bdSelectMiniList": ["qzone", "tsina", "tqq", "renren", "weixin"]
        }
    };
    with(document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)];
</script>
```

## 6、评论: (默认自带的是disqus,换成多说)
6.1 文件 hexo/_config.yml
添加

	duoshuo_shortname: xxx

注：其实xxx是你在多说系统注册的一个shortname，这方面自行科普。
6.2 全局载入多说的js，在layout/_partial/after_footer.ejs尾部中加入如下代码
```javascript
<script type="text/javascript">
var duoshuo_shortname = '<%= config.duoshuo_shortname %>';
var duoshuoQuery = {short_name:duoshuo_shortname};
    (function() {
        var ds = document.createElement('script');
        ds.type = 'text/javascript';ds.async = true;
        ds.src = 'http://static.duoshuo.com/embed.js';
        ds.charset = 'UTF-8';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ds);
    })();
</script>
```
6.3 显示正文评论，文件 layout/_partial/comment.ejs
全文替换为
```javascript
<% if (page.comments){ %>
    <section id="comment">
        <h1 class="title"><%= __('comment') %></h1>
        <div class="ds-thread" data-thread-key="<%- item.path %>"></div>
    </section>
<% } %>
```
6.4 显示列表评论数，文件 layout/_partial/article.ejs
找到
```html
<% if (item.comment && config.disqus_shortname){ %>
    <div class="alignright">
         <a href="<%- item.permalink %>#disqus_thread" class="comment-link">Comments</a>
    </div>
<% } %>
```
替换为
```html
<% if (!item.comment){ %>
    <a href="<%- config.root %><%- item.path %>" class="ds-thread-count comment-link alignright" data-thread-key="<%- item.path %>" data-count-type="comments"></a>
<% } %>
```
## 7、添加RSS
hexo提供了RSS的生成插件，需要手动安装和设置。步骤如下：
* 安装RSS插件到本地：npm install hexo-generator-feed
* 在站点添加链接：
    
    在themes/light/_config.yml中，编辑 rss: /atom.xml
    
    
>其他功能修改查看下面的博客链接
## 8、常用hexo命令
常见命令

	hexo new "postName" #新建文章
	hexo new page "pageName" #新建页面
	hexo generate #生成静态页面至public目录
	hexo server #开启预览访问端口（默认端口4000，'ctrl + c'关闭server）
	hexo deploy #部署到GitHub
	hexo help  # 查看帮助
	hexo version  #查看Hexo的版本
    
缩写：

	hexo n == hexo new
	hexo g == hexo generate
	hexo s == hexo server
	hexo d == hexo deploy

组合命令：

	hexo s -g #生成并本地预览
	hexo d -g #生成并上传

文章的格式如下：

	---
	title: postName #文章页面上的显示名称，一般是中文
	date: 2013-12-02 15:30:16 #文章生成时间，一般不改，当然也可以任意修改
	categories: 默认分类 #分类
	tags: [tag1,tag2,tag3] #文章标签，可空，多标签请用格式，注意:后面有个空格
	description: 附加一段文章摘要，字数最好在140字以内，会出现在meta的description里面
	---

	以下是正文

#### 参考文章:
*[青春不再 | 马加油DE博客](http://www.mjiayou.com/2014/08/18/hexo-theme-modify-based-light/)*
*[蓝江老涌-简书](http://www.jianshu.com/p/70343b7c2fd3)*
*[小茗同学的博客园](http://www.cnblogs.com/liuxianan/p/build-blog-website-by-hexo-github.html)*
*[在Hexo主题中新添加resume布局](http://www.jianshu.com/p/347e7a0919ed)*
*[hexo搭建博客的实用功能(下)(基于hexo3.0) ](http://opiece.me/2015/04/16/hexo-guide-3/)*
*[Hexo：（三）高级进阶](http://www.ituring.com.cn/article/199294?utm_source=tuicool&utm_medium=referral)*
*[极客学院](http://wiki.jikexueyuan.com/project/hexo-document/)*

>到此为止我的第一篇github博客算是完成了，Time：2017/04/05 凌晨03点25分