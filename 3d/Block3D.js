/** Constructor */
function Block3D(line, col, colour){

	this.size = 58;
	this.offsetX = col * this.size;
	this.offsetY = line * this.size;

	this.cubeElt = document.createElement("div");
	this.cubeElt.className = "cube";
	
	this.frElt = document.createElement("figure");
	this.frElt.className = "front " + colour;
	this.moveZ(this.frElt, this.size/2);
	this.moveX(this.frElt, this.offsetX);
	this.moveY(this.frElt, this.offsetY);

	this.bkElt = document.createElement("figure");
	this.bkElt.className = "back " + colour;
	this.rotateX(this.bkElt, -180);
	this.moveZ(this.bkElt, this.size/2);
	this.moveX(this.bkElt, this.offsetX);
	this.moveY(this.bkElt, -this.offsetY);

	this.rgElt = document.createElement("figure");
	this.rgElt.className = "right " + colour;
	this.rotateY(this.rgElt, 90);
	this.moveZ(this.rgElt, this.offsetX + this.size/2);
	this.moveY(this.rgElt, this.offsetY);

	this.lfElt = document.createElement("figure");
	this.lfElt.className = "left " + colour;
	this.rotateY(this.lfElt, -90);
	this.moveZ(this.lfElt, this.size/2 - this.offsetX);
	this.moveY(this.lfElt, this.offsetY);

	this.tpElt = document.createElement("figure");
	this.tpElt.className = "top " + colour;
	this.rotateX(this.tpElt, 90);
	this.moveZ(this.tpElt, this.size/2 - this.offsetY);
	this.moveX(this.tpElt, this.offsetX);

	this.btElt = document.createElement("figure");
	this.btElt.className = "bottom " + colour;
	this.rotateX(this.btElt, -90);
	this.moveZ(this.btElt, this.offsetY + this.size/2);
	this.moveX(this.btElt, this.offsetX);

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

	moveX : function(elt, value){
		this.move(elt, "x", value);
	},

	moveY : function(elt, value){
		this.move(elt, "y", value);
	},

	moveZ : function(elt, value){
		this.move(elt, "z", value);
	},

	move : function(elt, axis, value){
		elt.style.transform += "translate"+axis.toUpperCase()+"("+value+"px)";
	},

	rotateX : function(elt, value){
		this.rotate(elt, "x", value);
	},

	rotateY : function(elt, value){
		this.rotate(elt, "y", value);
	},

	rotateZ : function(elt, value){
		this.rotate(elt, "z", value);
	},

	rotate : function(elt, axis, value){
		elt.style.transform += "rotate"+axis.toUpperCase()+"("+value+"deg)";
	}
};

