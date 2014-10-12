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
}

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
			}
		}
	}
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
			var classNames = "block";

			blockElt.innerText = this.blockToString(block);
			
			if (block != null){
				classNames += " " + block.getType();
			}
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