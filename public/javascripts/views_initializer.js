var users_rank = Array();
var device = {width: -1, height: -1};

function init(){
	device.width  = $(window).width();
	device.height = $(window).height();
}

function position_init(){
	$("div#box").width(device.width).height(device.width).css({top: (device.height - device.width) * 0.5});
	$("div[id^='user']").each(function(){
		$(this).css({
			top   : ($("div#box").height() - $(this).height()) * 0.5 - 6,
			left  : ($("div#box").width() - $(this).width()) * 0.5,
			zIndex: user_size - $(this).data("id") + 1
		});
	});
}