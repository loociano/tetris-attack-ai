/**
 * Block Class
 *
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */

/** Block Types */
var types = ["blue", "yellow", "red", "purple", "green", "silver", "blue"];

/** Block States */
var states = ["none", "left", "right", "floating", "fall", "combo", "explode"];

/** Constructor */
function Block(type){

	(type == undefined || !this.isValidType(type)) ?
		this.type = this.getRandomType() : this.type = type;
	this.state = "none";
}

/** Get State */
Block.prototype.getState = function(){
	return this.state;
};

/** Set state */
Block.prototype.setState = function(state){
	if (this.isValidState(state))
		this.state = state;
};

/** Set state as combo */
Block.prototype.combo = function(){
	this.state = "combo";
};

/** Returns true if state is combo */
Block.prototype.isCombo = function(){
	return this.state == "combo";
};

/** Set state as none */
Block.prototype.setNone = function(){
	this.state = "none";
};

/** Set state as none */
Block.prototype.isNone = function(){
	return this.state == "none";
};

/** Set state as fall */
Block.prototype.fall = function(){
	return this.state = "fall";
};

/** Set state as none */
Block.prototype.isFalling = function(){
	return this.state == "fall";
};

/** Set state as fall */
Block.prototype.hover = function(){
	return this.state = "hover";
};

/** Set state as none */
Block.prototype.isHovering = function(){
	return this.state == "hover";
};

/** Set state as explode */
Block.prototype.explode = function(){
	this.state = "explode";
};

/** Returns true if block is exploding */
Block.prototype.isExploding = function(){
	return this.state == "explode";
};

/** Moving left */
Block.prototype.left = function(){
	this.state = "left";
};

/** Moving right */
Block.prototype.right = function(){
	this.state = "right";
};

/** Returns true if block is moving left */
Block.prototype.isMovingLeft = function(){
	return this.state == "left";
};

/** Returns true if block is moving right */
Block.prototype.isMovingRight = function(){
	return this.state == "right";
};

/** Returns true if the type is valid */
Block.prototype.isValidType = function(type){
	for (var i = 0; i < types.length; i++){
		if (type == types[i]) return true;
	}
	return false;
};

/** Returns true if the state is valid */
Block.prototype.isValidState = function(state){
	for (var i = 0; i < states.length; i++){
		if (state == states[i]) return true;
	}
	return false;
};

/** Returns a random, valid type */
Block.prototype.getRandomType = function(){
	return types[Math.round(Math.random() * (types.length - 1))];
};

/** Returns a random, valid type different from a given type */
Block.prototype.setDistinctRandomType = function(forbiddenTypes){

	var otherTypes = types.slice(0); // Copy types
	for(var i = 0; i < forbiddenTypes.length; i++){
		var index = types.indexOf(forbiddenTypes[i]);
		if (index != -1){
			otherTypes.splice(index, 1); // Remove given type
		}
	}
	this.type = otherTypes[Math.round(Math.random() * (otherTypes.length - 1))];
};

/** Returns type */
Block.prototype.getType = function(){
	return this.type;
};

/** Compare type */
Block.prototype.compareType = function(otherBlock){
	if (otherBlock == null) return false;
	return this.type == otherBlock.getType();
};