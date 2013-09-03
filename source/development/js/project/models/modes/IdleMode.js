goog.provide('imym.models.modes.IdleMode');

goog.require('goog.events');
goog.require('imym.models.modes.Mode');

/**
 * @constructor
 */
imym.models.modes.IdleMode = function(){
  goog.base(this, []);

};
goog.inherits(imym.models.modes.IdleMode, imym.models.modes.Mode);


imym.models.modes.IdleMode.prototype.activate = function(){
	goog.base(this, 'activate');
};


imym.models.modes.IdleMode.prototype.deactivate = function(){
	goog.base(this, 'deactivate');
};