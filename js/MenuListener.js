/**
 * Menu Listener
 *
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */
function MenuListener(app){

	this.app = app;

	this.map = {
		13: "start", // Enter
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

	this.keyListen();
	this.menuElts = document.getElementById("menu").children;
}

MenuListener.prototype = {

	keyListen: function(){
		
		var parent = this;

		window.onkeydown = function(e) {
		   var key = e.keyCode ? e.keyCode : e.which;
		   parent.act(key);
		}
	},

	act: function(key){

   		var action = this.map[key];

		switch(action){
			case "up":
				this.up();
				break;

			case "down":
				this.down();
				break;

			case "start":
				this.start();
				break;

			case "back":
				this.back();
				break;
		}
	},

	up: function(){
		var index = this.getActiveEltIndex();
		if (index > 0){
			this.setActiveElt(index, index-1);
		}
	},

	down: function(){
		var index = this.getActiveEltIndex();
		if (index < this.menuElts.length - 1){
			this.setActiveElt(index, index+1);
		}
	},

	start: function(){
		var index = this.getActiveEltIndex();
		switch(index){
			case 0:
				this.app.start("1p");
				break;
			case 1:
				this.app.start("2p");
				break;
			case 2:
				this.app.start("vscom");
				break;
			case 3:
				break;
			case 4:
				break;
		}
	},

	back: function(){
	},

	/** Returns the index of the active menu element */
	getActiveEltIndex: function(){
		for(var i = 0; i < this.menuElts.length; i++){
			if (this.menuElts[i].className == "active")
				return i;
		}
	},

	/** Switches active menu item given two indexes */
	setActiveElt: function(oldIndex, newIndex){
		this.menuElts[oldIndex].className = "";
		this.menuElts[newIndex].className = "active";
	}
};