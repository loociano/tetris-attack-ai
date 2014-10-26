/** Constructor */
function Block3D(line, col, colour){

	this.size = 58;
	this.offsetX = col * this.size;
	this.offsetY = line * this.size;
	this.offsetZ = this.size / 2;

	this.cubeElt = document.createElement("div");
	this.cubeElt.className = "cube";
	
	this.frElt = document.createElement("figure");
	this.frElt.className = "front " + colour;
	this.setFront(this.frElt);

	this.bkElt = document.createElement("figure");
	this.bkElt.className = "back " + colour;
	this.setBack(this.bkElt);

	this.rgElt = document.createElement("figure");
	this.rgElt.className = "right " + colour;
	this.setRight(this.rgElt);

	this.lfElt = document.createElement("figure");
	this.lfElt.className = "left " + colour;
	this.setLeft(this.lfElt);

	this.tpElt = document.createElement("figure");
	this.tpElt.className = "top " + colour;
	this.setTop(this.tpElt);

	this.btElt = document.createElement("figure");
	this.btElt.className = "bottom " + colour;
	this.setBottom(this.btElt);

	this.cubeElt.appendChild(this.frElt);
	this.cubeElt.appendChild(this.bkElt);
	this.cubeElt.appendChild(this.rgElt);
	this.cubeElt.appendChild(this.lfElt);
	this.cubeElt.appendChild(this.tpElt);
	this.cubeElt.appendChild(this.btElt);
}

Block3D.prototype = {

	/** Constructor */
	constructor: Block3D,

	/** Returns the HTML element */
	getElt : function(){
		return this.cubeElt;
	},

	setFront: function(elt){
		set3dPosition(elt, this.offsetX, this.offsetY, this.offsetZ);
	},

	setBack: function(elt){
		setBack(elt, this.offsetX, -this.offsetY, this.offsetZ);
	},

	setRight: function(elt){
		setRight(elt, "0", this.offsetY, this.offsetX + this.offsetZ);
	},

	setLeft: function(elt){
		setLeft(elt, "0", this.offsetY, -this.offsetX + this.offsetZ);
	},

	setTop: function(elt){
		setTop(elt, this.offsetX, "0", -this.offsetY + this.offsetZ);
	},

	setBottom: function(elt){
		setBottom(elt, this.offsetX, "0", this.offsetY + this.offsetZ);
	}
};