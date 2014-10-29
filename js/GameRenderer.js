/**
 * Game Renderer
 *
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */
function GameRenderer(){
	this.clear();
	this.render();
}

GameRenderer.prototype = {

	clear: function(){
		var elt = document.getElementById("game");
		if (elt != null) elt.remove();
	},

	/** Renders the game scenario */
	render: function(){
		this.bodyElt = document.body;
		this.containerElt = document.createElement("div");
		this.containerElt.className = "container";
		this.containerElt.id = "game";
		this.bodyElt.appendChild(this.containerElt);
	}
};