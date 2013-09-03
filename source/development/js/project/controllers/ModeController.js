goog.provide('imym.controllers.ModeController');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('imym.models.modes.ClickDragMode');
goog.require('imym.models.modes.IdleMode');
goog.require('imym.models.modes.PanMode');

/**
 * @constructor
 */
imym.controllers.ModeController = function(){
  goog.base(this);

  // dispatchers that listen for navigate event
  this._dispatchers = [];

  this.modes = null;
  this.currentMode = null;
};
goog.inherits(imym.controllers.ModeController, goog.events.EventTarget);
goog.addSingletonGetter(imym.controllers.ModeController);


imym.controllers.ModeController.prototype.init = function() {
  goog.events.listen(this, imym.models.modes.Mode.prototype.EventType.ACTIVATE, this.onModeActivate, false, this);
  goog.events.listen(this, imym.models.modes.Mode.prototype.EventType.DEACTIVATE, this.onModeDeactivate, false, this);

	this.modes = {
		idleMode: new imym.models.modes.IdleMode,
		panMode: new imym.models.modes.PanMode,
		clickDragMode: new imym.models.modes.ClickDragMode
	};

	this.modes.idleMode.activate();
};


imym.controllers.ModeController.prototype.addDispatcher = function(dispatcher) {
	if(!goog.array.contains(this._dispatchers, dispatcher)) {
		this._dispatchers.push(dispatcher);
	}
};


imym.controllers.ModeController.prototype.removeDispatcher = function(dispatcher) {
	if(goog.array.contains(this._dispatchers, dispatcher)) {
		goog.array.remove(this._dispatchers, dispatcher);
	}
};


imym.controllers.ModeController.prototype.onModeActivate = function(e){
	this.currentMode = e.target;

	var ev = {
		type: e.type,
		mode: e.target
	};

	goog.array.forEach(this._dispatchers, function(dispatcher) {
		dispatcher.dispatchEvent(ev);
	});
};


imym.controllers.ModeController.prototype.onModeDeactivate = function(e){
	this.currentMode = null;

	var ev = {
		type: e.type,
		mode: e.target
	};

	goog.array.forEach(this._dispatchers, function(dispatcher) {
		dispatcher.dispatchEvent(ev);
	});
};