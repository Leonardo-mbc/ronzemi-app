mongoose = require('mongoose');
Schema = mongoose.Schema

exports.users = new Schema({
	uuid: String,
	seat: Number
});