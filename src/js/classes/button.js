'use strict';

function Button(x,y,p, w, h, t, v) {     
    this.p = p;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.isToggled = false;
	this.t = t;
	this.v = v;
};

Button.prototype = {
    r: function(c) {
		c.beginPath();
		
		if(!this.isToggled) {
			c.fillStyle = '#ccc';
		} else {
			c.fillStyle = '#f00';
		}
		c.fillRect(this.x, this.y, this.w, this.h);

		// draw the text
		if(!this.isToggled) {
			c.fillStyle = '#000';
		} else {
			c.fillStyle = '#fff';
		}
		c.font = '16px Verdana';
		c.textAlign = 'center';		
		c.fillText(this.t, this.x + (this.w / 2), this.y + 33);
    },
	isClicked: function(m) {
		if(this.isOver(m)) {
			this.isToggled = !this.isToggled;
			return true;
		}
		return false;
	},
	isOver: function(m) {
		if(m.x > this.x && m.x < this.x + this.w &&
		   m.y > this.y && m.y < this.y + this.h
		) {
			return true;
		}
		return false;
	},
	deselect: function(v) {
		if(this.v !== v) {
			this.isToggled = false;
		}
	}
};

export default Button;