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

/** Renders board on HTML */
Renderer.prototype.renderBoard = function(){

	var body = document.body;
	var container = document.createElement("div");
	container.className = "container";

	var board = document.createElement("div");
	board.className = "board";

	for (var line = this.board.getHeight() - 1; line >= 0; line--){
		var lineElt = document.createElement("div");
		lineElt.className = "line";
		for (var col = 0; col < this.board.getWidth(); col++){
			
			var block = this.board.getBlock(line, col);
			var blockElt = document.createElement("div");
			var classNames = "square";
			
			if (col == 0) classNames += " first-line-block";
			if (block != null) classNames += " block " + block.getType();
			
			blockElt.className = classNames;
			lineElt.appendChild(blockElt);
		}
		board.appendChild(lineElt);
		container.appendChild(board);
		body.appendChild(container);
	}
};