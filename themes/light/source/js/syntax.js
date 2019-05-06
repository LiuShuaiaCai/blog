$('.gutter>pre>span').each(function(){
	var index = $(this).html();
	if(index > 15){
		$(this).css('display','none');
		$(this).next('br').css('display','none');
		$(this).parents('.gutter').next('.code').find('.line').eq(index).css('display','none');
		$(this).parents('.gutter').next('.code').find('br').eq(index).css('display','none');
	}
})
$('.gutter>pre').each(function(){
	var last = $(this).find('.line').last().html();
	if(last > 15){
		var tr = "<tr style='color:#ddd'><td colspan='2'><a onclick='showall(this)' data='0' href='javascript:;'>>> 查看全部代码</a></td></tr>";
		$(this).parents('tbody').append(tr);
	}
})

function showall(obj){
	var data = $(obj).attr('data');
	if(data == '0'){
		$(obj).parents('tbody').find('.line').css('display','');
		$(obj).parents('tbody').find('br').css('display','');
		$(obj).html('>> 隐藏代码').attr('data','1');
	}else{
		$(obj).html('>> 查看全部代码').attr('data','0');
		$(obj).parents('tr').prev('tr').find('.line').each(function(){
			var index = $(this).html();
			if(index > 15){
				$(this).css('display','none');
				$(this).next('br').css('display','none');
				$(this).parents('.gutter').next('.code').find('.line').eq(index).css('display','none');
				$(this).parents('.gutter').next('.code').find('br').eq(index).css('display','none');
			}
		})
	}
}