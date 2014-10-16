/** 
 * HTML Renderer
 * Requires: Board
 * 
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */
function Renderer(board, cursor){
	this.board = board;
	this.cursor = cursor;

	this.bodyElt = document.body;
	this.containerElt = document.createElement("div");
	this.containerElt.className = "container";
	this.containerElt.id = "game";

	this.boardElt = document.createElement("div");
	this.boardElt.className = "board";

	this.cursorElt = document.createElement("div");
	this.cursorElt.id = "cursor";
	this.position = null;
}

/** Renders all elements of the game */
Renderer.prototype.render = function(){
	this.renderBoard();
	this.renderCursor();
};

/** Refreshes */
Renderer.prototype.refresh = function(){
	for (var line = 0; line < this.board.getHeight(); line++){
		for (var col = 0; col < this.board.getWidth(); col++){	
			var block = this.board.getBlock(line, col);
			
			// Handle combos
			if (block != null){
				if (block.isStateCombo()){
					var position = this.getPositionClass(line, col);
					var blockElt = document.getElementsByClassName(position)[0];
					blockElt.className = blockElt.className.replace( /(?:^|\s)none(?!\S)/g , ' combo');
				}
				if (block.isExploding()){
					var position = this.getPositionClass(line, col);
					var blockElt = document.getElementsByClassName(position)[0];
					
					blockElt.className = "tile "+ position + " empty";
					this.board.fallCascade(line, col);
					this.board.setBlock(null, line, col);
				}
				if (block.isFalling()){
					var position = this.getPositionClass(line, col);
					var blockElt = document.getElementsByClassName(position)[0];
					var newLine = this.board.nextAvailableLine(line, col);
					var newPosition = this.getPositionClass(newLine, col);
					
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

/** Renders a swap */
Renderer.prototype.renderSwap = function(line, col){

	// Get block elements
	var posLeft = this.getPositionClass(line, col);
	var blockLeft = document.getElementsByClassName(posLeft)[0];

	var posRight = this.getPositionClass(line, col+1);
	var blockRight = document.getElementsByClassName(posRight)[0];

	// Exchange position classes
	blockLeft.classList.remove(posLeft);
	blockLeft.classList.add(posRight);
	
	blockRight.classList.remove(posRight);
	blockRight.classList.add(posLeft);
};

/** Clears the content */
Renderer.prototype.clear = function(){
	var container = document.getElementById("game");
	if (container != null)
		container.remove();
};

/** Renders board on HTML */
Renderer.prototype.renderBoard = function(){

	for (var line = this.board.getHeight() - 1; line >= 0; line--){
		for (var col = 0; col < this.board.getWidth(); col++){			
			var blockElt = document.createElement("div");
			this.setClassNames(blockElt, line, col);
			this.boardElt.appendChild(blockElt);
		}
	}
	this.containerElt.appendChild(this.boardElt);
	this.bodyElt.appendChild(this.containerElt);
};

/** Renders the cursor */
Renderer.prototype.renderCursor = function(){
	position = this.cursor.getPosition();
	this.cursorElt.classList.add(this.getPositionClass(position.y, position.x));
	this.boardElt.appendChild(this.cursorElt);
};

/** Updates the position of the cursor */
Renderer.prototype.updateCursor = function(){
	this.cursorElt.classList.remove(this.getPositionClass(position.y, position.x));
	position = this.cursor.getPosition();
	this.cursorElt.classList.add(this.getPositionClass(position.y, position.x));
}

/** Returns the position CSS class given a line and col */ 
Renderer.prototype.getPositionClass = function(line, col){
	return "position-"+ line + "-" + col;
}

/** Sets the class names for blocks */
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