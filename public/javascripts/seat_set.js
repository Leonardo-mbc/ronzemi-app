$(function(){
	init();
	position_init();
	seat_init();
	
	$("span#seat_set").on("click", function(){
		socket.emit('seat_set', {seat: $("span#seat_set").data("select"), uuid: $("span#uuid").text().replace(/(\(|\))/g, "")});
		$(this).off("click").fadeOut();
		$("span#seat_cancel").off("click").fadeOut();
		
	});
	
	$("span#seat_cancel").on("click", function(){
		seat_init();
		$("span[id^='seat']").fadeOut();
		$("div[id^='user']").fadeIn();
	});
	
	socket.on('goto_table', function(data){
		location.href = "/";
	});
})

function seat_init(){
	var dist = 100;
	var ofs = Math.PI / 2;
	$("div[id^='user']").each(function(){
		$(this).css({
			top   : ($("div#box").height() - $(this).height()) * 0.5 - 6 + dist * Math.sin((Math.PI/user_size*2) * ($(this).data("id") - 1) - ofs),
			left  : ($("div#box").width() - $(this).width()) * 0.5 + dist * Math.cos((Math.PI/user_size*2) *  ($(this).data("id") - 1) - ofs),
			zIndex: user_size - $(this).data("id") + 1
		});
		$(this).on("click", function(){
			$("span#seat_set").data("select", $(this).data("id"));
			$(this).animate({
				top   : ($("div#box").height() - $(this).height()) * 0.5 - 6,
				left  : ($("div#box").width() - $(this).width()) * 0.5
			}, {
				duration: 400, easing: "easeOutCubic",
				complete: function(){
					$("div[id^='user']").off("click");
				}
			});
			
			$("div[id^='user']").not(":animated").fadeOut();
			$("span[id^='seat']").fadeIn();
		})
	});
}