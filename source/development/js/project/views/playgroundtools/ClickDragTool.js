goog.provide('imym.views.playgroundtools.ClickDragTool');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.object');
goog.require('goog.fx.Dragger');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Size');
goog.require('imym.views.playgroundtools.Tool');

/**
 * @constructor
 */
imym.views.playgroundtools.ClickDragTool = function(playground, parentDom, dragDom){
  goog.base(this, playground, imym.main.controllers.modeController.modes.clickDragMode);

  this.domElement = goog.dom.createDom('div', {id: 'click-drag-tool'});
  goog.dom.appendChild(parentDom, this.domElement);

  this.dragDom = dragDom;

  this.mockRectangleDom = new goog.dom.createDom('div', 'mockRectangle');

  this.dragger = new goog.fx.Dragger(dragDom);
  this.dragger.defaultAction = this.draggerDefaultAction;
};
goog.inherits(imym.views.playgroundtools.ClickDragTool, imym.views.playgroundtools.Tool);


imym.views.playgroundtools.ClickDragTool.prototype.draggerDefaultAction = function(x, y){

};


imym.views.playgroundtools.ClickDragTool.prototype.activate = function(){
  goog.base(this, 'activate');
  
  goog.events.listen(this.dragDom, goog.events.EventType.MOUSEDOWN, this.onDown, false, this);
  goog.events.listen(this.dragger, goog.fx.Dragger.EventType.BEFOREDRAG, this.onBeforeDrag, false, this);
  goog.events.listen(this.dragger, goog.fx.Dragger.EventType.DRAG, this.onDrag, false, this);
  goog.events.listen(this.dragger, goog.fx.Dragger.EventType.END, this.onDragEnd, false, this);

  this.dragger.setEnabled(true);
};


imym.views.playgroundtools.ClickDragTool.prototype.deactivate = function(){
  goog.base(this, 'deactivate');

  if(this.dragger.isDragging()) {
    goog.dom.removeNode(this.mockRectangleDom);
  }

  goog.events.unlisten(this.dragDom, goog.events.EventType.MOUSEDOWN, this.onDown, false, this);
  goog.events.unlisten(this.dragger, goog.fx.Dragger.EventType.BEFOREDRAG, this.onBeforeDrag, false, this);
  goog.events.unlisten(this.dragger, goog.fx.Dragger.EventType.DRAG, this.onDrag, false, this);
  goog.events.unlisten(this.dragger, goog.fx.Dragger.EventType.END, this.onDragEnd, false, this);

  this.dragger.setEnabled(false);
};


imym.views.playgroundtools.ClickDragTool.prototype.getDraggedRect = function(e){
  var top = Math.min(e.dragger.startY + e.dragger.deltaY, e.dragger.startY);
  var left = Math.min(e.dragger.startX + e.dragger.deltaX, e.dragger.startX);

  var width = Math.abs(e.dragger.deltaX);
  var height = Math.abs(e.dragger.deltaY);

  return new goog.math.Rect(left, top, width, height);
};


imym.views.playgroundtools.ClickDragTool.prototype.onDown = function(e){
  if(e.target !== e.currentTarget) {
    this.dragger.endDragCancel(e);
  }
};


imym.views.playgroundtools.ClickDragTool.prototype.onBeforeDrag = function(e){
  goog.dom.appendChild(this.domElement, this.mockRectangleDom);
  goog.style.setPosition(this.mockRectangleDom, e.dragger.startX, e.dragger.startY);
  goog.style.setSize(this.mockRectangleDom, 0, 0);
};


imym.views.playgroundtools.ClickDragTool.prototype.onDrag = function(e){
  var draggedRect = this.getDraggedRect(e);
  var top = draggedRect.top;
  var left = draggedRect.left;
  var width = draggedRect.width;
  var height = draggedRect.height;

  goog.style.setPosition(this.mockRectangleDom, left, top);
  goog.style.setSize(this.mockRectangleDom, width, height);
};


imym.views.playgroundtools.ClickDragTool.prototype.onDragEnd = function(e){
  goog.dom.removeNode(this.mockRectangleDom);

  var draggedRect = this.getDraggedRect(e);
  var top = draggedRect.top;
  var left = draggedRect.left;
  var width = draggedRect.width;
  var height = draggedRect.height;

  var threshold = imym.views.playgroundtools.ClickDragTool.THRESHOLD;

  if(width > threshold && height > threshold) {

    this.dispatchEvent({
      type: imym.views.Playground.EventType.CREATE_RECTANGLE,
      position: new goog.math.Coordinate(left, top),
      size: new goog.math.Size(width, height)
    });

  }

};


imym.views.playgroundtools.ClickDragTool.THRESHOLD = 10;