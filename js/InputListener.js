/**
 * Input Listener
 *
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */
function InputListener(game, cursor, renderer){

	this.map = {
		13: "hit", // Enter
		17: "hit", // Left Ctrl
		27: "back", // Scape
		32: "swap", // Space bar
		37: "left",
		38: "up",
		39: "right",
		40: "down",
		52: "left",
		65: "left",
		68: "right",
		83: "down",
		87: "up",
		97: "left",
		100: "right",
		115: "down",
		119: "up"
	};

	this.game = game;
	this.renderer = renderer;
	this.cursor = cursor;
	this.keyListen();
}

/** Listens to keyboard and triggers action */
InputListener.prototype.keyListen = function(){
	
	var parent = this;

	window.onkeydown = function(e) {
	   var key = e.keyCode ? e.keyCode : e.which;
	   parent.act(key);
	}
};

/** Dispatches upon key */
InputListener.prototype.act = function(key){

   	var action = this.map[key];

	switch(action){
		case "up":
			this.up();
			break;

		case "down":
			this.down();
			break;

		case "left":
			this.left();
			break;

		case "right":
			this.right();
			break;

		case "swap":
			this.swap();
			break;

		case "hit":
			this.hit();
			break;

		case "back":
			alert("back");
			break;
	}
};

/** Action on hit */
InputListener.prototype.hit = function(){
	this.game.restart();
};

/** Action on left */
InputListener.prototype.left = function(){
	this.cursor.left();
	this.renderer.updateCursor();
};

/** Action on right */
InputListener.prototype.right = function(){
	this.cursor.right();
	this.renderer.updateCursor();
};

/** Action on up */
InputListener.prototype.up = function(){
	this.cursor.up();
	this.renderer.updateCursor();
};

/** Action on down */
InputListener.prototype.down = function(){
	this.cursor.down();
	this.renderer.updateCursor();
};

/** Action on swap */
InputListener.prototype.swap = function(){
	this.cursor.swap();
};
