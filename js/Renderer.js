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
/*Renderer.prototype.refresh = function(){
	this.clear();
	this.renderBoard();
};*/

/** Refreshes */
Renderer.prototype.refresh = function(){
	for (var line = 0; line < this.board.getHeight(); line++){
		for (var col = 0; col < this.board.getWidth(); col++){	
			var block = this.board.getBlock(line, col);
			
			// Handle combos
			if (block != null){
				if (block.isStateCombo()){
					var position = "position-"+line+"-"+col;
					var blockElt = document.getElementsByClassName(position)[0];
					blockElt.className = blockElt.className.replace( /(?:^|\s)none(?!\S)/g , ' combo');
				}
				if (block.isExploding()){
					var position = "position-"+line+"-"+col;
					var blockElt = document.getElementsByClassName(position)[0];
					blockElt.className = "tile "+ position + " empty";
					this.board.setBlock(null, line, col);
				}
				if (block.isFalling()){
					var position = "position-"+line+"-"+col;
					var blockElt = document.getElementsByClassName(position)[0];
					var newLine = this.board.nextAvailableLine(line, col);
					var newPosition = "position-"+newLine+"-"+col;
					blockElt.classList.remove(position);
					blockElt.classList.add('fall');
					blockElt.classList.add(newPosition);
					this.board.setBlock(null, line, col);
					this.board.setBlock(block, newLine, col);
				}
			}
		}
	}
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
		for (var col = 0; col < this.board.getWidth(); col++){			
			var blockElt = document.createElement("div");
			this.setClassNames(blockElt, line, col);
			board.appendChild(blockElt);
		}
	}
	container.appendChild(board);
	body.appendChild(container);
};

/** Returns the position CSS class given a line and col */ 
Renderer.prototype.getPositionClass = function(line, col){
	return "position-"+ line + "-" + col;
}

Renderer.prototype.setClassNames = function(blockElt, line, col){

	var block = this.board.getBlock(line, col);
	blockElt.className = "";

	var classNames = "tile ";
	
	var theLine = line;
	if (block != null && block.isFalling()){
		theLine = this.board.nextAvailableLine(line,col);
	}
	classNames += this.getPositionClass(theLine, col);

	if (block != null){
		classNames += " block " + block.getType() + " " + block.getState();
	} else{
		classNames += " empty";
	}		
	blockElt.className = classNames;
};