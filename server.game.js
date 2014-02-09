module.exports.Game = function(options) {
	this.state = options.state;
	this.players = [options.player];

	this.changeState = function(state){
		this.state = state;
	};

	this.containsPlayer = function(p){
		return this.players.indexOf(p) !== -1;
	};

};