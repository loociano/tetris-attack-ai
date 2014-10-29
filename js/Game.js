/**
 * Game Class
 * Requires: Board
 *
 * Luciano Rubio <luciano@loociano.com>
 * Oct 2014
 */
var states = ["ready", "swap", "hover", "combo", "gameover"];

/** Game constructor */
 function Game(app, player, speed){

 	this.app = app;

 	this.player = player;

 	// Pixels per second. Can be decimal.
 	this.speed = speed;

 	this.start();
 }

 /** Starts a new game */
 Game.prototype.start = function(){

 	this.points = 0;
 	this.ready();

 	this.board = new Board(this.player);
 	this.cursor = new Cursor(this.board);
 	this.renderer = new Renderer(this, this.board, this.cursor);
 	this.input = new InputListener(this.app, this, this.cursor, this.renderer);
 	
 	if (this.player == "p1" || this.player == "p2"){
 		this.input.keyListen();
 	} else {
 		this.ai = new Ai(this.board, this.input);
 	}

 	this.renderer.render();
 };

/** Game update. Called each cycle from the app */
 Game.prototype.update = function(){
	this.board.applyGravity();
	this.board.searchCombos();
	this.renderer.refresh();

	if (!this.renderer.rise()){
		this.onGameOver();
	}
 };

/** Adds points, one by default. Returns the number of points */
 Game.prototype.addPoint = function(points){
 	(points == undefined) ? this.points++ : this.points += points;
 	return this.points;
 };

 Game.prototype.getPlayer = function(){
 	return this.player;
 };

 Game.prototype.setGameOver = function(){
 	console.log(this.player + " gameover");
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
 	console.log(this.player + " swap");
 	this.state = "swap";
 };

 /** Returns true if game is in combo */
 Game.prototype.isCombo = function(){
 	return this.state == "combo";
 };

/** Sets game to combo */
 Game.prototype.combo = function(){
 	console.log(this.player + " combo");
 	this.state = "combo";
 };

/** Sets game state to hover */
 Game.prototype.hover = function(){
 	console.log(this.player + " hover");
 	return this.state = "hover";
 };

/** Returns true if game is in hover */
 Game.prototype.isHover = function(){
 	return this.state == "hover";
 };

/** Sets game ready */
 Game.prototype.ready = function(){
 	if (!this.isGameOver()){
 		console.log(this.player + " ready");
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
 	this.setGameOver();
 	this.app.onGameOver();
 	this.renderer.renderGameOver();
 };