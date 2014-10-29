function App(){

	// Game for player 1
	this.game1;

	// Game for player 2
	this.game2;

 	this.id = null;
 	
 	// Update rate in milliseconds
 	this.tickMills = 50;
}

App.prototype = {
	
	/** Starts the app: initialises the two games */
	start: function(){

		this.gameRenderer = new GameRenderer();

		this.game1 = new Game(this, "p1", 0);
		this.game2 = new Game(this, "com", 0);

		var parent = this;

	 	this.id = window.setInterval(function(){
 			parent.game1.update();
 			parent.game2.update();
 		}, this.tickMills);
	},

	/** Restarts the app */
	restart: function(){
		console.clear();
 		window.clearInterval(this.id);
 		this.start();
	},

	onGameOver: function(){
		window.clearInterval(this.id);
	}
};