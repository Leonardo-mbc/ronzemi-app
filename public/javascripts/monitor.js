$(function(){
	init();
	position_init();
	status_user_init()
	$("div[id^='user']").show();
	
	$("div#box").css({
	  backgroundPosition: "left bottom",
		backgroundImage: "-webkit-image-set(url('images/axis1.png') 2x)"
	});
	
	$("a[id^='change_axis']").on("click", function(){
  	$("div#box").css({
  	  backgroundPosition: "left bottom",
  		backgroundImage: "-webkit-image-set(url('images/axis"+ $(this).data("id") +".png') 2x)"
  	});
  	socket.emit('axis_change', {axis: $(this).data("id")});
	});
	
	socket.on('mod_axis', function(data){
		$("div[id^='user']").each(function(){
			if(data.rank[$(this).data('id')] != null)
			{
				var x = data.rank[$(this).data('id')].x / data.uc[$(this).data('id')] * (device.width - $(this).width());
				var y = data.rank[$(this).data('id')].y / data.uc[$(this).data('id')] * (device.width - $(this).width());
				
				$(this).animate({
					left: x,
					top : y
				}, {
					duration: 300, easing: "easeOutCubic"
				});
			}
		});
		
		push_count = data.uc.reduce(function(x, y) { return x + y; });
		if(push_count >= (user_size - 1) * user_size)
		{
  		socket.emit('push_finish', {});
		}
	});
	
	socket.on('online_push', function(data){
		console.log("seat"+ data.seat +" is online");
		$("div#status_user"+ data.seat).switchClass("user status", "user_online", 600, "easeOutCubic")
	});
});

function status_user_init(){
	$("div[id^='status_user']").each(function(){
		$(this).css({
			left: ($(this).data("id") - 1) * $(this).width() + 10 +"px",
			top : $("div#box").height() + 10 +"px"
		});
	});
}