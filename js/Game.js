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

 	this.renderer.refresh();

 	this.board.searchCombos();

 	var parent = this;
 	window.setTimeout(function(){parent.renderer.refresh()}, 500);
 };