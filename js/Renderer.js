/** 
 * HTML Renderer
 * Requires: Board
 * 
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */

var hoverTimeMillis = 200; 
var comboMillis = 500; 

function Renderer(game, board, cursor){
	this.game = game;
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

	this.leftFinished = false;
	this.rightFinished = false;
	this.moveCol = null;
	this.moveLine = null;

	this.blockSwapLeft = null;
	this.blockSwapRight = null;

	this.swapRightElt = null;
	this.swapLeftElt = null;

	this.hoverTimeoutSet = false;
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

				switch(block.getState()){

					case "combo":
						this.renderCombo(block, line, col);
						break;

					case "explode":
						this.renderExplode(block, line, col);
						break;

					case "fall":
						this.renderFall(block, line, col);
						break;

					case "right":
						this.renderRight(block, line, col);
						break;

					case "left":
						this.renderLeft(block, line, col);
						break;

					case "hover":
						this.renderHover(block, line, col);
						break;
				}

				// Check if any swap has finished
				if (this.leftFinished && this.rightFinished){
					this.afterSwap(line, col);
				}

				// Check hover
				if (this.board.isHovering()){

					var parent = this;

					if (!this.hoverTimeoutSet){
	 					window.setTimeout(function(){
	 						var pos = parent.board.getHoveringPos();
	 						parent.afterHover(pos.y, pos.x);
	 						parent.hoverTimeoutSet = false;
	 					}, hoverTimeMillis);
	 					this.hoverTimeoutSet = true;
 					}
 				}
			}
		}
	}
};

/** Renders combo */
Renderer.prototype.renderHover = function(block, line, col){

	var position = this.getPositionClass(line, col);
	var blockElt = document.getElementsByClassName(position)[0];

	if (!blockElt.classList.contains("hover")){
		this.switchClass(blockElt, "none", "hover");
	}
};

/** Action after hover */
Renderer.prototype.afterHover = function(line, col){

	var position = this.getPositionClass(line, col);
	var blockElt = document.getElementsByClassName(position)[0];

	this.switchClass(blockElt, "hover", "none");

	this.board.stopHover();
	if (this.game.isHover()){
		this.game.ready();
	} else {
		debugger
	}
};

/** Renders combo */
Renderer.prototype.renderCombo = function(block, line, col){

	var position = this.getPositionClass(line, col);
	var blockElt = document.getElementsByClassName(position)[0];

	if (!blockElt.classList.contains("combo")){
		this.switchClass(blockElt, "none", "combo");
		
		// Callback when animation finishes
		blockElt.addEventListener('webkitTransitionEnd', this.afterCombo(), false);
	}
};

/** Renders explode */
Renderer.prototype.renderExplode = function(block, line, col){

	var position = this.getPositionClass(line, col);
	var blockElt = document.getElementsByClassName(position)[0];

	if (!blockElt.classList.contains("explode")){

		this.switchClass(blockElt, "combo", "explode");
		//blockElt.className = "tile "+ position + " empty";

		// When animation finishes, delete element from DOM
		blockElt.addEventListener('webkitTransitionEnd', this.afterExplode(blockElt, line, col), false);
	}
};

/** Renders fall */
Renderer.prototype.renderFall = function(block, line, col){

	var position = this.getPositionClass(line, col);
	var blockElt = document.getElementsByClassName(position)[0];

	if (!blockElt.classList.contains("fall")){
		
		var newLine = this.board.nextAvailableLine(line, col);
		var newPosition = this.getPositionClass(newLine, col);

		this.switchClass(blockElt, "none", "fall");
		this.switchClass(blockElt, position, newPosition);
		blockElt.addEventListener('webkitTransitionEnd', this.afterFall(blockElt, block, line, newLine, col), false);
	}
};

/** Renders right */
Renderer.prototype.renderRight = function(block, line, col){

	var position = this.getPositionClass(line, col);
	var blockElt = this.getMovingRightElement(position);

	if (!blockElt.classList.contains("right")){
		
		this.blockSwapRight = block;
		this.moveLine = line;
		this.moveCol = col;

		// Handle Shifting Right: because there is no block on the right side
		if (this.board.getBlock(line, col+1) == null){
			this.leftFinished = true;
		}

		var newPosition = this.getPositionClass(line, col+1);

		this.switchClass(blockElt, "none", "right");
		this.switchClass(blockElt, position, newPosition);
		blockElt.addEventListener('webkitTransitionEnd', this.afterRightMove(blockElt), false);
	}	
};

/** Renders left */
Renderer.prototype.renderLeft = function(block, line, col){

	this.blockSwapLeft = block;
	this.moveLine = line;
	this.moveCol = col-1;

	// Handle Shifting Left: because there is no block on the left side
	if (this.board.getBlock(line, col-1) == null){
		this.rightFinished = true;
	}

	// Move left					
	var position = this.getPositionClass(line, col);
	var newPosition = this.getPositionClass(line, col-1);
	var blockElt = this.getMovingLeftElement(position);

	this.switchClass(blockElt, "none", "left");
	this.switchClass(blockElt, position, newPosition);

	blockElt.addEventListener('webkitTransitionEnd', this.afterLeftMove(blockElt), false);
};

/** Switches css class */
Renderer.prototype.switchClass = function(elt, oldClass, newClass){
	elt.classList.remove(oldClass);
	elt.classList.add(newClass);
};

/** Returns the block DOM element which is moving right, given a position CSS class */ 
Renderer.prototype.getMovingRightElement = function(position){
	
	var result = null;
	var blockElts = document.getElementsByClassName(position);
	for (var i = 0; i < blockElts.length; i++){
		var blockElt = blockElts[i];
		// Make sure to skip the cursor
		if (blockElt.id != "cursor"){
			result = blockElt;
		}
	}
	this.swapRightElt = result;
	if (result == null){
		debugger
	}
	return result;
};

/** Returns the block DOM element which is moving left, given a position css class */
Renderer.prototype.getMovingLeftElement = function(position){

	var result = null;
	var blockElts = document.getElementsByClassName(position);

	for (var i = 0; i < blockElts.length; i++){
		var blockElt = blockElts[i];
		if (!blockElt.classList.contains("right")){
			result = blockElt;
		}
	}
	if (result == null){
		debugger
	}
	this.swapLeftElt = result;
	return result;
};

/** Updates board after swap finishes */ 
Renderer.prototype.afterSwap = function(){

	if (this.swapLeftElt != null){
		if (this.board.isBlockUnderneath(this.moveLine, this.moveCol)){
			this.switchClass(this.swapLeftElt, "left", "none");
		} else {
			this.switchClass(this.swapLeftElt, "left", "hover");
			this.game.hover();
		}
	}
	
	if (this.swapRightElt != null){
		if (this.board.isBlockUnderneath(this.moveLine, this.moveCol+1)){
			this.switchClass(this.swapRightElt, "right", "none");
		} else {
			this.switchClass(this.swapRightElt, "right", "hover");
			this.game.hover();
		}
	}

	this.board.swap(this.moveLine, this.moveCol);

	// Update game state
	if (this.game.isSwap()){
		this.game.ready();	
	}

	// Reset swap variables
	this.moveLine = null;
	this.moveCol = null;
	this.leftFinished = false;
	this.rightFinished = false;
	this.swapLeftElt = null;
	this.swapRightElt = null;
};

/** Callback after left move finishes */
Renderer.prototype.afterLeftMove = function(blockElt){
	this.leftFinished = true;
};

/** Callback after left move finishes */
Renderer.prototype.afterRightMove = function(blockElt){
	
	// Do no remove the "right" class yet, wait the left movement to finish.
	this.rightFinished = true;
};

/** Callback after fall finishes */
Renderer.prototype.afterFall = function(blockElt, block, line, newLine, col){
	this.board.setBlock(null, line, col);
	this.board.setBlock(block, newLine, col);
	blockElt.classList.remove('fall');
	blockElt.classList.add('none');
	block.setNone();
};

/** Callback after combo finishes */
Renderer.prototype.afterCombo = function(){
	var parent = this;
	window.setTimeout(function(){
		parent.board.explodeCombos();	
	}, comboMillis);
};

/** Callback after explosion finishes */
Renderer.prototype.afterExplode = function(blockElt, line, col){
	blockElt.remove();
	this.board.fallCascade(line, col);
	this.board.setBlock(null, line, col);
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