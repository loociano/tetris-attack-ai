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
	this.renderGrid();
	this.renderBoard();
	this.renderCursor();
};

/** Refreshes */
Renderer.prototype.refresh = function(){

	for (var line = 0; line < this.board.getHeight(); line++){
		for (var col = 0; col < this.board.getWidth(); col++){	
			var block = this.board.getBlock(line, col);
			
			if (block != null){

				//console.log(block.getState() + " " + line + " " + col);
				
				// Handle combos
				if (block.isStateCombo()){
					var position = this.getPositionClass(line, col);
					var blockElt = document.getElementsByClassName(position)[0];
					blockElt.className = blockElt.className.replace( /(?:^|\s)none(?!\S)/g , ' combo');
				}

				// Handle explosions
				if (block.isExploding()){
					var position = this.getPositionClass(line, col);
					var blockElt = document.getElementsByClassName(position)[0];
					
					blockElt.className = "tile "+ position + " empty";
					this.board.fallCascade(line, col);
					this.board.setBlock(null, line, col);

					// When animation finishes, delete element from DOM
					blockElt.addEventListener('webkitTransitionEnd', blockElt.remove(), false);
				}

				// Handle falls
				if (block.isFalling()){
					var position = this.getPositionClass(line, col);
					var blockElt = document.getElementsByClassName(position)[0];
					var newLine = this.board.nextAvailableLine(line, col);
					var newPosition = this.getPositionClass(newLine, col);
					
					blockElt.classList.remove(position);
					blockElt.classList.add('fall');
					blockElt.classList.add(newPosition);
					
					blockElt.addEventListener('webkitTransitionEnd', this.afterFall(blockElt, block, line, newLine, col), false);
				}

				// Handle right moves
				if (block.isMovingRight()){
					var position = this.getPositionClass(line, col);
					var newPosition = this.getPositionClass(line, col+1);
					var blockElt = this.getBlockElement(position);
					console.log(blockElt);
					blockElt.classList.remove(position);
					blockElt.classList.remove("none");
					blockElt.classList.add("right");
					blockElt.classList.add(newPosition);
					//blockElt.addEventListener('webkitTransitionEnd', this.afterRightMove(block, line, col), false);
				} else if (block.isMovingLeft()) {

					// Handle left moves
					var leftBlock = this.board.getBlock(line, col-1);
					
					var position = this.getPositionClass(line, col);
					var newPosition = this.getPositionClass(line, col-1);
					
					var blockElt = this.getNoneElement(position);

					blockElt.classList.remove(position);
					blockElt.classList.remove("none");
					blockElt.classList.add("left");
					blockElt.classList.add(newPosition);

					blockElt.addEventListener('webkitTransitionEnd', this.afterLeftMove(leftBlock, block, line, col-1), false);
				}
			}
		}
	}
};

Renderer.prototype.getBlockElement = function(position){
	var blockElts = document.getElementsByClassName(position);
	for (var i = 0; i < blockElts.length; i++){
		var blockElt = blockElts[i];
		if (blockElt.id != "cursor"){
			return blockElt;
		}
	}
};

Renderer.prototype.getNoneElement = function(position){
	var blockElts = document.getElementsByClassName(position);
	for (var i = 0; i < blockElts.length; i++){
		var blockElt = blockElts[i];
		if (blockElt.classList.contains("none")){
			return blockElt;
		}
	}
};

Renderer.prototype.getNoneElement = function(position){
	var blockElts = document.getElementsByClassName(position);
	for (var i = 0; i < blockElts.length; i++){
		var blockElt = blockElts[i];
		if (blockElt.classList.contains("none")){
			return blockElt;
		}
	}
};

/** Callback after left move finishes */
Renderer.prototype.afterLeftMove = function(leftBlock, rightBlock, line, col){
	debugger

	leftBlock.setNone();
 	rightBlock.setNone();

	this.board.setBlock(leftBlock, line, col+1);
	this.board.setBlock(rightBlock, line, col);
 	//this.board.setBlock(null, line, col);
};

/** Callback after left move finishes */
Renderer.prototype.afterRightMove = function(block, line, col){
	//this.board.setBlock(null, line, col);
 	this.board.setBlock(block, line, col+1);
 	block.setNone();
};

/** Callback after fall finishes */
Renderer.prototype.afterFall = function(blockElt, block, line, newLine, col){
	this.board.setBlock(null, line, col);
	this.board.setBlock(block, newLine, col);
	blockElt.classList.remove('fall');
	blockElt.classList.add('none');
	block.setNone();
};

/** Renders a swap */
Renderer.prototype.renderSwap = function(leftBlock, rightBlock, line, col){

	var posLeft = this.getPositionClass(line, col);
	var posRight = this.getPositionClass(line, col+1);

	var blockLeftElt = null;
	var blockRightElt = null;

	if (leftBlock != null){
		blockLeftElt = document.getElementsByClassName(posLeft)[0];
		blockLeftElt.classList.remove(posLeft);
		blockLeftElt.classList.add("swap");
		blockLeftElt.classList.add(posRight);
	}

	if (rightBlock != null){
		blockRightElt = document.getElementsByClassName(posRight)[0];
		blockRightElt.classList.remove(posRight);
		blockRightElt.classList.add("swap");
		blockRightElt.classList.add(posLeft);
	}

	(leftBlock != null) ? 
		blockLeft.addEventListener('webkitTransitionEnd', this.afterSwap(leftBlock, rightBlock, line, col), false) :
		blockRight.addEventListener('webkitTransitionEnd', this.afterSwap(leftBlock, rightBlock, line, col), false);
};

/** After swap */
Renderer.prototype.afterSwap = function(leftBlock, rightBlock, line, col){
	this.board.setBlock(rightBlock, line, col);
 	this.board.setBlock(leftBlock, line, col+1);
 	if (leftBlock != null) leftBlock.setNone();
 	if (rightBlock != null) rightBlock.setNone();
 };

/** Clears the content */
Renderer.prototype.clear = function(){
	var container = document.getElementById("game");
	if (container != null)
		container.remove();
};

/** Renders the grid behind the blocks */
Renderer.prototype.renderGrid = function(){
	var size = 3.7;
	for (var line = this.board.getHeight() - 1; line >= 0; line--){
		for (var col = 0; col < this.board.getWidth(); col++){
			var gridElt = document.createElement("div");
			gridElt.className = "tile empty";
			gridElt.style.transform = "translate("+(col*size)+"em, "+(line*size)+"em)";
			this.boardElt.appendChild(gridElt);
		}
	}
}

/** Renders board on HTML */
Renderer.prototype.renderBoard = function(){

	for (var line = this.board.getHeight() - 1; line >= 0; line--){
		for (var col = 0; col < this.board.getWidth(); col++){			
			var block = this.board.getBlock(line, col);
			if (block != null){
				var blockElt = document.createElement("div");
				this.setClassNames(blockElt, block, line, col);
				this.boardElt.appendChild(blockElt);
			}
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
Renderer.prototype.setClassNames = function(blockElt, block, line, col){

	blockElt.className = "";

	var classNames = "tile block " + block.getType() + " " + block.getState() + " ";
	
	// Handle new position when falling
	var theLine = line;
	if (block.isFalling()){
		theLine = this.board.nextAvailableLine(line,col);
	}
	classNames += this.getPositionClass(theLine, col);
	blockElt.className = classNames;
};