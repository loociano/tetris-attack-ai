/** 
 * Board Class
 * Requires: Block
 * 
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */

/** Constructor */
function Board(width, height){
	(width == undefined) ? this.width = 6 : this.width = width;
	(height == undefined) ? this.height = 8 : this.height = height;

	this.board = [];
	this.generate();
	
	this.renderBoard();
	this.combineBlockLines();
}

/** Looks for a line of 3 or more contiguous blocks */
// Better algorithm: search by line and column
Board.prototype.combineBlockLines = function(){
	for (var line = 0; line < this.height; line++){
		for (var col = 0; col < this.width; col++ ){
			var block = this.board[line][col];
			if (block != null){
				// Look up, down, left, right
				var direction = ["up", "down", "left", "right"];
				for (var i = 0; i < direction.length; i++){
					if (this.isNextBlockEqual(line, col, direction[i])){
						// TODO. Keep searching and combine combo
					}
				}
			}
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

	for (var line = 0; line < this.height; line++){
		for (var col = 0; col < this.width; col++ ){
			if (this.isBlockUnderneath(line, col)){
				this.board[line][col] = this.generateBlock(line);
				if (this.isComboLeft(line,col) || this.isComboDown(line,col)){
					var block = this.board[line][col];
					block.setDistinctRandomType();  
				}
			}
		}
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
				break;
			} else {
				continue;
			}
		} else {
			return false;
		}
	}
	return true;
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
				break;
			} else {
				continue;
			}
		} else {
			return false;
		}
	}
	return true;
};

/** Prints board on console */
Board.prototype.printConsoleBoard = function(){
	for (var line = 0; line < this.height; line++){
		var textLine = "";
		for (var col = 0; col < this.width; col++ ){
			textLine += " " + this.blockToString(this.board[this.height-line-1][col]) + " ";
		}
		console.log(textLine);
	}
};

/** Renders board on HTML */
Board.prototype.renderBoard = function(){

	var body = document.body;

	for (var line = this.height - 1; line >= 0; line--){
		var lineElt = document.createElement("div");
		lineElt.className = "line";
		for (var col = 0; col < this.width; col++ ){
			
			var block = this.board[line][col];
			var blockElt = document.createElement("div");
			var classNames = "square";
			
			if (col == 0) classNames += " first-line-block";
			if (block != null) classNames += " block " + block.getType();
			
			blockElt.className = classNames;
			lineElt.appendChild(blockElt);
		}
		body.appendChild(lineElt);
	}
};

/** Returns block to string */
Board.prototype.blockToString = function(Block){
	if (Block == null) 
		return "[-]";
	else
		return Block.toString();
}

/** Generate Blocks */
Board.prototype.generateBlock = function(line){

	// Empty block probability: increases linearly with height
	// Height 0 => probability 0
	// Height maxHeight + 1 => probability 1
	this.emptyBlockProb = line / (2*this.height);

	if (Math.random() > this.emptyBlockProb)
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