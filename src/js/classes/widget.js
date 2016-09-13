'use strict';

function Widget(x,y,p,f,id) {     
    this.p = p;
	this.x = x;
	this.y = y;
	this.draggable = f;
	this.w = 64;
	this.h = 64;

	this.px = 0;
	this.py = 0;

	this.dragged = false;
	this.id = id;
	this.canConnect = false;
	this.connections = [];
};

Widget.prototype = {
    r: function(c) {
		c.beginPath();
		c.fillStyle = 'red';
		c.fillRect(this.x, this.y, this.w, this.h);
    },
	u: function() {

	},
    d: function(m) {
		if(this.dragged) {
			
			var nx = m.x - this.px;
			var ny = m.y - this.py;

			if(nx < 0 || nx + this.w > 1366) {
				return;
			}

			if(ny < 0 || ny + this.h > 768) {
				return;
			}

			this.x = nx;
			this.y = ny;

			if(this.connections.length > 0) {
				for(var i = 0; i < this.connections.length; i++) {
					var k = this.connections[i];
					if(k.front) {
						this.p.connections[k.id].x1 = this.getCenterX();
						this.p.connections[k.id].y1 = this.getCenterY();
					} else {
						this.p.connections[k.id].x2 = this.getCenterX();
						this.p.connections[k.id].y2 = this.getCenterY();
					}
				}
			}
		}
	},
	addConnection: function(id, front) {
		this.connections.push( { 'id': id, 'front': front});
	},
	isClicked: function(m) {
		if(this.isOver(m)) {
			this.dragged = true;
			this.px = m.x - this.x;
			this.py = m.y - this.y;
			return true;
		}
		return false;
	},
	isClicked2: function(m) {
		if(this.isOver2(m)) {
			this.dragged = false;
			this.px = m.x - this.x;
			this.py = m.y - this.y;
			return true;
		}
		return false;
	},
	isOver2: function(m) {
		if(m.x > this.x && m.x < this.x + this.w &&
		   m.y > this.y && m.y < this.y + this.h
		) {
			return true;
		}
		return false;
	},
	isOver: function(m) {
		if(!this.draggable) { 
			return false; 
		}

		if(m.x > this.x && m.x < this.x + this.w &&
		   m.y > this.y && m.y < this.y + this.h
		) {
			return true;
		}
		return false;
	},
	dropped: function() {
		this.dragged = false;
	},
	getTS: function() {
		return new Date().getTime();
	},
	getCenterX: function() {
		return this.x + (this.w / 2);
	},
	getCenterY: function() {
		return this.y + (this.h / 2);
	}
};

export default Widget;