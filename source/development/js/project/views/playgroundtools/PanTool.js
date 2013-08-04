goog.provide('imym.views.playgroundtools.PanTool');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.fx.Dragger');
goog.require('goog.math.Coordinate');
goog.require('goog.events.KeyHandler');
goog.require('imym.utils');

/**
 * @constructor
 */
imym.views.playgroundtools.PanTool = function(playground, parentDom, dragDom, panDom){
  goog.base(this);

  this.setParentEventTarget(playground);

  this.panDom = panDom;

  this.domElement = goog.dom.createDom('div', {id: 'pan-tool'});
  goog.dom.appendChild(parentDom, this.domElement);

  this.dragger = new goog.fx.Dragger(dragDom);
  this.dragger.defaultAction = this.draggerDefaultAction;
  goog.events.listen(dragDom, goog.events.EventType.MOUSEDOWN, this.onDown, false, this);
  goog.events.listen(this.dragger, goog.fx.Dragger.EventType.END, this.onDragEnd, false, this);
  goog.events.listen(this.dragger, goog.fx.Dragger.EventType.DRAG, this.onDrag, false, this);

  this.keyHandler = new goog.events.KeyHandler(document);
  goog.events.listen(this.keyHandler, goog.events.KeyHandler.EventType.KEY, this.onKey, false, this);

  this.panStartPosition = null;

  this.grabCursor = imym.utils.grabCursor(dragDom);
};
goog.inherits(imym.views.playgroundtools.PanTool, goog.events.EventTarget);


imym.views.playgroundtools.PanTool.prototype.draggerDefaultAction = function(x, y){
};


imym.views.playgroundtools.PanTool.prototype.onKey = function(e){
  e.preventDefault();
  
  if(e.keyCode == goog.events.KeyCodes.SPACE && !e.repeat) {
    this.grabCursor.add();

    this._isDraggable = true;
    goog.events.listenOnce(document, goog.events.EventType.KEYUP, this.onKeyUp, false, this);
  }
};


imym.views.playgroundtools.PanTool.prototype.onKeyUp = function(e){
  this._isDraggable = false;
  this.dragger.endDragCancel(e);
};


imym.views.playgroundtools.PanTool.prototype.onDown = function(e){
  if(!this._isDraggable) {
    this.dragger.endDragCancel(e);
    return;
  }

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