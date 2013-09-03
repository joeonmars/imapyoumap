goog.provide('imym.models.modes.PanMode');

goog.require('goog.events');
goog.require('imym.models.modes.Mode');

/**
 * @constructor
 */
imym.models.modes.PanMode = function(){
  goog.base(this, [goog.events.KeyCodes.SPACE]);

};
goog.inherits(imym.models.modes.PanMode, imym.models.modes.Mode);


imym.models.modes.PanMode.prototype.activate = function(){
	goog.base(this, 'activate');
};


imym.models.modes.PanMode.prototype.deactivate = function(){
	goog.base(this, 'deactivate');
};