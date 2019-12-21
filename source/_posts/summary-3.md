---
title: 三月份工作总结
date: 2017-04-10 14:58:30
categories: 前端
tags: ['ajax分页','多文件上传']
---
终于闲下来了，趁此时间把三月份总结一下
## 1、Ajax分页
企业购的后台模板管理、楼层管理中用到的ajax分页（商品的选择、搜索），自己写了一下，还不是很完整，先记录一下（注：下面的数据都是修改过的，不会对我们的网站产生任何影响）。
<!-- more -->
#### 1.1、html代码
```html
<!--data的值要和input的name相同-->
<div class="editbrand floor" data="brand_sn" style="height: 535px;">
    <span class="cancel">×</span>
    <div>品牌名称：<input name="name" placeholder="输入品牌名称" type="text" /><input id="brand_seach" type="button" value="搜索" style="margin-left: 12px;"/></div>
    <div>注释：最多可选择4个品牌</div>
    <table border="1" bordercolor="#ddd" style="border-collapse: collapse;border-spacing: 0;">
        <thead>
        <tr>
            <th>品牌编号</th>
            <th>品牌名称</th>
            <th>LOGO</th>
            <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <volist name="brand" id="item">
            <tr>
                <td>{$item.brand_sn}</td>
                <td>{$item.brand_name}</td>
                <td><img style="width: 100px;height: 30px" src="{$item.filepath}" alt="" /></td>
                <td><input onclick="selects(this, 'brand_sn', 4, '最多只能选择4个品牌')" value="{$item.brand_sn}" type="checkbox" /></td>
            </tr>
        </volist>
        </tbody>
    </table>
    <div id="brand_page"></div>
</div>

```
#### 1.2、javascript代码
```javascript
//调用ajaxpage分页方法
app ="__APP__";
$('#brand_page').ajaxPage({
    pages:"<?php echo $brand_pages; ?>",
    type: 'brand',
})
$('#product_page').ajaxPage({
    pages:"<?php echo $product_pages; ?>",
    type: 'product',
})

//如果有搜索的话，要有每页显示的条数
number = "<?php echo $number; ?>";
f_id = "<?php echo $_GET['f_id']==''?'0':$_GET['f_id']; ?>";
 ```
 #### 1.3、ajaxPage方法
 （需要根据具体情况需要更改）
```javascript
 /**
 * @param id 元素的id
 */
function style(obj) {
    //所以a的样式
    obj.children('a').css({
        'color': '#666',
        'padding': '0 5px',
        'text-decoration': 'none',
        'border': '1px solid #ccc',
        'margin-left': '5px',
        'display':'block',
        'float': 'left',
        'min-width': '28px',
        'text-align': 'center',
    }).attr({'href':'javascript:;','data':'no_current'});

    //第一个页码的样式
    obj.children('a[class=num]').first().css({'background': '#ff6200','color': '#fff'}).attr('data','current');

    // obj.children('a[data=no_current]').mouseover(function () {
    //     $(this).css({'background': '#ff6200','color': '#fff'})
    // }).mouseout(function () {
    //     $(this).css({'background': '#fff','color': '#666'})
    // })


}

/**
 * @param pages 每页显示的条数
 * @param num 页码显示的数量
 * @param type 多次调用的类型区分
 */
$.fn.extend({
    ajaxPage:function(settings) {
        //设置参数默认值
        // var pages =13;
        // var num = 10;
        var defaultSetting={
            pages:13,
            num:10,
            type:'',
        };
        $.extend(defaultSetting,settings);

        var pages = defaultSetting.pages;
        var num = defaultSetting.num;
        var type = defaultSetting.type;

        //分页页码
        var page = "<a class='prev'>上一页</a>";
        if(pages < num){
            num = pages;
        }
        for(var i=1; i<=num; i++){
            page += "<a class='num'>"+i+"</a>";
        }
        page += "<a class='next'>下一页</a>";
        page += "<span>共"+pages+"页</span>";
        var obj = $(this);
        obj.html(page);

        //调用样式
        style(obj);

        //每个页码的点击事件
        obj.children('a[class=num]').click(function () {
            //获取当前的页码
            var current = parseInt($(this).html());
            //获取显示的第一个页码
            var first = parseInt(obj.children('a[class=num]').first().html());
            //获取显示的最后一个页码
            var last = parseInt(obj.children('a[class=num]').last().html());
            //获取中间的页码
            var middle = parseInt((first+last)/2);
            //当前索引
            var index = $(this).index();
            //改变页码的样式
            $(this).css({'background': '#ff6200','color': '#fff'}).siblings('a[class=num]').css({'background': '#fff','color': '#666'});
            $(this).attr('data','current').siblings().attr('data','no_current');
            //增加、减小页码,如果当前页码小于中间页码，所有值减一，反之。两个极值（最大、最小）
            if(last < pages){
                    if(current > middle){
                        a_each(obj, 'add', current)
                    }else{
                        if(first > 1){
                            a_each(obj, 'reduce', current)
                        }
                    }
            }else if(last == pages && first > 1 && current < middle){
                a_each(obj, 'reduce', current)
            }

            //请求数据
            ajax_request(obj,current,type);

        })

        //上一页、下一页
        obj.find('.prev,.next').mouseover(function () {
            $(this).css({'background': '#ff6200','color': '#fff'});
        }).click(function () {
            //判断是上一页还是下一页
            var html_val = $(this).html();
            //当前页码
            var current = parseInt(obj.find('a[data=current]').html());
            //获取显示的第一个页码
            var first = parseInt(obj.children('a[class=num]').first().html());
            //获取显示的最后一个页码
            var last = parseInt(obj.children('a[class=num]').last().html());
            //请求的页码
            var request_page = '1';

            if(html_val == '上一页' && current>1){
                if(first>1){
                    a_each(obj, 'reduce', current-1)
                }else{
                    a_each(obj, 'reduce_end', current-1)
                }
                request_page = current-1;
            }else if(html_val == '下一页' && current<last){
                if(last<pages){
                    a_each(obj, 'add', current+1)
                }else{
                    a_each(obj, 'add_end', current+1)
                }
                request_page = current+1;
            }else{
                request_page = current;
            }

            //请求数据
            ajax_request(obj,request_page,type);
        }).mouseout(function () {
            $(this).css({'background': '#fff','color': '#666'});
        })
    }
});
//a标签的遍历
function a_each(obj, mark, current) {
    obj.children('a[class=num]').each(function () {
        var a_val = parseInt($(this).html());
        if(mark == 'add'){
            $(this).html(a_val+1);
            var ack = a_val+1;
        }else if(mark == 'reduce'){
            $(this).html(a_val-1);
            var ack = a_val-1;
        }else{
            var ack = a_val;
        }
        //改变页码的样式
        if(ack == current){
            $(this).attr('data','current').siblings().attr('data','no_current');
            $(this).css({'background': '#ff6200','color': '#fff'}).siblings('a[class=num]').css({'background': '#fff','color': '#666'});
        }
    })
}

/*************************************以上是实现分页，下面是ajax请求数据**********************************/

//品牌的搜索
$('#brand_seach').click(function () {
    var obj = $('#brand_page');
    ajax_request(obj,1,'brand',true);
})
//商品的搜索
$('#product_seach').click(function () {
    var obj = $('#product_page');
    ajax_request(obj,1,'product',true);
})

/**
 * @param obj 分页的DIV对象
 * @param page 当前的页码
 * @param type 多次调用的类型区分
 * @param seach 是否再次调用分页方法:false，不调用；true调用（默认：false）
 */
function ajax_request(obj,page,type,seach) {
    var seach = seach||false;
    if(type=='brand'){
        var name = $('input[name=name]').val();
        var data = {'type':'brand','page':page,'name':name,'mf_id':mf_id,'seach':seach};
    }else if(type=='product'){
        var sn = $('input[name=sn]').val();
        var product_name = $('input[name=product_name]').val();
        var category = $('input[name=category]').val();
        var brand_name = $('input[name=brand_name]').val();
        var data = {'type':'product','page':page,'sn':sn,'product_name':product_name,'category':category,'brand_name':brand_name,'mf_id':mf_id,'seach':seach};
    }
    $.ajax({
        url:app+'/Home/Floor/first/',
        data:data,
        type:'post',
        datatype:'json',
        success:function (response) {
            // console.log(response);
            var brand_html = '';
            //返回的数据
            var response_result = response.response_result;
            //返回的数量
            var response_count = response.response_count;
            //填充数据
            if(type=='brand'){
                $.each(response_result,function (index,object) {
                    brand_html += "<tr><td>"+object.brand_sn+"</td><td>"+object.brand_name+"</td><td><img style='height: 30px;width: 100px' src='"+object.filepath+"' alt='"+object.brand_name+"' /></td><td><input onclick=\"selects(this, 'brand_sn',4,'最多只能选择4个品牌')\" value='"+object.brand_sn+"' type='checkbox' /></td></tr>";
                })
            }else if(type == 'product'){
                $.each(response_result,function (index,object) {
                    brand_html += "<tr><td>"+object.id+"</td><td>"+object.sn+"</td><td>"+object.name+"</td><td><img style='width: 25px;height: 25px' src='"+object.filepath+"' alt='"+object.name+"'></td><td>"+object.format+"</td><td>"+object.cate_name+"</td><td>"+object.brand_name+"</td><td><input onclick=\"selects(this, 'product_id', 8, '最多只能选择8个商品')\" value='"+object.id+"' type='checkbox' /></td></tr>";
                })
            }
            obj.siblings('table').find('tbody').html(brand_html);
            //调用选择的状态
            select_status(obj)
            //搜索调用分页
            if(seach){
                if(response_count>number){
                    response_length = Math.ceil(response_count/10);
                }else{
                    response_length = 1;
                }
                obj.ajaxPage({
                    pages:response_length,
                    type:type,
                })
            }
        }
    })
}

/*************************************以上是ajax请求数据，下面是品牌、商品的挑选状态*****************************/
/**
 * @param obj 分页的DIV对象
 */
function select_status(obj) {
    // 获取选择的品牌
    var element_name = obj.parents('.floor').attr('data');
    var select_brand = $('input[name='+element_name+']').val();
    if(select_brand != ''){
        select_brand = $.unique(select_brand.split(','))
    }

    obj.siblings('table').find('input[type=checkbox]').each(function () {
        var checkbox_val = $(this).val();
        if($.inArray(checkbox_val, select_brand) != -1){
            // console.log(checkbox_val)

            $(this).attr('checked','checked');
        }
    });
}


/*************************************以上是ajax请求数据，下面是品牌、商品的挑选*****************************/
/**
 * @param obj 分页的DIV对象
 * @param element_name 元素的名称（brand_sn|product_id）
 * @param max_num 元素element_name值的最大长度
 * @param message 如果element_name大于max_num时的提示信息
 */
function selects(obj, element_name, max_num, message){
    // 获取选择的品牌或者商品
    var select_elemet = $('input[name='+element_name+']').val();
    if(select_elemet == ''){
        arrs = new Array();
    }else{
        arrs = $.unique(select_elemet.split(','))
    }
    var select_value = $(obj).val();
    if($(obj).is(":checked") == true){
        if(arrs.length < max_num){
            arrs.push(select_value);
        }else{
            alert(message);
            $(obj).removeAttr('checked');
            return false;
        }
    }else{
        if($.inArray(select_value,arrs) != -1){
            arrs.splice($.inArray(select_value,arrs),1);
        }
    }

    var select_str = arrs.join(',');
    $('input[name='+element_name+']').val(select_str);
}
```
#### 1.4、PHP代码
```php
$page = (int)$_POST['page'];
$current = ($page-1) * $number;
$type = I('post.type');
$f_id = I('post.f_id');

if($type=='brand'){
    $name = preg_replace('# #','',$_POST['name']);
    $where['brand_name'] = array('like',$name.'%');
    $result = $indexFloor->brand_all($where,$f_id);
}elseif($type=='product'){
    $sn = preg_replace('# #','',$_POST['sn']);
    $product_name = preg_replace('# #','',$_POST['product_name']);
    $category = preg_replace('# #','',$_POST['category']);
    $brand_name = preg_replace('# #','',$_POST['brand_name']);
    if(!empty($sn)){
        $where['p.sn'] =$sn;
    }
    if(!empty($product_name)){
        $where['p.name'] = array('like',$product_name.'%');
    }
    if(!empty($category)){
        $where['cate.cat_id'] = $category;
    }
    if(!empty($brand_name)){
        $where['brand.brand_name'] = array('like',$brand_name.'%');
    }

    $result = $indexFloor->product_all($where,$f_id);
}

//返回数据
$response_count = count($result);
$response_result = array_splice($result, $current, $number);
$response_data = array('response_count'=>$response_count,'response_result'=>$response_result);
$this->ajaxReturn($response_data);
```
## 2、基于ThinkPHP的多文件上传
#### 2.1、MyMoreUpload类的调用方法
```php
#upload方法的参数，只能是upload(更新)或者add(新增)
require './ThinkPHP/Library/Org/MyMoreUpload.class.php';
$files_mf['mf_img'] = $_FILES['mf_img'];
$upload_mp = new \MyMoreUpload($files_mf);
$mf_res = $upload_mp->upload('update');
if(!empty($mf_res[0])){
    $data['mf_img'] = $mf_res[0];
}
```
#### 2.2、MyMoreUpload类
```php
<?php
    header("Content-type: text/html; charset=utf-8");
    /**
     * Auth:LiuShuaiCai
     * Class MyMoreUpload 适合多文件上传，单文件请用MyUpload
     * require './ThinkPHP/Library/Org/MyMoreUpload.class.php';
     * $files['mp_ing'] = $_FILES['mp_img'];
     * $upload=new \MyMoreUpload($files);
     * $mp_res=$upload->upload('add');
     *
     * Param $files 传入的参数
     * Param $config 上传配置
     * Param $error 错误信息
     * Param $mark 标志：add->添加，update->更新
     * Param $sortfiles 整理后的数组
     * Param $_files 判断后的数组
     * Return Array $filepath 最后返回的图片路径
     */
	class MyMoreUpload{
		protected $files = array();
		protected $config = array();
		protected $error = array();
		protected $mark = array('add','update');
		protected $sortfiles = array();
		protected $_files = array();
		protected $filepath = array();
		public function __construct($files,$config=array()){
    		if(!empty($files)){
    			$this->files = $files;
    		}else{
                $this->files = $_FILES;
    		}
    
    		if(!empty($config)){
    			$this->config = $config;
    		}
    		//对多个上传的图片进行整理
    		foreach ($this->files as $name=>$file) {
    		  $count = count($file['name']);
			    if($count==1){
			        $check = is_array($file['name']);
			        if($check){
                        for($key=0; $key<$count; $key++){
                            $this->sortfiles[$name.$key] = array(
                                'name' => $file['name'][$key],
                                'type' => $file['type'][$key],
                                'tmp_name' => $file['tmp_name'][$key],
                                'error' => $file['error'][$key],
                                'size' => $file['size'][$key],
                            );
                        }
                    }else{
                        $this->sortfiles[$name] = $file;
                    }
                }else{
			        for($key=0; $key<$count; $key++){
                        $this->sortfiles[$name.$key] = array(
			                'name' => $file['name'][$key],
                            'type' => $file['type'][$key],
                            'tmp_name' => $file['tmp_name'][$key],
                            'error' => $file['error'][$key],
                            'size' => $file['size'][$key],
                        );
                    }
                }
            }
        }

		public function __call($function_name, $args){
			echo "你所调用的函数：$function_name(参数：<br />";
		    var_dump($args);
		    echo ")不存在！";
		}

		public function upload($mark){
			$mark=strtolower($mark);
			if(!in_array($mark, $this->mark)){
				echo '函数参数为 add OR update，页面3秒后返回上一页';
				echo '<script>setTimeout(function(){window.location="'.$_SERVER["HTTP_REFERER"].'";},3000);</script>';
				die;
			}
			$num = 0;
//			dump($this->sortfiles);die;
            foreach ($this->sortfiles as $single_key=>$single_file){
                $error=$single_file['error'];
                if($error!=0){
                    if($mark=='update'){
                        $this->filepath[$num] = '';
                    }else{
                        echo "第{$num}张图片为空，上传失败，页面3秒后返回上一页";
                        echo '<script>setTimeout(function(){window.location="' . $_SERVER["HTTP_REFERER"] . '";},3000);</script>';
                        die;
//                        $this->error[] = $error_message;
//                        $this->filepath[$num] = '';
                    }
                }elseif($error==0){
                    $this->_files[$num][$single_key] = $single_file;
                }
                $num ++;
            }
//            dump($this->error);
//            dump($this->_files);

            if(empty($this->config)){
                $this->config=array(
                    'maxSize'=>1024*1024*2,
                    'exts'=>array('jpg', 'gif', 'png', 'jpeg'),
                    'rootPath'=>'./Public/Upload',
                    'savePath'=>'/siteadmin/Subject/',
                    'subName'=>array('date','Ymd')
                );
            }
            //实例化上传类
            $upload=new \Think\Upload($this->config);
			if(!empty($this->_files)) {
                foreach ($this->_files as $numkey=>$item) {
                    //调用upload方法，上传文件
                    $info = $upload->upload($item);
                    $name = key($info);
                    if($info){
                        $this->filepath[$numkey] = '/Public/Upload' . $info[$name]['savepath'] . $info[$name]['savename'];
                    }else{
                        echo '图片'.$numkey.'上传失败:'.$upload->getError().'，页面3秒后返回上一页';
                        echo '<script>setTimeout(function(){window.location="' . $_SERVER["HTTP_REFERER"] . '";},3000);</script>';
                    }
			    }
            }
//            dump($this->filepath);
			//返回文件路径
			return $this->filepath;
		}
	}
```
## 3、对多维数组进行排序
```php
$arrs = array(
	'0' => array(
		'name' => 'Tom',
		'age' => 23,
	),

	'1' => array(
		'name' => 'Tom',
		'age' => 20,
	),

	'2' => array(
		'name' => 'Tom',
		'age' => 25,
	),
);

foreach ($arrs as $key => $value) {
	$sort[$key] = $value['age'];
}

array_multisort($sort, SORT_DESC, $arrs);

echo "<pre>";
print_r($arrs);
/**
结果：
Array
(
    [0] => Array
        (
            [name] => Tom
            [age] => 25
        )

    [1] => Array
        (
            [name] => Tom
            [age] => 23
        )

    [2] => Array
        (
            [name] => Tom
            [age] => 20
        )

)
**/
```

附件：
[jquery.ajaxpage.js](https://portal.qiniu.com/)
[MyMoreUpload.class.php](http://onx0p7mg5.bkt.clouddn.com/MyUpload.class.php?attname=)
[MyUpload.class.php](http://onx0p7mg5.bkt.clouddn.com/MyUpload.class.php?attname=)