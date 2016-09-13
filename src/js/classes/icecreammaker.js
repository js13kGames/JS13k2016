import Widget from './widget.js';

'use strict';

function IceCreamMaker(x,y,p,f,id) {
	var that = new Widget(x,y,p,f,id);

	that.toggle = false;
	that.ts = that.getTS();
	that.ics = [{ x: -22 }, { x: -8 }, { x: 6 }, { x: 20 }, { x: 34 }];

	that.dr = function(c, w, h, ox, oy) {
		c.beginPath();
		c.rect(that.x + ox, that.y + oy, w, h);
		c.fillStyle = '#999999';
		c.fill();
		c.lineWidth = 1.5;
		c.strokeStyle = '#787878';
		c.stroke();
	};

	that.c = function(c, ox, oy, r, col) {
		c.beginPath();
		c.arc(that.x + ox, that.y + oy, r, 0, 2 * Math.PI);
		c.fillStyle = col;
		c.fill();
	};

	that.fc = function(c, ox, oy, r, col, col2) {
		c.beginPath();
		c.arc(that.x + ox, that.y + oy, r, 0, 2 * Math.PI);
		c.fillStyle = col;
		c.fill();
		c.lineWidth = 1.5;
		c.strokeStyle = col2;
		c.stroke();
	};

	that.r = function(c) {
		that.b(c);
		that.dr(c, 65, 77, 0, 0);
		for(var i = 0; i < that.ics.length; i++) {
			that.ic(c, that.x, that.ics[i].x);
		}
		that.dr(c, 65, 150, -40, -73);

		if(that.toggle) {
			that.c(c, -15, -40, 3, '#ff0000');
		} else {
			that.c(c, -5, -40, 3, '#00ff00');
		}

				
	};

	// da bear
	that.b = function(c) {
		// ears
		that.fc(c, 90, -50, 9, '#c87137', '#a05a2c');
		that.fc(c, 55, -53, 9, '#c87137', '#a05a2c');

		// tail
		that.fc(c, 105, 60, 6, '#c87137', '#a05a2c');

		// body
		that.fc(c, 70, 25, 50, '#c87137', '#a05a2c');

		//head
		that.fc(c, 70, -25, 29, '#c87137', '#a05a2c');

		// mouth
		that.c(c, 70, -15, 14, '#000');

		// eyes
		that.c(c, 75, -37, 3, '#000');
		that.c(c, 65, -40, 3, '#000');

		// nose
		that.c(c, 52, -35, 5, '#000');
		
	};

	that.u = function() {
		var now = that.getTS();
		if(that.ts + 600 < now) {
			that.ts = that.getTS();
			that.toggle = !that.toggle;

			for(var i = 0; i < that.ics.length; i++) {
				that.ics[i].x += 4;

				if(that.ics[i].x > 62) {
					that.ics[i].x = -8;
				}
			}
		}
	};

	that.p = [ 0,0, 12,0, 8,15, 4,15 ];

	that.ic = function(c, x, xo) {
		var y = that.y - 15;
		
		that.c(c, xo, -19, 6, '#ffffff');

		var poly = that.p;
		c.beginPath();
		c.fillStyle = '#deaa87';
		c.moveTo(poly[0] + x + xo - 6, poly[1] + y);
		for(var item = 2; item < poly.length-1 ; item += 2) {
			c.lineTo(poly[item] + x + xo - 6, poly[item+1] + y);
		}
		c.closePath();
		c.fill();		
	};

	return that;
};

export default IceCreamMaker;