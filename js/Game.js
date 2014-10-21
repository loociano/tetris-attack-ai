/**
 * Game Class
 * Requires: Board
 *
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */
var states = ["ready", "swap", "hover"];

/** Game constructor */
 function Game(board){

 	(board == undefined) ? 
 		this.board = new Board() : 
 		this.board = new Board(board, board[0].length, board.length);

 	this.id = null;
 	this.tickMills = 50;

 	// Pixels per second. Can be decimal.
 	this.speed = 10;
 }

/** Adds points, one by default. Returns the number of points */
 Game.prototype.addPoint = function(points){
 	(points == undefined) ? this.points++ : this.points += points;
 	return this.points;
 };

 Game.prototype.isSwap = function(){
 	return this.state == "swap";
 };

 Game.prototype.swap = function(){
 	console.log("swap");
 	return this.state = "swap";
 };

 Game.prototype.hover = function(){
 	console.log("hover");
 	return this.state = "hover";
 };

 Game.prototype.isHover = function(){
 	return this.state == "hover";
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
 	this.points = 0;

 	this.ai = new Ai(this.board);
 	this.cursor = new Cursor(this.board);
 	this.renderer = new Renderer(this, this.board, this.cursor);
 	this.input = new InputListener(this, this.cursor, this.renderer);

 	this.renderer.render();

 	var parent = this;

 	this.id = window.setInterval(function(){
 		parent.board.applyGravity();
 		parent.board.searchCombos();
 		parent.renderer.refresh();
 		if (!parent.renderer.rise()){
 			parent.onGameOver();
 		}
 	}, this.tickMills);
 };

/** Game over */
 Game.prototype.onGameOver = function(){
 	window.clearInterval(this.id);
 };

/** Restarts game */
 Game.prototype.restart = function(){
 	window.clearInterval(this.id);
 	this.board = new Board();
 	this.renderer.clear();
 	this.start();
 };