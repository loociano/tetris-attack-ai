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
 	this.cursor = new Cursor(this.board);
 	this.renderer = new Renderer(this.board);
 }

 Game.prototype.start = function(){

 	// Game loop
 	
 	// Action
 	// TODO

 	// Set Board State
 	this.board.searchCombos();

 	// Render
 	this.renderer.renderBoard();
 };