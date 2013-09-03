goog.provide('imym.models.modes.ClickDragMode');

goog.require('goog.events');
goog.require('imym.models.modes.Mode');

/**
 * @constructor
 */
imym.models.modes.ClickDragMode = function(){
  goog.base(this, [goog.events.KeyCodes.SHIFT, goog.events.KeyCodes.C, goog.events.KeyCodes.D]);

};
goog.inherits(imym.models.modes.ClickDragMode, imym.models.modes.Mode);


imym.models.modes.ClickDragMode.prototype.activate = function(){
	goog.base(this, 'activate');
};


imym.models.modes.ClickDragMode.prototype.deactivate = function(){
	goog.base(this, 'deactivate');
};