var user_size = 10;

exports.root = function(req, res){
	res.render('index', {user_size: user_size, my_seat: req.session.seat});
}

exports.monitor = function(req, res){
	res.render('monitor', {user_size: user_size, online_seats: req.session.online_seats});
}

exports.seat_set = function(req, res){
	res.render('seat_set', {user_size: user_size, uuid: req.session.uuid});
}