'use strict';

function Dialog(x,y,p,w,h) {     
    this.p = p;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.isOpen = true;

	this.t = [ 'BEAR-BE-GONE 2000',
		'',
		'Oh noes, our brand-new state of the art bear security system has failed overnight!',
		'There\'s a bear on the loose in our icecream factory, scoffing all the product!',
		'Find the faulty component in the security system and get rid of that greedy bear!',
		'',
		'Alas, This game could not be completed on time :-(',
		'Click to start'
	];
};

Dialog.prototype = {
    r: function(c) {
		if(!this.isOpen) {
			return;
		}
		var sw = this.p.gameSize.w;
		var sh = this.p.gameSize.h;

		c.globalAlpha = 0.25;
		c.beginPath();		
		c.fillStyle = '#000';
		c.fillRect(0, 0, sw, sh);
		c.globalAlpha = 1.0;

		c.beginPath();
		c.fillStyle = '#ccc';

		var xo = (sw - this.w) / 2;
		var yo = (sh - this.h) / 2;

		c.fillRect(xo, yo, this.w, this.h);
		this.x = xo;
		this.y = yo;

		// draw the text

		c.font = '24px Verdana';
		c.textAlign = 'center';
		c.fillStyle = '#000';

		var xm = sw / 2;
		for(var i = 0; i < this.t.length; i++) {
			c.fillText(this.t[i], xm, 260 + i * 40);
		}

    },
	isClicked: function(m) {
		if(this.isOver(m)) {
			this.isOpen = false;
			return true;
		}
		return false;
	},
	isOver: function(m) {
		if(!this.isOpen) {
			return false;
		}

		if(m.x > this.x && m.x < this.x + this.w &&
		   m.y > this.y && m.y < this.y + this.h
		) {
			return true;
		}
		return false;
	}
};

export default Dialog;