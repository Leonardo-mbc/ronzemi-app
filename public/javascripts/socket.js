$(function(){
	$("input#emit").on('click', function(){
		socket.emit('emit', {user: 'Leonardo'});
	});
})