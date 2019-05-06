var availHeight =  window.screen.availHeight/2-75+'px';
var r_top = document.getElementById('r_top');
r_top.style.top = availHeight;

$('.close').click(function(){
    var _this = $(this);
    var data = _this.attr('data');
    $('#sidebar').animate({
        width:'toggle',
    },'slow');
    if(data == 0){
        _this.attr('data','1').css('background','#333333 url("/fancybox/show.png") no-repeat');
        $('.hidden_show').animate({
            width:'100%',
        },'slow')
    }else{
        _this.attr('data','0').css('background','#333333 url("/fancybox/close.png") no-repeat');;
        $('.hidden_show').animate({
            width:'900px',
        },'slow')
    }
});