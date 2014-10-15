/**
 * Ai Class
 * Requires: Board, Block (types)
 *
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */
 function Ai(board){
 	this.board = board;
 	this.targetTypes = this.filterTypes();

 	//this.getPoints();
 }

/** Returns the number of points */
 Ai.prototype.getPoints = function(){
 	for(var i = 0; i < this.targetTypes.length; i++){
 		console.log(this.targetTypes[i] + ": " + this.getLinePoints(this.targetTypes[i]) + " " + this.getColPoints(this.targetTypes[i]));
 	}
 };

/** Return line points given a type */
 Ai.prototype.getLinePoints = function(type){
 	var points = 0;
 	for (var line = 0; line < this.board.getHeight(); line++){
 		if (this.board.hasBlockInLine(type, line)){
 			var count = this.board.countBlocksInLine(type, line);
 			if (count > 2) points += count;
 		}
 	}
 	return points;
 };

 /** Return col points given a type */
 Ai.prototype.getColPoints = function(type){
 	var points = 0;
 	for (var col = 0; col < this.board.getWidth(); col++){
 		if (this.board.hasBlockInCol(type, col)){
 			var count = this.board.countBlocksInCol(type, col);
 			if (count > 2) points += count;
 		}
 	}
 	return points;
 };

/** Filters the block types that can match on the board */
 Ai.prototype.filterTypes = function(){

 	var targetTypes = [];

 	for(var i = 0; i < types.length; i++){
 		if (this.board.countBlocks(types[i]) > 2){
 			targetTypes.push(types[i]);
 		}
 	}
 	return targetTypes;
 };