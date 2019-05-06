scroll = function(){
	$('.toc-text').each(function(){
		var id = $(this).html();
		// var reg = /\./;
		id = id.replace('.','-');
		id = id.replace(' | ','-');
		id = id.replace('_','-');
		var reg = new RegExp( ' ' , "g" )
		id = id.replace(reg,'-');
		// console.log(id)
		// console.log($('#'+id).offset())
		mTop = $('#'+id).offset().top;
		sTop = $(window).scrollTop();
		result = mTop - sTop;
		if(result > 0 && result < 50){
			$('.toc-text').css('color','#eee');
			$(this).css('color','#258fb8');
			return false;
		}
	})
}
scroll();
$(window).scroll(function() {
  scroll();
});

$('#r_top a').click(function(){
	scroll();
})
// 页面元素距离浏览器工作区顶端的距离 = 元素距离文档顶端偏移值 - 网页被卷起来的高度
// 即：

// 页面元素距离浏览器工作区顶端的距离 = DOM元素对象.offsetTop - document.documentElement.scrollTop 
$('.toc-text').click(function(){
	$('.toc-text').css('color','#eee');
	$(this).css('color','#258fb8');
})

var body_width = $(document.body).width();
if(body_width < 1266){
	$('#sidebar').css('display','no');
}




