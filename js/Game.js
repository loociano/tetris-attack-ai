/** 
 * Game Class
 * Requires: Board
 * 
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */
 function Game(){
 	this.board = new Board(20,10);
 	this.ai = new Ai(this.board);
 	this.cursor = new Cursor(this.board);
 }