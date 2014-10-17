/**
 * Board Class
 * Requires: Block
 *
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */

/** Constructor */
function Board(board, width, height){
	(width == undefined) ? this.width = 6 : this.width = width;
	(height == undefined) ? this.height = 10 : this.height = height;

	this.board = [];
	(board == undefined) ? this.generate() : this.board = board;
}

/** Returns board's height */
Board.prototype.getHeight = function(){
	return this.height;
};

/** Returns board's width */
Board.prototype.getWidth = function(){
	return this.width;
};

/** Returns block given a line and column */
Board.prototype.getBlock = function(line, col){
	return this.board[line][col];
};

/** Sets block given a line and column */
Board.prototype.setBlock = function(block, line, col){
	this.board[line][col] = block;
};

/** Returns true if a line contains a given block type */
Board.prototype.hasBlockInLine = function(type, line){
	for (var col = 0; col < this.width; col++){
		var block = this.board[line][col];
		if (block != null && block.getType() == type)
			return true;
	}
	return false;
};

/** Returns true if a column contains a given block type */
Board.prototype.hasBlockInCol = function(type, col){
	for (var line = 0; line < this.height; line++){
		var block = this.board[line][col];
		if (block != null && block.getType() == type)
			return true;
	}
	return false;
};

/** Returns the number of blocks given a type */
Board.prototype.countBlocks = function(type){

	var count = 0;

	for (var line = 0; line < this.height; line++){
		for (var col = 0; col < this.width; col++){
			var block = this.board[line][col];
			if (block != null){
				if (block.getType() == type) count++;
			}
		}
	}
	return count;
};

/** Returns the number of blocks given a type, line and col */
Board.prototype.countBlocksInLine = function(type, line){

	var count = 0;

	for (var col = 0; col < this.width; col++){
		var block = this.board[line][col];
		if (block != null){
			if (block.getType() == type) count++;
		}
	}
	return count;
};

/** Returns the number of blocks given a type, line and col */
Board.prototype.countBlocksInCol = function(type, col){

	var count = 0;

	for (var line = 0; line < this.height; line++){
		var block = this.board[line][col];
		if (block != null){
			if (block.getType() == type) count++;
		}
	}
	return count;
};

/** Clean Combos and puts empty blocks */
Board.prototype.explodeCombos = function(){
	for (var line = 0; line < this.height; line++){
		for (var col = 0; col < this.width; col++){
			var block = this.board[line][col];
			if (block != null){
				if (block.isStateCombo()) {
					block.explode();
				}
			}
		}
	}
};

/** Moves down all blocks that have empty space underneath */
Board.prototype.applyGravity = function(){
	for (var line = 0; line < this.height; line++){
		for (var col = 0; col < this.width; col++){
			var block = this.board[line][col];
			if (block != null){
				if (!this.isBlockUnderneath(line, col)){
					block.fall();
					//this.board[line][col] = null;
					//this.board[this.nextAvailableLine(line,col)][col] = block;
				}
			}
		}
	}
};

/** Fall all blocks on top, in cascade */
Board.prototype.fallCascade = function(explodeLine, explodeCol){
	for (var line = explodeLine; line < this.height; line++){
		var block = this.board[line][explodeCol];
		if (block != null){
			if (!block.isExploding())
				block.fall();
		}
	}
};

/** Searches combos */
Board.prototype.searchCombos = function(){
	this.searchHorizontalCombos();
	this.searchVerticalCombos();
};

/** Searches horizontal combos */
Board.prototype.searchHorizontalCombos = function(){

	for (var line = 0; line < this.height; line++){

		var previousBlock = null;
		var count = 1;

		for (var col = 0; col < this.width; col++){
			var block = this.board[line][col];
			if (block != null && !block.isExploding()){
				if (block.compareType(previousBlock)){
					count++;
					if (col < this.width - 1) // Last line handling
						continue;
				}
			}
			if (count > 2){
				while(count > 0){
					var offset = 0;
					if (block != null){
						if ((col == this.width - 1) && block.compareType(previousBlock)){
							// Block in last column is part of the combo: include in the count
							offset = 1;
						}
					}
					this.board[line][col-count+offset].setStateCombo();
					count--;
				}
			}
			count = 1;
			previousBlock = block;
		}
	}
};

/** Searches vertical combos */
Board.prototype.searchVerticalCombos = function(){

	for (var col = 0; col < this.width; col++){

		var previousBlock = null;
		var count = 1;

		for (var line = 0; line < this.height; line++){
			var block = this.board[line][col];
			if (block != null && !block.isExploding()){
				if (block.compareType(previousBlock)){
					count++;
					if (line < this.height - 1) // Last line handling
						continue;
				}
			}
			if (count > 2){
				while(count > 0){
					var offset = 0;
					if (block != null){
						if ((line == this.height - 1) && block.compareType(previousBlock)){
							// Block in last line is part of the combo: include in the count
							offset = 1;
						}
					}
					this.board[line-count+offset][col].setStateCombo();
					count--;
				}
			}
			count = 1;
			previousBlock = block;
		}
	}
};

/** Returns true if the contiguous block is equal given a direction
	Direction can be up, down, left, right */
Board.prototype.isNextBlockEqual = function(line, col, direction){

	var isEqual = false;
	var block = this.board[line][col];

	switch(direction){

		case "up":
			if (line < this.height - 1){
				var upperBlock = this.board[line+1][col];
				if (upperBlock != null){
					isEqual = block.compareType(upperBlock);
				}
			}
			break;

		case "down":
			if (line > 0){
				var lowerBlock = this.board[line-1][col];
				if (lowerBlock != null){
					isEqual = block.compareType(lowerBlock);
				}
			}
			break;

		case "left":
			if (col > 0){
				var leftBlock = this.board[line][col-1];
				if (leftBlock != null){
					isEqual = block.compareType(leftBlock);
				}
			}
			break;

		case "right":
			if (col < this.width - 1){
				var rightBlock = this.board[line][col+1];
				if (rightBlock != null){
					isEqual = block.compareType(rightBlock);
				}
			}
			break;
	}
	return isEqual;
};

/** Generate empty board */
Board.prototype.generateEmpty = function(width, height){
	for (var h = 0; h < this.height; h++){
		var line = [];
		for (var w = 0; w < this.width; w++){
			line.push(null);
		}
		this.board.push(line);
	}
};

/** Generates a board with blocks */
Board.prototype.generate = function(){

	this.generateEmpty();

	// Leave top-line empty
	for (var line = 0; line < this.height - 1; line++){
		for (var col = 0; col < this.width; col++){
			if (this.isBlockUnderneath(line, col)){
				var block = this.generateBlock(line);
				if (block != null){
					this.board[line][col] = block;
					//this.setCorrectType(line, col);
				}
			}
		}
	}
};

/** Sets block correct type to avoid combos on generation */
Board.prototype.setCorrectType = function(line, col){

	var forbiddenTypes = [];

	if (this.isComboLeft(line,col)){
		forbiddenTypes.push(this.board[line][col-1].getType());
	}
	if (this.isComboDown(line,col)){
		forbiddenTypes.push(this.board[line-1][col].getType());
	}
	if (forbiddenTypes.length > 0){
		var block = this.board[line][col];
		block.setDistinctRandomType(forbiddenTypes);
	}
};

/** Returns true if there are 3 horizontal blocks with same type */
Board.prototype.isComboLeft = function(line, col){
	if (col == 0) return false;

	var block = this.board[line][col];
	var count = 1;

	// Iterate blocks on left side
	for(var w = col - 1; w >= 0; w--){

		var leftBlock = this.board[line][w];

		if (leftBlock == null)
			return false;

		if (leftBlock.compareType(block)){
			count++;
			if (count > 2){
				console.log("left combo on " + line + " " + col);
				return true;
			} else {
				continue;
			}
		} else {
			return false;
		}
	}
	return false;
};

/** Returns true if there are 3 vertical blocks with same type */
Board.prototype.isComboDown = function(line, col){
	if (line == 0) return false;

	var block = this.board[line][col];
	var count = 1;

	// Iterate blocks on left side
	for(var h = line - 1; h >= 0; h--){
		var lowerBlock = this.board[h][col];
		if (lowerBlock.compareType(block)){
			count++;
			if (count > 2){
				console.log("down combo on " + line + " " + col);
				return true;
			} else {
				continue;
			}
		} else {
			return false;
		}
	}
	return false;
};

/** Generate Blocks */
Board.prototype.generateBlock = function(line){

	// Empty block probability: increases linearly with height
	// Height 0 => probability 0
	// Height maxHeight + 1 => probability 1
	var emptyBlockProb = line / (2*this.height);

	if (Math.random() > emptyBlockProb)
		return new Block();
	else
		return null;
};

/** Returns true if there is a block underneath
	True for all the columns of the the board's first line */
Board.prototype.isBlockUnderneath = function(line, col){
	if (line == 0) return true;
	return this.board[(line-1)][col] != null;
};

Board.prototype.isLeftEmpty = function(line, col){
	if (line == 0 || this.board[(line-1)][col] == null) 
		return true;
	else
		return false;
};

/** Returns the next available position (line) underneath 
	given the block coordinates */
Board.prototype.nextAvailableLine = function(line, col){
	for (var l = line; l >= 0; l--){
		if (this.isBlockUnderneath(l, col)) 
			return l;
	}
};