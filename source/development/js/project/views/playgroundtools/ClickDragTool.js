goog.provide('imym.views.playgroundtools.ClickDragTool');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.object');
goog.require('goog.fx.Dragger');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Size');

/**
 * @constructor
 */
imym.views.playgroundtools.ClickDragTool = function(playground, parentDom, dragDom){
  goog.base(this);

  this.setParentEventTarget(playground);

  this.domElement = goog.dom.createDom('div', {id: 'click-drag-tool'});
  goog.dom.appendChild(parentDom, this.domElement);

  this.mockRectangleDom = new goog.dom.createDom('div', 'mockRectangle');

  this.dragger = new goog.fx.Dragger(dragDom);
  this.dragger.defaultAction = this.draggerDefaultAction;

  goog.events.listen(dragDom, goog.events.EventType.MOUSEDOWN, this.onDown, false, this);
  goog.events.listen(this.dragger, goog.fx.Dragger.EventType.BEFOREDRAG, this.onBeforeDrag, false, this);
  goog.events.listen(this.dragger, goog.fx.Dragger.EventType.DRAG, this.onDrag, false, this);
  goog.events.listen(this.dragger, goog.fx.Dragger.EventType.END, this.onDragEnd, false, this);
};
goog.inherits(imym.views.playgroundtools.ClickDragTool, goog.events.EventTarget);


imym.views.playgroundtools.ClickDragTool.prototype.draggerDefaultAction = function(x, y){

};


imym.views.playgroundtools.ClickDragTool.prototype.onDown = function(e){
  if(e.target.className !== 'outer') {
    this.dragger.endDragCancel(e);
  }
};


imym.views.playgroundtools.ClickDragTool.prototype.onBeforeDrag = function(e){
  goog.dom.appendChild(this.domElement, this.mockRectangleDom);
  goog.style.setPosition(this.mockRectangleDom, e.dragger.startX, e.dragger.startY);
  goog.style.setSize(this.mockRectangleDom, 0, 0);
};


imym.views.playgroundtools.ClickDragTool.prototype.onDrag = function(e){
  goog.style.setSize(this.mockRectangleDom, e.dragger.deltaX, e.dragger.deltaY);
};


imym.views.playgroundtools.ClickDragTool.prototype.onDragEnd = function(e){
  goog.dom.removeNode(this.mockRectangleDom);

  if(Math.abs(e.dragger.deltaX) > 0 && Math.abs(e.dragger.deltaY) > 0) {

    this.dispatchEvent({
      type: imym.views.Playground.EventType.CREATE_RECTANGLE,
      position: new goog.math.Coordinate(e.dragger.startX, e.dragger.startY),
      size: new goog.math.Size(e.dragger.deltaX, e.dragger.deltaY)
    });
    
  }
};