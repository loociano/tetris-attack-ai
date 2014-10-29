function UI(){
	
	this.body = document.body;
	this.ui = null;
	this.create();
}

UI.prototype = {

	create: function(){
		
		this.body.className = "ui";
	
		this.ui = document.createElement("div");
		this.ui.id = "ui";
		
		var title = document.createElement("h1");
		title.innerText = "Tetris Attack JS";
		
		var list = document.createElement("ul");
		list.id = "menu";

		var onep = document.createElement("li");
		onep.className = "active";
		onep.innerText = "One Player";

		var twop = document.createElement("li");
		twop.innerText = "Two Players";

		var vscom = document.createElement("li");
		vscom.innerText = "1P VS COM";

		var howto = document.createElement("li");
		howto.innerText = "How to Play";

		var credits = document.createElement("li");
		credits.innerText = "Credits";

		list.appendChild(onep);
		list.appendChild(twop);
		list.appendChild(vscom);
		list.appendChild(howto);
		list.appendChild(credits);

		this.ui.appendChild(title);
		this.ui.appendChild(list);

		this.body.appendChild(this.ui);
	},

	remove: function(){
		this.body.className = "";
		this.ui.remove();
	}
}