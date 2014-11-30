$(function(){
	init();
	position_init();
	
	$("div#box").css({
	  backgroundPosition: "left bottom",
		backgroundImage: "-webkit-image-set(url('images/axis1.png') 2x)"
	});
	
	var dur   = 200;
	var scale =  10;
	$("div[id^='user']").draggable({
		containment: "parent",
		start: function(){
			$(this).animate({
				//width : "+="+ scale + "px",
				//height: "+="+ scale + "px",
				//top   : "-="+ scale * 0.5 +"px",
				//left  : "-="+ scale * 0.5 +"px"
			}, {
				duration: dur, easing: "easeOutCubic",
				complete: function(){
					var swap_id;
					$("div[id^='user']").each(function(){
						if($(this).css("z-index") == user_size)
							swap_id = $(this).data("id");
					});
					
					$("div#user"+ swap_id).css({zIndex: $(this).css("z-index")});
					$(this).css({zIndex: user_size});
				}
			});
		},
		
		drag: function(){
			var x = $(this).position().left / (device.width - $(this).width());
			var y = $(this).position().top  / (device.width - $(this).width());
			//                                                ^^^^^^^^^^^^^^^ <- This is OK. Not a wrong.
			$("span#axis_display").html("ID: "+ $(this).data("id") +" ("+ x.toFixed(2) +", "+ (1 - y).toFixed(2) +")");
		},
		
		stop: function(){
		  $("span#axis_display").html("");
			$(this).html($(this).data("id"));
			$(this).animate({
				//width : "-="+ scale + "px",
				//height: "-="+ scale + "px",
				//top   : "+="+ scale * 0.5 +"px",
				//left  : "+="+ scale * 0.5 +"px"
			}, {
				duration: dur, easing: "easeOutCubic"
			});
			rank_check();
		}
	});
	
	$("div#submit").on("click", function(){
	  $(this).off("click");
		rank_check();
		socket.emit('rank_gather', {rank: users_rank});
		$("div[id^='user']").each(function(){
			$(this).delay(100 * $(this).data("id")).animate({
				opacity: 0
			});
		});
		setTimeout(function(){
			$("div#submit").fadeOut();
			$("div#rolling").fadeOut();
			$("div#box").animate({
				backgroundColor: 'rgba(125, 151, 179, 0.0)',
				boxShadow: '0px 0px 0px 3px rgba(41, 70, 102, 0.0) inset'
			});
			$("div#box").css({
			   backgroundPosition: "center center",
				backgroundImage: 'url("/images/loading.gif")'
			});
		}, 100 * (user_size + 5));
	})
	
	$("div#rolling").on("click", function(){
		$("div[id^='user']").each(function(){
			console.log($(this).css("z-index"));
			if($(this).css("z-index") == user_size)
			{
				$(this).css({zIndex: 1});
			}
			else
			{
				$(this).css({zIndex: "+="+ 1});
			}
		});
	});
	
	socket.on('push_finish', function(data){
	  setTimeout(function(){
  	  $("div#box").animate({
  			backgroundColor: 'rgba(125, 151, 179, 0.8)',
  			boxShadow: '0px 0px 0px 3px rgba(41, 70, 102, 0.7) inset'
  		});
  		console.log(data);
  		$("div#box").css({
  		  textAlign: "left",
  		  backgroundPosition: "left bottom",
  		  backgroundImage: "-webkit-image-set(url('images/axis"+ data.axis +".png') 2x)"
  		});
  		
  		var data_bank = {x: [], y: []};
  		var data_text = {x: "<div class='data_text x'>[axis]<br/>", y: "<div class='data_text y'>[axis y]<br/>"};
  	  $("div[id^='result_user']").each(function(){
  	    $(this).show();
  	    
  			if(data.rank[$(this).data('id')] != null)
  			{
  				var x_value = data.rank[$(this).data('id')].x / data.uc[$(this).data('id')];
  				var y_value = data.rank[$(this).data('id')].y / data.uc[$(this).data('id')];
  				var x = x_value * (device.width - $(this).width());
  				var y = y_value * (device.width - $(this).width());
  				
    	    //data_bank.x.push(x_value);
    	    data_bank.y.push(y_value);
    	    data_bank.x.push(x_value + (1 - y_value));
    	    
    	    //data_text.x += $(this).data('id') + " : " + x_value.toFixed(3) + "<br/>";
    	    data_text.y += $(this).data('id') + " : " + y_value.toFixed(3) + "<br/>";
    	    data_text.x += $(this).data('id') + " : " + (x_value + (1 - y_value)).toFixed(3) + "<br/>";
    	    
  				$(this).animate({
  					left: x,
  					top : y
  				}, {
  					duration: 300, easing: "easeOutCubic"
  				});
  			}
  		});
  		
  		$("div#box").append(data_text.x + "</div>");
  		//$("div#box").append(data_text.y + "</div>");
  	}, 2000);
	});
	
	socket.on('axis_change', function(data){
  	$("div#box").css({
  	  backgroundPosition: "left bottom",
  		backgroundImage: "-webkit-image-set(url('images/axis"+ data.axis +".png') 2x)"
  	});
	});
})

function rank_check(){
	$("div[id^='user']").each(function(){
		var x = $(this).position().left / (device.width - $(this).width());
		var y = $(this).position().top  / (device.width - $(this).width());
		users_rank[$(this).data('id')] = {x: x, y: y};
	});
	console.log(users_rank);
}