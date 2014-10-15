/**
 * Cursor
 * Requires: Block
 *
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */
 function Cursor(board){

 	this.size = 2;
 	this.board = board;

 	this.x = 0;
 	this.y = 0;
 }

 Cursor.prototype.left = function(){
 	if (this.x > 0) this.x--;
 };

 Cursor.prototype.right = function(){
 	if (this.x < this.board.getWidth() - this.size) this.x++;
 };

 Cursor.prototype.down = function(){
 	if (this.y > 0) this.y--;
 };

 Cursor.prototype.down = function(){
 	if (this.y < this.board.getHeight() - 1) this.y--;
 };

/** Swap blocks horizontally */
 Cursor.prototype.swap = function(){
 	var leftBlock = this.board.getBlock(this.x, this.y);
 	var rightBlock = this.board.getBlock(this.x + 1, this.y);

 	this.board.setBlock(rightBlock, this.x, this.y);
 	this.board.setBlock(leftBlock, this.x + 1, this.y);
 };