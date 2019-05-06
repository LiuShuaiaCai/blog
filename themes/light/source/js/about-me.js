//判断浏览器的类型
var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器 
if(!isChrome){
	alert('目前只支持谷歌浏览器');
	window.location.href='http://blog.feifan.news/';
}
//此处引用：鼠标滚轮mousewheel插件

!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});
$(function(){

	var i=0;

	var $btn = $('.section-btn li'),

		$wrap = $('.section-wrap'),

		$arrow = $('.arrow');

	/*当前页面赋值*/

	function up(){i++;if(i==$btn.length){i=0};}

	function down(){i--;if(i<0){i=$btn.length-1};}

	

	/*页面滑动*/

	function run(){

		$btn.eq(i).addClass('on').siblings().removeClass('on');	

		$wrap.attr("class","section-wrap").addClass(function() { return "put-section-"+i; }).find('.section').eq(i).find('.title').addClass('active');
		setTimeout(function(){
			content();
		},666)
	};

	

	/*右侧按钮点击*/

	$btn.each(function(index) {

		$(this).click(function(){

			i=index;

			run();

		})

	});

	

	/*翻页按钮点击*/

	$arrow.one('click',go);

	function go(){

		up();run();	

		setTimeout(function(){$arrow.one('click',go)},1000)

	};

	

	/*响应鼠标*/

	$wrap.one('mousewheel',mouse_);

	function mouse_(event){

		if(event.deltaY<0) {up()}

		else{down()}

		

		setTimeout(function(){$wrap.one('mousewheel',mouse_)},1000)

		run();

	};

	

	/*响应键盘上下键*/

	$(document).one('keydown',k);

	function k(event){

		var e=event||window.event;

		var key=e.keyCode||e.which||e.charCode;

		switch(key)	{

			case 38: down();run();	

			break;

			case 40: up();run();	

			break;

		};

		setTimeout(function(){$(document).one('keydown',k)},1000);

	}

	//JS描边
	var svganimations = function(obj) {
		'use strict';
		window.requestAnimFrame = function(){
			return (
				window.requestAnimationFrame       || 
				window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame    || 
				window.oRequestAnimationFrame      || 
				window.msRequestAnimationFrame     || 
				function(/* function */ callback){
					window.setTimeout(callback, 1000 / 60);
				}
			);
		}();

		window.cancelAnimFrame = function(){
			return (
				window.cancelAnimationFrame       || 
				window.webkitCancelAnimationFrame || 
				window.mozCancelAnimationFrame    || 
				window.oCancelAnimationFrame      || 
				window.msCancelAnimationFrame     || 
				function(id){
					window.clearTimeout(id);
				}
			);
		}();
		
		var svgs = Array.prototype.slice.call( document.querySelectorAll( 'svg' ) ),
			hidden = Array.prototype.slice.call( document.querySelectorAll( '.hide' ) ),
			current_frame = 0,
			total_frames = 60,
			path = new Array(),
			length = new Array(),
			handle = 0;

		function init() {
			[].slice.call( document.querySelectorAll( 'path,circle,rect' ) ).forEach( function( el, i ) {
				path[i] = el;
				var l = path[i].getTotalLength();
				length[i] = l;
				path[i].style.strokeDasharray = l + ' ' + l; 
				path[i].style.strokeDashoffset = l;
			} );
			setTimeout(textPath(),2000)
		}

		function draw() {
			var progress = current_frame/total_frames;
			if (progress > 1) {
				window.cancelAnimFrame(handle);
			} else {
				current_frame++;
				for(var j=0; j<path.length;j++){
					path[j].style.strokeDashoffset = Math.floor(length[j] * (1 - progress));
				}
				handle = window.requestAnimFrame(draw);

			}
		}

		function textPath(){
			document.querySelectorAll( 'textPath' ).forEach(function(el, i){
				$(el).animate({
					opacity: 1,
				},2000)
			})

			$('.linkme').animate({
				opacity: 1,
			},2000)

			
			$('.normal').each(function(){
				var width = parseInt(($(this).width()-$(this).find('div:eq(0)').width())/2);
				$(this).find('div:eq(0)').css('left',width);
				$(this).find('div:eq(0)').animate({
					opacity: 1,
				},2000)
			})
		}

		init();
		draw();
	};

	//随机颜色
    function generateMixed(n) {
		var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
      	var res = "#";
      	var id;
      	for(var i = 0; i < n ; i ++) {
        	id= Math.floor(Math.random()*16);
        	res += chars[id];
      	}
      	return res;
    }
	$('.hide').mouseover(function(){
		$('path').css('stroke','#fff');
		$('.hide').css('color','#fff');
		$(this).css('color',generateMixed(6));
		$(this).siblings('.line-drawing').find('path').css('stroke',generateMixed(6));
	})

	//技术翻转
	var skill = function(){
		var nodes  = document.querySelectorAll('.container li'),
    	_nodes = [].slice.call(nodes, 0);

		var getDirection = function (ev, obj) {
		    var w = obj.offsetWidth,
		        h = obj.offsetHeight,
		        x = (ev.pageX - obj.offsetLeft - (w / 2) * (w > h ? (h / w) : 1)),
		        y = (ev.pageY - obj.offsetTop - (h / 2) * (h > w ? (w / h) : 1)),
		        d = Math.round( Math.atan2(y, x) / 1.57079633 + 5 ) % 4;
		  
		    return d;
		};

		var myaddClass = function ( ev, obj, state ) {
		    var direction = getDirection( ev, obj ),
		        class_suffix = "";
		    
		    obj.className = "";
		    
		    switch ( direction ) {
		        case 0 : class_suffix = '-top';    break;
		        case 1 : class_suffix = '-right';  break;
		        case 2 : class_suffix = '-bottom'; break;
		        case 3 : class_suffix = '-left';   break;
		    }
		    
		    obj.classList.add( state + class_suffix );
		};

		// bind events
		_nodes.forEach(function (el) {
		    el.addEventListener('mouseover', function (ev) {
		        myaddClass( ev, this, 'in' );
		    }, false);

		    el.addEventListener('mouseout', function (ev) {
		        myaddClass( ev, this, 'out' );
		    }, false);
		});
	}


	/*----------------------------------------------------------------------*/
	function nav(){
		$('#me-header>ul').animate({
			right: '120px',
			opacity: '1'
		},800)
		$('#me-header>ul').animate({
			right: '80px',
			opacity: '0.6'
		},400)
		$('#me-header>ul').animate({
			right: '100px',
			opacity: '1'
		},400)
	}
	nav();

	function content(){
		var index = $('.section-btn li[class=on]').index();
		var obj = $('.section-wrap>div').eq(index);
		switch(index){
			case 0: content0(obj);
			break;
			case 1: content1(obj);
			break;
			case 2: content2(obj);
			break;
			case 3: content3(obj);
			break;
			case 4: content4(obj);
			break;
		}

		$('.hide').animate({
			opacity: '0',
		},500);
		obj.find('.hide').animate({
			opacity: '1',
		},1000);
	}
	content()
	// Part1
	function content0(){
		svganimations()
	}
	// Part2
	function content1(obj){
		svganimations()
	}
	// Part3
	function content2(){
		svganimations()
		skill();

	}
	// Part4
	function content3(obj){
		svganimations()

		obj.fireworks({ 
		  sound: false, // sound effect
		  opacity: 1, 
		  width: '100%', 
		  height: '100%' 
		});
	}
	// Part5
	function content4(obj){
		
	}
});


