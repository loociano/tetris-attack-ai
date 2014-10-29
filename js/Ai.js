/**
 * Ai Class
 * Requires: Board, Block (types)
 *
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */
 function Ai(board, input){
 	this.board = board;
 	this.input = input;
 	this.paceMillis = 1000;

 	/** Discard any type of block that can't make a combo */
 	this.targetTypes = this.filterTypes();

 	this.getPoints();

 
 	var parent = this

 	this.id = window.setInterval(function(){
 		
 		var dice = Math.random();
 		if (dice < 0.25){
 			parent.input.up();	
 		} else {
 			if (dice < 0.5){
 				parent.input.down();
 			} else {
 				if (dice < 0.75){
 					parent.input.left();
 				} else {
 					parent.input.right();
 				}
 			}
 		}

 		if (dice < 0.5){
 			parent.input.swap();
 		}
 		
 	}, this.paceMillis);
 }

/** Returns the number of points */
 Ai.prototype.getPoints = function(){

 	var p = this;

 	this.targetTypes.forEach(function(e){
 		console.log("["+ e + "] line: " + p.getLinePoints(e) + " col: "+  p.getColPoints(e));
 	});
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