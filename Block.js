/** Types */
var types = ["blue", "yellow", "red", "purple", "green", "grey"];

/** Constructor */
function Block(type){

	(type == undefined || !this.isValidType(type)) ? 
		this.type = this.getRandomType() : this.type = type;
}

/** Returns true if the type is valid */
Block.prototype.isValidType = function(type){
	for (var i = 0; i < types.length; i++){
		if (type == types[i]) return true;
	}
	return false;
};

/** Returns a random, valid type */
Block.prototype.getRandomType = function(){
	return types[Math.round(Math.random() * (types.length - 1))];
}