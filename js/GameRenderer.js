/**
 * Game Renderer
 *
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */
function GameRenderer(mode){
	this.mode = mode;
	this.clear();
	this.render();
}

GameRenderer.prototype = {

	clear: function(){
		var elt = document.getElementById("game");
		if (elt != null) elt.remove();

		var grid = document.getElementById("bg-grid");
		if (grid != null) grid.remove();

		document.body.className = "";
	},

	/** Renders the game scenario */
	render: function(){
		var body = document.body;
		body.className = "play";
		
		var grid = document.createElement("div");
		grid.id = "bg-grid";

		var container = document.createElement("div");
		container.className = "container " + "mode-"+this.mode;
		container.id = "game";
		
		grid.appendChild(container);
		body.appendChild(grid);
	}
};