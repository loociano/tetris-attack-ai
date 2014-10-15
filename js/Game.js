/**
 * Game Class
 * Requires: Board
 *
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */
 function Game(board){
 	(board == undefined) ? 
 		this.board = new Board() : 
 		this.board = new Board(board, board[0].length, board.length);

 	this.ai = new Ai(this.board);
 	this.cursor = new Cursor(this.board);
 	this.renderer = new Renderer(this.board);
 }

 Game.prototype.start = function(){

 	this.renderer.refresh();

 	this.board.searchCombos();

 	var parent = this;
 	window.setTimeout(function(){
 		parent.renderer.refresh();
 	}, 500);
 };