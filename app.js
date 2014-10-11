/**
 * Init all modules and servers
 */
var express = require('express'),
    http = require('http'),
	path = require('path'),
	SocketIO = require('socket.io');

/**
 * Init Web Application
 */
var env = process.env.NODE_ENV || 'development';
var serverPort = process.env.PORT || 8080;
var app = express();


app.set('port', serverPort);
app.use(express.static(path.join(__dirname, 'app')));

var server = http.createServer(app);
server.listen(app.get('port'), function(){
	console.log((new Date()) + " Server is listening on port " + serverPort);
});

var io = SocketIO.listen(server);

io.sockets.on('connection', function(socket){
	
	socket.on('ping', function(data) {
        console.log("Ping received, send pong response");
		socket.emit('pong', data);
	});
});
 
