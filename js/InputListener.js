/**
 * Input Listener
 *
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */
function InputListener(app, game, cursor, renderer){

	this.app = app;
	this.game = game;
	this.renderer = renderer;
	this.cursor = cursor;

	this.pixelRiseRate = 30;

	this.map = {
		13: "start", // Enter
		17: "swap", // Left Ctrl
		27: "back", // Scape
		32: "rise", // Space bar
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

		case "start":
			this.restart();
			break;

		case "rise":
			this.rise();
			break;

		case "back":
			break;
	}
};

/** Action on hit */
InputListener.prototype.restart = function(){
	this.app.restart();
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
	if (!this.game.isSwap() && !this.game.isHover()){
		this.game.swap();
		if (!this.cursor.swap()){
			this.game.ready();
		}
	} else {
		console.info(this.game.getPlayer() + ' cannot swap: ' + this.game.getState());
	}
};

/** Action on rise all blocks */
InputListener.prototype.rise = function(){
	if (!this.game.isGameOver())
		this.renderer.rise(this.pixelRiseRate);
};