/** 
 * HTML Renderer
 * Requires: Board
 * 
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */
function Renderer(board){
	this.board = board;
}

/** Refreshes */
Renderer.prototype.refresh = function(){
	this.clear();
	this.renderBoard();
};

/** Clears the content */
Renderer.prototype.clear = function(){
	var container = document.getElementById("game");
	if (container != null)
		container.remove();
};

/** Renders board on HTML */
Renderer.prototype.renderBoard = function(){

	var body = document.body;
	var container = document.createElement("div");
	container.className = "container";
	container.id = "game";

	var board = document.createElement("div");
	board.className = "board";

	for (var line = this.board.getHeight() - 1; line >= 0; line--){
		//var lineElt = document.createElement("div");
		//lineElt.className = "line";
		for (var col = 0; col < this.board.getWidth(); col++){
			
			var block = this.board.getBlock(line, col);
			var blockElt = document.createElement("div");

			var classNames = "tile " + this.getPositionClass(line, col);

			if (block != null)
				classNames += " block " + block.getType() + " " + block.getState();
			else
				classNames += " empty";
			
			blockElt.className = classNames;
			//lineElt.appendChild(blockElt);
			board.appendChild(blockElt);
		}
		//board.appendChild(lineElt);	
	}
	container.appendChild(board);
	body.appendChild(container);
};

Renderer.prototype.getPositionClass = function(line, col){
	return "position-"+ line + "-" + col;
}