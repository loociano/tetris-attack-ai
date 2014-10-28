/**
 * Game Class
 * Requires: Board
 *
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */
var states = ["ready", "swap", "hover", "combo", "gameover"];

/** Game constructor */
 function Game(){

 	this.board = new Board();
 	this.board2 = new Board();

 	this.id = null;
 	this.tickMills = 50;

 	// Pixels per second. Can be decimal.
 	this.speed = 0;
 }

 /** Starts a new game */
 Game.prototype.start = function(){

 	this.bodyElt = document.body;
	this.containerElt = document.createElement("div");
	this.containerElt.className = "container";
	this.containerElt.id = "game";
	this.bodyElt.appendChild(this.containerElt);

 	this.state = "ready";
 	this.points = 0;

 	// Player 1
 	this.cursor = new Cursor(this.board);
 	this.renderer = new Renderer(this, this.board, this.cursor);
 	this.input = new InputListener(this, this.cursor, this.renderer);
 	this.input.keyListen();

 	// Player 2
 	this.cursor2 = new Cursor(this.board2);
 	this.renderer2 = new Renderer(this, this.board2, this.cursor2);
 	this.input2 = new InputListener(this, this.cursor2, this.renderer2);
 	this.ai = new Ai(this.board2, this.input2);

 	this.renderer.render();
 	this.renderer2.render();

 	var parent = this;

 	this.id = window.setInterval(function(){
 		parent.board.applyGravity();
 		parent.board.searchCombos();
 		
		parent.board2.applyGravity();
 		parent.board2.searchCombos();
 		
 		parent.renderer.refresh();
 		parent.renderer2.refresh();
 		
 		if (!parent.renderer.rise()){
 			parent.onGameOver();
 		}
		if (!parent.renderer2.rise()){
 			parent.onGameOver();
 		}
 	}, this.tickMills);
 };

 /** Restarts game */
 Game.prototype.restart = function(){
 	console.clear();
 	window.clearInterval(this.id);
 	this.board = new Board();
 	this.board2 = new Board();
 	this.renderer.clear();
 	this.renderer2.clear();
 	this.start();
 };

/** Adds points, one by default. Returns the number of points */
 Game.prototype.addPoint = function(points){
 	(points == undefined) ? this.points++ : this.points += points;
 	return this.points;
 };

 Game.prototype.setGameOver = function(){
 	this.state = "gameover";
 };

 Game.prototype.isGameOver = function(){
 	return this.state == "gameover";
 };

/** Returns true if game is in swap */
 Game.prototype.isSwap = function(){
 	return this.state == "swap";
 };

/** Sets game to swap */
 Game.prototype.swap = function(){
 	console.log("swap");
 	this.state = "swap";
 };

 /** Returns true if game is in combo */
 Game.prototype.isCombo = function(){
 	return this.state == "combo";
 };

/** Sets game to combo */
 Game.prototype.combo = function(){
 	console.log("combo");
 	this.state = "combo";
 };

/** Sets game state to hover */
 Game.prototype.hover = function(){
 	console.log("hover");
 	return this.state = "hover";
 };

/** Returns true if game is in hover */
 Game.prototype.isHover = function(){
 	return this.state == "hover";
 };

/** Sets game ready */
 Game.prototype.ready = function(){
 	if (!this.isGameOver()){
 		console.log("ready");
 		this.state = "ready";
 	}
 };

/** Returns true if game is ready */
 Game.prototype.isReady = function(){
 	return this.state == "ready";
 };

/** Returns game state */
 Game.prototype.getState = function(){
 	return this.state;
 };

/** Game over */
 Game.prototype.onGameOver = function(){
 	window.clearInterval(this.id);
 	this.setGameOver();
 	this.renderer.renderGameOver();
 };