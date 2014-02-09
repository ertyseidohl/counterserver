var socket = io.connect('http://localhost');

var playerid = 0;
var state = STATE.LOBBY;

socket.on('connection', function (data) {
	this.playerid = data.playerid;
});

socket.on('update', function (data){
	var games = document.getElementById("games");
	while (games.hasChildNodes()) {
		games.removeChild(games.lastChild);
	}
	for(var i = 0; i < data.games.length; i++){
		var g = document.createElement("input");
		g.value = "Game " + i;
		g.type = "button";
		bindEvent(g, "click", function(){
			socket.emit('joingame', {
				gameid: i
			});
		});
		games.appendChild(g);
	}
});

function bindEvent(element, type, handler) {
	if(element.addEventListener) {
		element.addEventListener(type, handler, false);
	} else {
		element.attachEvent('on'+type, handler);
	}
}

bindEvent(window, "load", function(){

	bindEvent(document.getElementById("clearGame"), "click", function(){
		socket.emit('clearGame', {
			playerid: playerid
		});
	});

});