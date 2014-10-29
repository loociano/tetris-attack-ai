/** 
 * HTML Renderer
 * Requires: Board
 * 
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */

// Block Pixel sizes
var blockSize = 48;
var blockBorder = 5;
var size = blockSize + 2 * blockBorder;

/** Constructor */
function Renderer(game, board, cursor){

	this.game = game;
	this.board = board;
	this.cursor = cursor;

	// Time a blocks hovers before falling
	this.hoverTimeMillis = 200; 

	// Time combos wait to explode
	this.comboMillis = 1000;

	// Maximum pixel position 
	this.maxHeightPx = (this.board.getWidth()-1)*size;

	// Pixel offset rate. Determines how many pixels to rise per cycle
	this.offsetRate = this.game.speed * this.game.tickMills / 1000;

	// Current offset. To determine when to add a new block line.
	this.currOffset = 0;

	this.containerElt = document.getElementById("game");

	this.pointsElt = document.createElement("div");
	this.pointsElt.className = "number";

	this.boardElt = document.createElement("div");
	this.boardElt.className = "board";

	this.cursorElt = document.createElement("div");
	this.cursorElt.id = "cursor";
	this.position = null;

	/** Flag to swap */
	this.swap = false;

	this.leftFinished = false;
	this.rightFinished = false;
	this.moveCol = null;
	this.moveLine = null;

	// Swap block pointers
	this.swapRightElt = null;
	this.swapLeftElt = null;

	// Hover block pointer
	this.hoverBlockElt = null;

	// Timeout identifiers
	this.hoverTimeoutSet = null;
	this.comboTimeOut = null;

	// Queues
	this.comboQueue = [];
	this.explodeQueue = [];
	this.fallQueue = [];

	// Rise flag
	this.riseFinished = true;
}

/** Renders all elements of the game */
Renderer.prototype.render = function(){
	this.renderGrid();
	this.renderBoard();
	this.renderDisabledLine();
	//this.renderPoints();
	this.renderCursor();
};

/** Refreshes */
Renderer.prototype.refresh = function(){

	// First analise the whole board
	for (var line = 0; line < this.board.getHeight(); line++){
		for (var col = 0; col < this.board.getWidth(); col++){	
			var block = this.board.getBlock(line, col);
			
			if (block != null){

				switch(block.getState()){

					case "combo":
						if (this.comboTimeOut == null){
							this.toQueue(this.comboQueue, line, col);
						}
						break;

					case "explode":
						this.renderExplode(block, line, col);
						break;

					case "fall":
						this.toQueue(this.fallQueue, line, col);
						break;

					case "right":
						this.moveRight(line, col);
						break;

					case "left":
						this.moveLeft(line, col);
						break;

					case "hover":
						this.renderHover(block, line, col);
						break;
				}
			}					
		}
	}
	// Then take actions

	// Check hover
	if (this.board.isHovering()){
		this.setHoverTimeout();
	}

	// Handle combo
	if (this.comboQueue.length > 0){
		this.renderCombo();

		if (this.queueFinished(this.comboQueue)){
			if (this.comboTimeOut == null){
				var parent = this;
				this.comboTimeOut = window.setTimeout(function(){
					parent.board.explodeCombos();
					parent.comboTimeOut = null;
				}, this.comboMillis);
			}
			this.comboQueue = [];
		}
	}

	if (this.explodeQueue.length > 0){
		if (this.queueFinished(this.explodeQueue)){
			this.explodeQueue = [];	
		}
	}

	// Handle fall
	if (this.fallQueue.length > 0){
		this.renderFall();
		if (this.queueFinished(this.fallQueue))
			this.fallQueue = [];
	}

	// Handle swap
	if (this.swap){
		this.renderSwap();	
	}

	// Check if any swap has finished
	if (this.leftFinished && this.rightFinished){
		this.afterSwap();
	}
};

/** Renders game over */
Renderer.prototype.renderGameOver = function(){
	
	var blockElts = document.getElementsByClassName("block");

	// Delete all blocks and cursor
	while(blockElts.length > 0){
		blockElts[0].remove();
	}
	this.cursorElt.remove();

	var gameoverElt = document.createElement("div");
	gameoverElt.innerText = "Game Over";
	gameoverElt.id = "game-over";
	this.boardElt.appendChild(gameoverElt);
};

/** 
 * Rises the blocks 
 * @param amount (optional)
 */
Renderer.prototype.rise = function(amount){

	if (!this.game.isCombo() && this.riseFinished){

		this.riseFinished = false; // Set flag

		var offset = this.offsetRate;
		if (amount != null)
			offset += amount;

		// Rise blocks
		var blockElts = document.getElementsByClassName("block");
		for (var i = 0; i < blockElts.length; i++){
			var blockElt = blockElts[i];
			if (!addOffsetY(blockElt, -offset)){
				this.riseFinished = true;
				return false;
			}
		}

		// Rise cursor
		addOffsetY(this.cursorElt, -offset);

		// Update current offset
		this.currOffset += offset;

		// Grow new line
		this.growNewLine();

		while (this.currOffset > size){
			
			// Lift board one line
			this.board.lift();

			// Lift cursor model
			this.cursor.up();
			
			// Add a new line
			this.board.pushNewLine();

			// Reset current offset with the remaining
			this.currOffset = this.currOffset - size;

			this.renderNewLine();

			this.growNewLine();
			this.riseNewLine();
		}

		this.riseFinished = true;
	}
	return true;
};

/** Rises the new line the rate offset in pixels */
Renderer.prototype.riseNewLine = function(){
	var blockElts = document.getElementsByClassName("disabled");
	for (var col = 0; col < blockElts.length; col++){
		addOffsetY(blockElts[col], -this.currOffset);
	}
};

/** Rises the new line the rate offset in pixels */
Renderer.prototype.growNewLine = function(){
	var blockElts = document.getElementsByClassName("disabled");
	for (var col = 0; col < blockElts.length; col++){
		blockElt = blockElts[col];
		
		if (this.currOffset >= blockSize){
			blockElt.style.height = blockSize + "px";
			blockElt.style.borderBottomWidth = this.currOffset - blockSize + "px";
			
		} else {
			blockElt.style.height = this.currOffset + "px";
			blockElt.style.borderBottomWidth = 0;
		}
	}
};

/** Returns true is a given queue has finished */ 
Renderer.prototype.queueFinished = function(queue){

	queue.forEach(function(e){
		if (!e.finished)
			return false;
	});
	return true;
};

/** Set hover timeout */
Renderer.prototype.setHoverTimeout = function(){

	var parent = this;

	if (this.hoverTimeoutSet == null){
		
		this.hoverTimeoutSet = window.setTimeout(function(){
			
			var pos = parent.board.getHoveringPos();
			parent.afterHover(pos.y, pos.x);

		}, this.hoverTimeMillis);
	}
};

/** Renders combo */
Renderer.prototype.renderHover = function(block, line, col){
	var block = this.getBlockElt(line, col);
	if (block != null){
		this.hoverBlockElt = block;
	}
};

/** Action after hover */
Renderer.prototype.afterHover = function(line, col){

	if (this.game.isHover()){
		if (this.hoverBlockElt != null){
			switchClass(this.hoverBlockElt, "hover", "none");
		} else {
			debugger
		}
		this.board.stopHover();
		this.game.ready();
		this.hoverBlockElt = null;
		this.hoverTimeoutSet = null;
	} else {
		console.warn('Wrong hover state: ' + this.game.getState());
	}
};

/** Renders combo */
Renderer.prototype.renderCombo = function(block, line, col){

	for (var i = 0; i < this.comboQueue.length; i++){

		if (!this.comboQueue[i].finished){

			var line = this.comboQueue[i].line;
			var col = this.comboQueue[i].col;

			var blockElt = this.getBlockElt(line, col);

			if (blockElt != null){
				
				if (!blockElt.classList.contains("combo")){
					
					switchClass(blockElt, "none", "combo");
				
					// Callback when animation finishes
					blockElt.addEventListener('webkitTransitionEnd', this.afterCombo(i), false);
				}
			}
		}
	}
};

/** Renders explode */
Renderer.prototype.renderExplode = function(block, line, col){

	this.toQueue(this.explodeQueue, line, col);
	
	var blockElt = this.getBlockElt(line, col);

	if (blockElt != null){
		if (!blockElt.classList.contains("explode")){
			switchClass(blockElt, "combo", "explode");

			// When animation finishes, delete element from DOM
			blockElt.addEventListener('webkitTransitionEnd', this.afterExplode(blockElt, this.explodeQueue.length-1), false);
		}
	}
};

/** Adds an element to a given queue */
Renderer.prototype.toQueue = function(queue, line, col){

	if (!this.isInQueue(queue)){
			queue.push({
			line: line, 
			col: col, 
			finished: false
		});
	}
};

/** Returns true if the given coordinates are in the combo queue */
Renderer.prototype.isInQueue = function(queue, line, col){
	
	queue.forEach(function(e) {
		if (e.line == line && e.col == col){
			return true;
		}
	});
	return false;
};

/** Renders the fall of blocks in queue */
Renderer.prototype.renderFall = function(){

	for (var i = 0; i < this.fallQueue.length; i++){

		if (!this.fallQueue[i].finished){

			var line = this.fallQueue[i].line;
			var col = this.fallQueue[i].col;
			var newLine = this.board.nextAvailableLine(line, col);

			var blockElt = this.getBlockElt(line, col);

			if (blockElt != null){

				switchClass(blockElt, "none", "fall");

				var gap = line - newLine;
			
				// Compute new vertical pixel position
				var newY = getPositionY(blockElt) + (gap*size);

				// Start animation
				setPositionY(blockElt, newY);

				// Update model
				this.board.moveBlockDown(line, col, newLine);
			
				blockElt.addEventListener('webkitTransitionEnd', this.afterFall(i), false);
			}
		}
	}
};

/** Prepares the block to move right */
Renderer.prototype.moveRight = function(line, col){

	var rightBlock = this.board.getBlock(line, col+1); 
	
	this.moveLine = line;
	this.moveCol = col;

	if (rightBlock != null){
		if (rightBlock.isMovingLeft()){
			this.swap = true;
		} else {
			console.info('Right block cannot move');
			this.swap = false;
		}
	} else {
		// Handle shifting right: there is no block on the right side.
		this.swap = true;
		this.leftFinished = true;
	}
};

/** Prepares the block to move left */
Renderer.prototype.moveLeft = function(line, col){

	var leftBlock = this.board.getBlock(line, col-1);

	this.moveLine = line;
	this.moveCol = col-1;

	if (leftBlock != null){
		if(leftBlock.isMovingRight()){
			this.swap = true;
		} else {
			console.info('Left block cannot move');
			this.swap = false;
		}
	} else {
		// Handle Shifting Left: because there is no block on the left side.
		this.swap = true;
		this.rightFinished = true;
	}
};

/** Renders swap */
Renderer.prototype.renderSwap = function(){

	// Get elements
	if (!this.rightFinished){
		this.swapRightElt = this.getBlockElt(this.moveLine, this.moveCol);
	}

	if (!this.leftFinished){
		this.swapLeftElt = this.getBlockElt(this.moveLine, this.moveCol+1);
	}

	// Swap if existing
	if (this.swapRightElt != null){
		// Move right
		var x = getPositionX(this.swapRightElt);
		setPositionX(this.swapRightElt, x + size);
		switchClass(this.swapRightElt, "none", "right");

		// Add listener
		blockElt.addEventListener('webkitTransitionEnd', this.afterRightMove(), false);
	}

	if (this.swapLeftElt != null){
		// Move left					
		var x = getPositionX(this.swapLeftElt);
		setPositionX(this.swapLeftElt, x - size);
		switchClass(this.swapLeftElt, "none", "left");

		// Add listener
		blockElt.addEventListener('webkitTransitionEnd', this.afterLeftMove(), false);
	}
	this.swap = false;
};

/** Updates board after swap finishes */ 
Renderer.prototype.afterSwap = function(){

	if (this.swapLeftElt != null){
		if (this.board.isBlockUnderneath(this.moveLine, this.moveCol)){
			switchClass(this.swapLeftElt, "left", "none");
		} else {
			switchClass(this.swapLeftElt, "left", "hover");
			this.game.hover();
		}
	}
	
	if (this.swapRightElt != null){
		if (this.board.isBlockUnderneath(this.moveLine, this.moveCol+1)){
			switchClass(this.swapRightElt, "right", "none");
		} else {
			switchClass(this.swapRightElt, "right", "hover");
			this.game.hover();
		}
	}

	// Update model
	this.board.swap(this.moveLine, this.moveCol);

	// Reset swap variables
	this.moveLine = null;
	this.moveCol = null;
	this.leftFinished = false;
	this.rightFinished = false;
	this.swapLeftElt = null;
	this.swapRightElt = null;

	// Update game state
	if (this.game.isSwap()){
		this.game.ready();
	} else {
		if (!this.game.isHover()){
			console.warn('Wrong swap state: ' + this.game.getState());
		}
	}
};

/** Callback after left move finishes */
Renderer.prototype.afterLeftMove = function(blockElt){
	// Do no remove the "left" class yet, wait the right movement to finish.
	this.leftFinished = true;
};

/** Callback after left move finishes */
Renderer.prototype.afterRightMove = function(){
	// Do no remove the "right" class yet, wait the left movement to finish.
	this.rightFinished = true;
};

/** Callback after fall finishes */
Renderer.prototype.afterFall = function(fallIndex){
	this.fallQueue[fallIndex].finished = true;
};

/** Callback after combo finishes */
Renderer.prototype.afterCombo = function(comboIndex){
	this.comboQueue[comboIndex].finished = true;
};

/** Callback after explosion finishes */
Renderer.prototype.afterExplode = function(blockElt, explodeIndex){
	
	this.explodeQueue[explodeIndex].finished = true;
	var line = this.explodeQueue[explodeIndex].line;
	var col = this.explodeQueue[explodeIndex].col;
	
	blockElt.remove();
	this.board.fallCascade(line, col);
	this.board.setBlock(null, line, col);

	// Increase points
	this.updatePoints(this.game.addPoint());
};

/** Callback after new line becomes available */
Renderer.prototype.renderNewLine = function(){
	var blockElts = document.getElementsByClassName("disabled");
	while (blockElts.length > 0){
		blockElts[0].style.borderBottomWidth = "0.35em";
		blockElts[0].style.height = "48px";
		switchClass(blockElts[0], "disabled", "none");
	}
	this.renderDisabledLine();
};

/** Clears the content */
Renderer.prototype.clear = function(){
	var board = document.getElementsByClassName("board")[0];
	if (board != null)
		board.remove();
};

/** Renders the grid behind the blocks */
Renderer.prototype.renderGrid = function(){
	
	for (var line = this.board.getHeight() - 1; line >= 0; line--){
		for (var col = 0; col < this.board.getWidth(); col++){
			var gridElt = document.createElement("div");
			gridElt.className = "tile empty";
			this.setPosition(gridElt, line, col);
			this.boardElt.appendChild(gridElt);
		}
	}
};

/** Sets the position using CSS transform */
Renderer.prototype.setPosition = function(elt, line, col){
	var x = col * size;
	var y = (this.board.getHeight()-1-line) * size;
	elt.style.transform = "matrix(1, 0, 0, 1, " + x + ", " + y + ")";
};

/** Renders the points panel */
Renderer.prototype.renderPoints = function(){

	var pointsContainerElt = document.createElement("div");
	pointsContainerElt.id = "points";
	var titleElt = document.createElement("h1");
	titleElt.innerText = "Points";
	pointsContainerElt.appendChild(titleElt);
	
	this.pointsElt.innerText = "0";
	this.pointsElt.classList.add("animated");
	this.pointsElt.classList.add("bounce");
	pointsContainerElt.appendChild(this.pointsElt);

	this.containerElt.appendChild(pointsContainerElt);
};

/** Updates points */
Renderer.prototype.updatePoints = function(points){
	this.pointsElt.innerText = points;
};

/** Renders board on HTML */
Renderer.prototype.renderBoard = function(){

	for (var line = this.board.getHeight() - 1; line >= 0; line--){
		for (var col = 0; col < this.board.getWidth(); col++){			
			var block = this.board.getBlock(line, col);
			if (block != null){
				var blockElt = document.createElement("div");
				this.setClassNames(blockElt, block);
				this.setPosition(blockElt, line, col);
				this.boardElt.appendChild(blockElt);
			}
		}
	}
	this.containerElt.appendChild(this.boardElt);
};

/** Renders the new line */
Renderer.prototype.renderDisabledLine = function(){
	for (var col = 0; col < this.board.getWidth(); col++){
		var block = this.board.getNewLineBlock(col);

		var blockElt = document.createElement("div");
		this.setClassNames(blockElt, block);
		this.setPosition(blockElt, -1, col);
		this.boardElt.appendChild(blockElt);
	}
};

/** Renders the cursor */
Renderer.prototype.renderCursor = function(){
	position = this.cursor.getPosition();
	this.setPosition(this.cursorElt, position.y, position.x);
	this.boardElt.appendChild(this.cursorElt);
};

/** Updates the position of the cursor */
Renderer.prototype.updateCursor = function(){
	position = this.cursor.getPosition();
	this.setPosition(this.cursorElt, position.y, position.x);
	addOffsetY(this.cursorElt, -this.currOffset);
}

/** 
 * Returns a block DOM element given a line and column.
 * This function is key to avoid game crashing. 
 */
Renderer.prototype.getBlockElt = function(line, col){

	var maxY = ((this.board.getHeight() - 1) - line) * size;
	var minY = ((this.board.getHeight() - 1) - line - 1) * size;
	
	var classNames = "block " + this.board.getPlayer();
	var blockElts = document.getElementsByClassName(classNames);
	for (var i = 0; i < blockElts.length; i++){
		var blockElt = blockElts[i];
		var x = getPositionX(blockElt);
		if (x == col * size){
			var y = getPositionY(blockElt);
			if (y <= maxY && y > minY){
				return blockElt;
			}
		}
	}
	console.error('Block Not found');
	debugger
	return null;
};

/** Sets the class names for blocks */
Renderer.prototype.setClassNames = function(blockElt, block){
	blockElt.className = this.board.getPlayer() + " tile block " + block.getType() + " " + block.getState();
};