/**
 * Game Class
 * Requires: Board
 *
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */
var states = ["ready", "swap"];

 function Game(board){

 	(board == undefined) ? 
 		this.board = new Board() : 
 		this.board = new Board(board, board[0].length, board.length);

 	this.id = null;
 	this.cursor = new Cursor(this.board);
 }

 Game.prototype.isSwap = function(){
 	return this.state == "swap";
 };

 Game.prototype.swap = function(){
 	console.log("swap");
 	return this.state = "swap";
 };

 Game.prototype.ready = function(){
 	console.log("ready");
 	return this.state = "ready";
 };

 Game.prototype.isReady = function(){
 	return this.state == "ready";
 };

/** Starts a new game */
 Game.prototype.start = function(){

 	this.state = "ready";

 	this.ai = new Ai(this.board);
 	
 	this.renderer = new Renderer(this, this.board, this.cursor);
 	this.input = new InputListener(this, this.cursor, this.renderer);

 	this.renderer.render();

 	var parent = this;

 	this.id = window.setInterval(function(){
 		parent.board.applyGravity();
 		parent.board.searchCombos();
 		parent.renderer.refresh();
 	}, 1);
 };

/** Restarts game */
 Game.prototype.restart = function(){
 	window.clearInterval(this.id);
 	this.board = new Board();
 	this.renderer.clear();
 	this.start();
 };