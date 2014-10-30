function App(){

 	this.id = null;
 	
 	// Update rate in milliseconds
 	this.tickMills = 50;

 	this.mode = null;
}

App.prototype = {

	launch: function(){
		
		if (this.gameRenderer != null)
			this.gameRenderer.clear();

		this.UI = new UI();
		this.listener = new MenuListener(this);
	},
	
	/** Starts the app: initialises the two games */
	start: function(mode){

		if (this.id != null) window.clearInterval(this.id);

		if (this.UI) this.UI.remove();

		this.gameRenderer = new GameRenderer(mode);

		this.mode = mode;

		switch(this.mode){
			
			case "1p":
				this.onePlayer();
				break;
			
			case "2p":
				this.twoPlayers();
				break;
			
			case "vscom":
				this.gameVSCOM();
				break;
		}
		
	},

	onePlayer: function(){

		this.game = new Game(this, "p1", 0);

		var parent = this;

	 	this.id = window.setInterval(function(){
 			parent.game.update();
 		}, this.tickMills);
	},

	twoPlayers: function(){

		this.game1 = new Game(this, "p1", 0);
		this.game2 = new Game(this, "p2", 0);

		var parent = this;

	 	this.id = window.setInterval(function(){
 			parent.game1.update();
 			parent.game2.update();
 		}, this.tickMills);
	},

	gameVSCOM: function(){

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
 		this.start(this.mode);
	},

	onGameOver: function(){
		window.clearInterval(this.id);
	}
};