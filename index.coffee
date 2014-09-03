# *** require -> ***
express = require('express')
path = require('path')
favicon = require('serve-favicon')
logger = require('morgan')
cookieParser = require('cookie-parser')
bodyParser = require('body-parser')
http = require('http')
engine = require('ect');
# *** <- require ***

# *** Server setup *** ->
app = express()
server = http.createServer app
server.listen(3000, '127.0.0.1')
console.log 'Server Start. (:3000)'
io = require('socket.io').listen(server)

#app.use(favicon(__dirname + '/public/favicon.ico'))
app.use logger('dev')
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

# *** Routing -> ***
routes_index = require('./routes/index')
app.get '/', routes_index.root
# *** <- Routing ***

io.on 'connection', (socket) ->
	socket.on 'emit', (data) ->
		console.log 'in comming.'
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