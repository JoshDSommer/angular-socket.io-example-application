var bodyParser = require('body-parser')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var people = [];

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

http.listen(3568, function () {
	console.log('listening on *:3568');
});

// handle incoming connections from clients
io.sockets.on('connection', function(socket) {
	socket.on('joinRoom', function (roomName, username) {
		people[socket.id] = username;
		userEnterRoom(roomName);
		console.log(username,' joined the room');
	});

	socket.on('roomMessage', function (message, room) {
		console.log(room,message)
		socket.to(room).emit('roomMessage', message);
	});

	function userEnterRoom(roomName) {
		var room = io.sockets.adapter.rooms[roomName];
		if (room && room.length > 0) {
			socket.to(roomName).emit('roomMessage', people[socket.id] + ' joined ' + roomName);

		}
		socket.join(roomName);
	}
});
