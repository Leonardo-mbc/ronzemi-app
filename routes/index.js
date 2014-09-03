exports.root = function(req, res){
	res.render('index', {title: 'Index'});
}

exports.express = function(req, res){
	res.render('express', {title: 'Express'});
}