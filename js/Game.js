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

 	this.id = null;
 }

/** Start game */
 Game.prototype.start = function(){

 	this.ai = new Ai(this.board);
 	this.cursor = new Cursor(this.board);
 	this.renderer = new Renderer(this.board);
 	this.input = new InputListener(this);

 	this.renderer.renderBoard();

 	var parent = this;
 	this.id = window.setInterval(function(){
 		parent.board.searchCombos();
 		parent.renderer.refresh();
 		parent.board.explodeCombos();
 	}, 500);
 };

/** Restart game */
 Game.prototype.restart = function(){
 	window.clearInterval(this.id);
 	this.board = new Board();
 	this.renderer.clear();
 	this.start();
 };