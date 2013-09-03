goog.provide('imym.controllers.KeyController');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.events.KeyHandler');

/**
 * @constructor
 */
imym.controllers.KeyController = function(){
  goog.base(this);

  // dispatchers that listen for navigate event
  this._dispatchers = [];

  this._pressedKeys = [];

  this._keyHandler = new goog.events.KeyHandler(document);
  goog.events.listen(this._keyHandler, goog.events.KeyHandler.EventType.KEY, this.onKeyDown, false, this);
  goog.events.listen(document, goog.events.EventType.KEYUP, this.onKeyUp, false, this);
};
goog.inherits(imym.controllers.KeyController, goog.events.EventTarget);
goog.addSingletonGetter(imym.controllers.KeyController);


imym.controllers.KeyController.prototype.addDispatcher = function(dispatcher) {
	if(!goog.array.contains(this._dispatchers, dispatcher)) {
		this._dispatchers.push(dispatcher);
	}
};


imym.controllers.KeyController.prototype.removeDispatcher = function(dispatcher) {
	if(goog.array.contains(this._dispatchers, dispatcher)) {
		goog.array.remove(this._dispatchers, dispatcher);
	}
};


imym.controllers.KeyController.prototype.onKeyDown = function(e){
  e.preventDefault();
  
  if(e.repeat) return false;

  if(!goog.array.contains(this._pressedKeys, e.keyCode)) {
  	this._pressedKeys.push(e.keyCode);

  	var ev = {
  		type: imym.controllers.KeyController.prototype.EventType.KEYDOWN,
  		keyCode: e.keyCode,
  		pressedKeys: this._pressedKeys
  	};

	  goog.array.forEach(this._dispatchers, function(dispatcher) {
			dispatcher.dispatchEvent(ev);
		});
  }
};


imym.controllers.KeyController.prototype.onKeyUp = function(e){
	e.preventDefault();

	goog.array.remove(this._pressedKeys, e.keyCode);

	var ev = {
		type: imym.controllers.KeyController.prototype.EventType.KEYUP,
		keyCode: e.keyCode,
		pressedKeys: this._pressedKeys
	};

  goog.array.forEach(this._dispatchers, function(dispatcher) {
		dispatcher.dispatchEvent(ev);
	});
};


imym.controllers.KeyController.prototype.EventType = {
	KEYDOWN: 'keydown',
	KEYUP: 'keyup'
};