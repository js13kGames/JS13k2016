import Widget from './widget.js';

'use strict';

function Revealer(x,y,p,f,col,id) {
	var that = new Widget(x,y,p,f,id);

	that.toggle = false;
	that.w = 200;
	that.h = 100; 
	that.col = col;

	that.dr = function(c, w, h, ox, oy) {
		c.beginPath();
		c.rect(that.x + ox, that.y + oy, w, h);
		c.fillStyle = '#999999';
		c.fill();
		c.lineWidth = 4;
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

	that.rect = function(c) {
		c.globalAlpha = 0.5;
		c.beginPath();
		c.fillStyle = that.col;
		c.fillRect(that.x, that.y, that.w, that.h);
		c.globalAlpha = 1.0;
    };

	that.r = function(c) {
		
		//that.dr(c, 65, 77, 0, 0);
		that.rect(c);
		that.roundRect(c, that.x, that.y, 200, 100, 5, null, 'red');

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

	/* Courtesy of stack overflow - slightly modified */
	/* https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas */
	that.roundRect = function(ctx, x, y, width, height, radius) {		
		if (typeof radius === 'undefined') {
			radius = 5;
		}
		if (typeof radius === 'number') {
			radius = {tl: radius, tr: radius, br: radius, bl: radius};
		} else {
			var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
			for (var side in defaultRadius) {
			radius[side] = radius[side] || defaultRadius[side];
			}
		}
		ctx.beginPath();
		
		ctx.moveTo(x + radius.tl, y);
		ctx.lineTo(x + width - radius.tr, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
		ctx.lineTo(x + width, y + height - radius.br);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
		ctx.lineTo(x + radius.bl, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
		ctx.lineTo(x, y + radius.tl);
		ctx.quadraticCurveTo(x, y, x + radius.tl, y);
		ctx.closePath();
		
		ctx.lineWidth = 10;
		ctx.strokeStyle = '#000';
		ctx.stroke();
	};

	return that;
};

export default Revealer;