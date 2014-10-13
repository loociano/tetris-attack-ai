/** 
 * Game Class
 * Requires: Board
 * 
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */
 function Game(){
 	this.board = new Board();
 	this.ai = new Ai(this.board);
 }