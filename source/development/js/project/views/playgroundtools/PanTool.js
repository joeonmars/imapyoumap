goog.provide('imym.views.playgroundtools.PanTool');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.fx.Dragger');
goog.require('goog.math.Coordinate');
goog.require('imym.utils');
goog.require('imym.views.playgroundtools.Tool');

/**
 * @constructor
 */
imym.views.playgroundtools.PanTool = function(playground, parentDom, dragDom, panDom){
  goog.base(this, playground, imym.main.controllers.modeController.modes.panMode);

  this.panDom = panDom;
  this.dragDom = dragDom;

  this.domElement = goog.dom.createDom('div', {id: 'pan-tool'});
  goog.dom.appendChild(parentDom, this.domElement);

  this.dragger = new goog.fx.Dragger(dragDom);
  this.dragger.defaultAction = this.draggerDefaultAction;

  this.panStartPosition = null;

  this.grabCursor = imym.utils.grabCursor(dragDom);
};
goog.inherits(imym.views.playgroundtools.PanTool, imym.views.playgroundtools.Tool);


imym.views.playgroundtools.PanTool.prototype.draggerDefaultAction = function(x, y){
};


imym.views.playgroundtools.PanTool.prototype.activate = function(){
  goog.base(this, 'activate');
  
  goog.events.listen(this.dragDom, goog.events.EventType.MOUSEDOWN, this.onDown, false, this);
  goog.events.listen(this.dragger, goog.fx.Dragger.EventType.END, this.onDragEnd, false, this);
  goog.events.listen(this.dragger, goog.fx.Dragger.EventType.DRAG, this.onDrag, false, this);

  this.grabCursor.add();
};


imym.views.playgroundtools.PanTool.prototype.deactivate = function(){
  goog.base(this, 'deactivate');

  goog.events.unlisten(this.dragDom, goog.events.EventType.MOUSEDOWN, this.onDown, false, this);
  goog.events.unlisten(this.dragger, goog.fx.Dragger.EventType.END, this.onDragEnd, false, this);
  goog.events.unlisten(this.dragger, goog.fx.Dragger.EventType.DRAG, this.onDrag, false, this);
};


imym.views.playgroundtools.PanTool.prototype.onDown = function(e){
  this.panStartPosition = goog.style.getPosition(this.panDom);
};


imym.views.playgroundtools.PanTool.prototype.onDragEnd = function(e){
  this.grabCursor.remove();
};


imym.views.playgroundtools.PanTool.prototype.onDrag = function(e){
  var x = this.panStartPosition.x + e.dragger.deltaX;
  var y = this.panStartPosition.y + e.dragger.deltaY;
  goog.style.setPosition(this.panDom, x, y);
};