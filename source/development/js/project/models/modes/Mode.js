goog.provide('imym.models.modes.Mode');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('imym.controllers.KeyController');

/**
 * @constructor
 */
imym.models.modes.Mode = function(shortcut){
  goog.base(this);

  this.setParentEventTarget(imym.main.controllers.modeController);

  this._shortcut = shortcut;

  var keyController = imym.controllers.KeyController.getInstance();
  keyController.addDispatcher(this);
  goog.events.listen(this, imym.controllers.KeyController.prototype.EventType.KEYDOWN, this.onKeyDown, false, this);
  goog.events.listen(this, imym.controllers.KeyController.prototype.EventType.KEYUP, this.onKeyUp, false, this);
};
goog.inherits(imym.models.modes.Mode, goog.events.EventTarget);


imym.models.modes.Mode.prototype.activate = function(){
	this.dispatchEvent({
		type: imym.models.modes.Mode.prototype.EventType.ACTIVATE
	});
};


imym.models.modes.Mode.prototype.deactivate = function(){
	this.dispatchEvent({
		type: imym.models.modes.Mode.prototype.EventType.DEACTIVATE
	});
};


imym.models.modes.Mode.prototype.matchShortCut = function(keysA, keysB){
	var result = goog.array.equals(keysA, keysB, function(a, b) {
		return goog.array.contains(keysB, a);
	}) && (keysA.length === keysB.length);

	return result;
};


imym.models.modes.Mode.prototype.handleKeyEvent = function(e){
	var matchShortCutResult = this.matchShortCut(e.pressedKeys, this._shortcut);

	if(matchShortCutResult === true) {
		this.activate();
	}else {
		this.deactivate();
	}
};


imym.models.modes.Mode.prototype.onKeyDown = function(e){
	this.handleKeyEvent(e);
};


imym.models.modes.Mode.prototype.onKeyUp = function(e){
	this.handleKeyEvent(e);
};


imym.models.modes.Mode.prototype.EventType = {
	ACTIVATE: 'activate',
	DEACTIVATE: 'deactivate'
};