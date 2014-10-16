/**
 * Input Listener
 *
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */
function InputListener(game){

	this.map = {
		13: "hit", // Enter
		17: "hit", // Left Ctrl
		27: "back", // Scape
		32: "hit", // Space bar
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
	this.keyListen();
}

/** Listens to keyboard and triggers action */
InputListener.prototype.keyListen = function(){
	
	var parent = this;

	window.onkeyup = function(e) {
	   var key = e.keyCode ? e.keyCode : e.which;
	   parent.act(key);
	}
};

/** Dispatchs upon key */
InputListener.prototype.act = function(key){

   	var action = this.map[key];

	switch(action){
		case "up":
			alert('up');
			break;

		case "down":
			alert('down');
			break;

		case "left":
			alert('left');
			break;

		case "right":
			alert('right');
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
