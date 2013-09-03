goog.provide('imym.views.playgroundtools.IdleTool');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.object');
goog.require('imym.views.playgroundtools.Tool');

/**
 * @constructor
 */
imym.views.playgroundtools.IdleTool = function(playground){
  goog.base(this, playground, imym.main.controllers.modeController.modes.idleMode);

};
goog.inherits(imym.views.playgroundtools.IdleTool, imym.views.playgroundtools.Tool);


imym.views.playgroundtools.IdleTool.prototype.activate = function(){
  goog.base(this, 'activate');

};


imym.views.playgroundtools.IdleTool.prototype.deactivate = function(){
  goog.base(this, 'deactivate');

};