import Widget from './classes/widget.js';
import IceCreamMaker from './classes/icecreammaker.js';
import Revealer from './classes/revealer.js';
import Dialog from './classes/dialog.js';
import Button from './classes/button.js';

(function() {
  'use strict';

  var game = null;

  var Game = function() {
    var self = this;

    this.STATE = Game.STATES.MOVE;
    
    var canvas = document.querySelector('#g');
    this.ctx = canvas.getContext('2d');     

    this.canvas = canvas;

    // Don't you dare AntiAlias the pixelart!
    //this.ctx.imageSmoothingEnabled = this.ctx.mozImageSmoothingEnabled = this.ctx.oImageSmoothingEnabled = false;

    this.gameSize = { 'w': canvas.width, 'h': canvas.height };
    
    this.widgets = [];
    this.currentWidget = null;

    this.dialogs = [];
    this.buttons = [];
    this.connections = {};
    this.activeConnection = null;

    this.init();

    this.idCounter = 0;

    var getMousePos = function(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    };

    canvas.addEventListener('click', function(evt){
      var m = getMousePos(canvas, evt);
      for(var i = 0; i < self.dialogs.length; i++) {
        if(self.dialogs[i].isClicked(m)){
          break;
        }
      }            

      if(self.STATE === Game.STATES.CONNECT) {
        // check all the widgets
        for(var i = 0; i < self.widgets.length; i++) {
          if(self.widgets[i].isClicked2(m) && self.widgets[i].canConnect){

            var c = {
              'x1': self.widgets[i].getCenterX(),
              'y1': self.widgets[i].getCenterY(),
              'x2': m.x,
              'y2': m.y,
              'active': true,
              'id': self.idCounter,
              'wid': self.widgets[i].id
            };

            self.idCounter++;

            self.connections[c.id] = c;
            self.activeConnection = c;
            self.STATE = Game.STATES.CONNECT1;

            self.widgets[i].addConnection(c.id, true);
            return;
          }
        }
      }

      if(self.STATE === Game.STATES.CONNECT1) {
        if(self.activeConnection !== null) {
          for(var i = 0; i < self.widgets.length; i++) {
            if(self.widgets[i].isClicked2(m) && self.widgets[i].id !== self.activeConnection.wid && self.widgets[i].canConnect){

              self.STATE = Game.STATES.CONNECT;
              

              self.connections[self.activeConnection.id].active = null;
              self.widgets[i].addConnection(self.activeConnection.id, false);

              self.activeConnection = null;
              return;
            }
          }
        }
      }

      if(self.STATE === Game.STATES.CUT) {
        // check all connections
      } 

      for(var i = 0; i < self.buttons.length; i++) {
        if(self.buttons[i].isClicked(m)){
          var v = self.buttons[i].v;

          for(var j = 0; j < self.buttons.length; j++) {
            self.buttons[j].deselect(v);
          }

          self.STATE = Game.STATES[v];
          self.switchState();
          break;
        }
      }

    });

    canvas.addEventListener('mouseup', function(evt){

      if(self.STATE !== Game.STATES.MOVE) {
        return;
      }

      if(self.currentWidget !== null) {
        self.currentWidget.dropped();
        self.currentWidget = null;
        canvas.style.cursor = 'auto';
      }
    });

    canvas.addEventListener('mousedown', function(evt){

      if(self.STATE === Game.STATES.MOVE) {
        if(self.currentWidget !== null) {
          self.currentWidget.dropped();
          self.currentWidget = null;
          canvas.style.cursor = 'auto';
        }

        var m = getMousePos(canvas, evt);

        for(var i = 0; i < self.widgets.length; i++) {
          if(self.widgets[i].isClicked(m)){
            self.currentWidget = self.widgets[i];
            canvas.style.cursor = 'pointer';
            break;
          }
        }
      }
    });

    canvas.addEventListener('mousemove', function(evt){

      if(self.STATE === Game.STATES.MOVE) {
        if(self.currentWidget !== null) {
          self.currentWidget.d(getMousePos(canvas, evt));
        } else {
          canvas.style.cursor = 'auto';
          var m = getMousePos(canvas, evt);
          for(var i = 0; i < self.widgets.length; i++) {
            if(self.widgets[i].isOver(m)){
              canvas.style.cursor = 'move';
              break;
            }
          }
        
        }
      }
      if(self.STATE === Game.STATES.CONNECT || self.STATE === Game.STATES.CONNECT1) {
        if(self.activeConnection !== null) {
          var m = getMousePos(canvas, evt);
          self.activeConnection.x2 = m.x;
          self.activeConnection.y2 = m.y;
        }
      }
    });

    var SKIPTICKS = 1000 / 60; // frame rate, 60FPS

    var tick = function() {
      // draw the next frame
      self.render();
      requestAnimationFrame(tick);
    };

    // start the animation loop
    tick();

    var gameStep = function() {
      self.update();
      setTimeout( gameStep, SKIPTICKS ); // process the game logic at a target 60 FPS.
    }
    // start the game loop
    gameStep();
  };

  Game.STATES = {
    'MOVE': 0,
    'CONNECT': 1,
    'CONNECT1': 2,
    'CUT': 3
  };

  Game.prototype = {
    init: function() {
      this.widgets.push(new Widget(100, 100, this, true,1));

      this.widgets.push(new Widget(400, 400, this, true, 2));

      this.widgets.push(new Widget(700, 550, this, true, 7));

      this.widgets.push(new IceCreamMaker(600, 400, this, false, 3));

      this.widgets.push(new Revealer(1000, 550, this, true, 'green', 4));
      this.widgets.push(new Revealer(1100, 600, this, true, 'red', 5));

      this.buttons.push(new Button(0,250, this, 100, 60, 'Move', 'MOVE'));
      this.buttons.push(new Button(0,320, this, 100, 60, 'Connect', 'CONNECT'));
      this.buttons.push(new Button(0,390, this, 100, 60, 'Cut', 'CUT'));

      this.buttons[0].isToggled = true;

      this.widgets[0].canConnect = true;
      this.widgets[1].canConnect = true;
      this.widgets[2].canConnect = true;

      this.dialogs.push(new Dialog(200, 200, this, 1100, 400));
    },
    render: function() {
      this.ctx.clearRect(0, 0, this.gameSize.w, this.gameSize.h);

      var my_gradient = this.ctx.createLinearGradient(0,0,0,768);
      my_gradient.addColorStop(0,'#5cbcfc');
      my_gradient.addColorStop(1,'#048ae3');
      this.ctx.fillStyle = my_gradient;
      this.ctx.fillRect(0,0,1366,768);

      var keys = Object.keys(this.connections);
      for(var i = 0; i < keys.length; i++) {
        var l = this.connections[keys[i]];

        this.ctx.beginPath();
        this.ctx.strokeStyle = 'yellow';
        this.ctx.lineWidth = 2;
        this.ctx.moveTo( l.x1, l.y1 );
        this.ctx.lineTo( l.x2, l.y2 );
        this.ctx.stroke();
      }

      for(var i = 0; i < this.widgets.length; i++) {
        this.widgets[i].r(this.ctx);
      }

      for(var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].r(this.ctx);
      }

      for(var i = 0; i < this.dialogs.length; i++) {
        this.dialogs[i].r(this.ctx);
      }

    },
    update: function() {
      for(var i = 0; i < this.widgets.length; i++) {
        this.widgets[i].u();
      }
    },
    switchState: function() {

      this.activeConnection = null;

      switch(this.STATE) {
        case Game.STATES.MOVE:
          this.canvas.style.cursor = 'auto';
        break;
        case Game.STATES.CUT:
          this.canvas.style.cursor = 'no-drop';
        break;
        case Game.STATES.CONNECT:
        case Game.STATES.CONNECT1:
          this.canvas.style.cursor = 'crosshair';
        break;

      }
    }
  };

  // start game when page has finished loading
  window.addEventListener('load', function() {
    game = new Game();
  });
})();
