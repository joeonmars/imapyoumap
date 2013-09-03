goog.provide('imym.views.playgroundtools.Tool');

goog.require('goog.events.EventTarget');
goog.require('goog.events');

/**
 * @constructor
 */
imym.views.playgroundtools.Tool = function(playground, mode){
  goog.base(this);

  this.setParentEventTarget(playground);

  this.mode = mode;

  var modeController = imym.main.controllers.modeController;
  modeController.addDispatcher(this);
  goog.events.listen(this, imym.models.modes.Mode.prototype.EventType.ACTIVATE, this.onActivate, false, this);
  goog.events.listen(this, imym.models.modes.Mode.prototype.EventType.DEACTIVATE, this.onDeactivate, false, this);

  this._isActivated = false;
};
goog.inherits(imym.views.playgroundtools.Tool, goog.events.EventTarget);


imym.views.playgroundtools.Tool.prototype.activate = function(){
  console.log('Mode activated: ', this);
};


imym.views.playgroundtools.Tool.prototype.deactivate = function(){
  console.log('Mode deactivated: ', this);
};


imym.views.playgroundtools.Tool.prototype.onActivate = function(e){
  if(this.mode !== e.mode) return;

  if(!this._isActivated) {
    this._isActivated = true;
    this.activate();
  }else {
    return;
  }
};


imym.views.playgroundtools.Tool.prototype.onDeactivate = function(e){
  if(this.mode !== e.mode) return;
  
  if(this._isActivated) {
    this._isActivated = false;
    this.deactivate();
  }else {
    return;
  }
};