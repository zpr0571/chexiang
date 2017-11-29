function show() {
	document.getElementById('health').style.display='block';
}
function hid() {
	document.getElementById('health').style.display='none';
}
var box = $("#box");
		var list = $("#list");
		var prev = $("#prev");
		var next = $("#next");
		var btns = $("#btn span");
		var index = 1;
		var len = $('#list').children().length;
		var lastLeft=$("#box").width()*(len);//最后一张left距离的绝对值
		var moveW=$("#box").width();//一次移动距离
		$("#list img").width($("#box").width());
		$("#list").width($("#box").width()*(len));
		var listw=$(".sub_nav_lt").outerHeight();
		 $("#box ").height(listw)
		 $("#box img").height(listw)
		 $("#box .arrow").css('line-height',listw+'px')
		var interval = 3000 //播放间隔
		prev.click(function() {
			if (list.is(':animated')) {
				return;
			}
			if(index == 3) {
				index = 1;
			} else {
				index++;
			}
			animate(-moveW);
			btnColor();
		})
		next.click(function() {
			if (list.is(':animated')) {
				return;
			}
			if(index == 1) {
				index = 3;
			} else {
				index--;
			}
			animate(moveW);
			btnColor();
		})

		function animate(offset) {

			var left = parseInt(list.css('left')) + offset;
			if(offset > 0) {
				offset = '+=' + offset;
			} else {
				offset = '-=' + Math.abs(offset);
			}
			list.animate({
					'left': offset
				}, 500,
				function() {
					if(left < -lastLeft) {
						left = 0;
					}
					if(left > 0) {
						left = -lastLeft;
					}
					list.css('left', left + 'px');
				})

		}

		function btnColor() {
			btns.eq(index - 1).addClass('on').siblings().removeClass('on');
		}
		btns.each(function() {
			$(this).click(function() {
				if($(this).attr('class') == 'on' || list.is(':animated')) {
					return;
				}
				var myIndex = parseInt($(this).attr('index'));
				var offset = -moveW * (myIndex - index);
				animate(offset);
				index = myIndex;
				btnColor();
			})
		})

		function play() {
			timer = setInterval(function() {
				prev.click();
			}, interval)
		}

		function stop() {
			clearInterval(timer);
		}
		box.hover(stop, play);
		play();