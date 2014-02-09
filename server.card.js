var ERROR = "ERROR:MISSING";

module.exports.Card = function(options){
	var defaults = {
		name: ERROR,
		text: ERROR,
		onPlay: function(){},
		type: 0
	};

	for(var e in defaults){
		this.e = options.e || defaults.e;
	}

};