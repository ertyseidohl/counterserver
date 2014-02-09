var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	url = require("url"),
	path = require("path"),
	fs = require('fs');

types = {
	AIR: 1,
	EARTH: 2,
	FIRE: 4,
	WATER: 8,
	AETHER: 15
};

gameStates = {
	WAITING: 0,
	RUNNING: 1,
	STOPPED: 2
};

var player = require('./server.player.js'),
	card = require('./server.card.js'),
	game = require('./server.game.js'),
	counterspells = require('./counterspells.js'),
	spells = require('./spells.js');

var players = [];

var games = [];

app.listen(80);

function handler (req, res) {
	var uri = url.parse(req.url).pathname;
	var filename = path.join(process.cwd(), uri);

	fs.exists(filename, function(exists) {
		if(!exists) {
			res.writeHead(404, {"Content-Type": "text/plain"});
			res.write("404 Not Found\n");
			res.end();
			return;
		}

		if (fs.statSync(filename).isDirectory()) filename += '/index.html';

		fs.readFile(filename, "binary", function(err, file) {
			if(err) {
				res.writeHead(500, {"Content-Type": "text/plain"});
				res.write(err + "\n");
				res.end();
				return;
			}

			res.writeHead(200);
			res.write(file, "binary");
			res.end();
		});
	});
}

io.sockets.on('connection', function (socket) {
	var p = new player.Player({
		id: players.length
	});
	players.push(p);
	updateAll();
	socket.emit('connection', {
		playerid: p.id
	});
	socket.on('startgame', function (data) {
		for(var i = 0; i < games.length; i ++){
			if(games[i].containsPlayer(p)){
				return;
			}
		}
		games.push(new game.Game({
			state: gameStates.WAITING,
			player: p
		}));
		updateAll();
	});
	socket.on('disconnect', function(data) {
		players = players.splice(p.id, 1);
		for(var i = 0; i < games.length; i ++){
			if(games[i].containsPlayer(p)){
				games[i].changeState(gameStates.STOPPED);
			}
		}
		updateAll();
	});
});

function updateAll(){
	io.sockets.emit('update', {
		players: players,
		games: games
	});
}