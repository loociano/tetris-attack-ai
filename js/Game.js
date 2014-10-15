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

 	this.renderer.renderBoard();

 	var parent = this;
 	window.setInterval(function(){
 		parent.board.applyGravity();
 		parent.board.searchCombos();
 		parent.renderer.refresh();
 		parent.board.explodeCombos();
 	}, 500);
 };