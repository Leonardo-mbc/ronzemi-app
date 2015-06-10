# *** require -> ***
express = require('express')
path = require('path')
favicon = require('serve-favicon')
logger = require('morgan')
cookieParser = require('cookie-parser')
bodyParser = require('body-parser')
http = require('http')
engine = require('ect')
mongoose = require('mongoose')
session = require('express-session')
uuid = require('node-uuid')
# *** <- require ***

# *** Global scope -> ***
seat_values = []
push_user = []
axis = 1
# *** <- Global scope ***

# *** Server setup *** ->
app = express()
server = http.createServer app
server.listen(3000, '0.0.0.0')
console.log 'Server Start. (:3000)'
io = require('socket.io').listen(server)

# *** Database setup *** ->
Schema = mongoose.Schema
mongoose.connect 'mongodb://localhost/db'

UserSchema = require("./models/Users").users
mongoose.model('Users', UserSchema)
Users = mongoose.model 'Users'

Users.remove {}, (err, data) ->
	Users.find {}, (err, data) ->
		console.log data

#app.use(favicon(__dirname + '/public/favicon.ico'))
app.use logger('dev')
app.use session({secret: '61b861983bbcffe7199f21823393910e', resave: true, saveUninitialized: true})
app.use bodyParser.json()
app.use bodyParser.urlencoded({extended: false})
app.use cookieParser()
app.use express.static(path.join(__dirname, 'public'))
# *** <- Server setup ***

# *** view engine setup -> ***
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ect')
app.engine('ect', engine({watch: true, root: __dirname + '/views', ext: '.ect' }).render)
# *** <- view engine setup ***

seat_check = (req, res, next) ->
	if req.session.uuid?
		Users.findOne {uuid: req.session.uuid, seat: {$ne: null}}, (err, data) ->
			req.session.seat = data.seat
			next();
	else
		req.session.uuid = uuid.v4()
		
		new_user = new Users()
		new_user.uuid = req.session.user_id
		new_user.seat = 0
		new_user.save (err) ->
			Users.find {}, (err, data) ->
				#console.log data
		
		res.redirect('/seat_set');

online_check = (req, res, next) ->
	Users.find {}, (err, data) ->
		req.session.online_seats = []
		for m in data
			req.session.online_seats.push m.seat
		next();

# *** Routing -> ***
routes_index = require('./routes/index')
app.get '/', seat_check, routes_index.root
app.get '/monitor', online_check, routes_index.monitor
app.get '/seat_set', routes_index.seat_set
# *** <- Routing ***

io.on 'connection', (socket) ->
	socket.on 'rank_gather', (data) ->
		for i in [1..(data.rank.length - 1)]
			unless data.rank[i] is null
				unless seat_values[i]?
					seat_values[i] = {x: 0.0, y: 0.0}
				unless push_user[i]?
					push_user[i] = 0
				seat_values[i].x = parseFloat(seat_values[i].x) + parseFloat(data.rank[i].x)
				seat_values[i].y = parseFloat(seat_values[i].y) + parseFloat(data.rank[i].y)
				push_user[i] += 1
		console.log seat_values
		console.log push_user
		
		socket.broadcast.emit 'mod_axis', {
			rank: seat_values,
			uc : push_user
		}
		return
	
	socket.on 'seat_set', (data) ->
		new_user = new Users()
		new_user.uuid = data.uuid
		new_user.seat = data.seat
		seat = data.seat
		
		new_user.save (err) ->
			Users.find {}, (err, data) ->
				#console.log data
				socket.emit 'goto_table', {}
				socket.broadcast.emit 'online_push', {
					seat: seat
				}
		return
		
	socket.on 'push_finish', (data) ->
	  socket.broadcast.emit 'push_finish', {
  	  rank: seat_values,
			uc: push_user,
			axis: axis
	  }
	  return
	
	socket.on 'axis_change', (data) ->
	  axis = data.axis
	  socket.broadcast.emit 'axis_change', {
  	  axis: data.axis
	  }
	  return
		
	return
	
# catch 404 and forward to error handler
#app.use (req, res, next) ->
#	err = new Error('Not Found')
#	err.status = 404
#	next(err)
# error handlers

# development error handler
# will print stacktrace
#if app.get('env') is 'development'
#	app.use (err, req, res, next) ->
#		res.status(err.status || 500)
#		res.render('error', {
#			message: err.message,
#			error: {}
#		})

# production error handler
# no stacktraces leaked to user
#app.use (err, req, res, next) ->
#	res.status(err.status || 500)
#	res.render('error', {
#		message: err.message,
#		error: {}
#	})