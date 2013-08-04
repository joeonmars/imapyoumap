goog.provide('imym.views.Rectangle');

goog.require('imym.models.PerspectiveRectangle');
goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.object');

/**
 * @constructor
 */
imym.views.Rectangle = function(parent, position, size){
  goog.base(this);

  this.originalSize = size;

  this.domElement = goog.dom.createDom('div', 'rectangle', [
    this.contentContainer = goog.dom.createDom('div', 'contentContainer'),
  	this.vertexContainer = goog.dom.createDom('div', 'vertexContainer', [
  		this.topLeftDom = goog.dom.createDom('div', 'topLeft'),
  		this.topRightDom = goog.dom.createDom('div', 'topRight'),
  		this.bottomLeftDom = goog.dom.createDom('div', 'bottomLeft'),
  		this.bottomRightDom = goog.dom.createDom('div', 'bottomRight')
  		])
  	]);

  goog.style.setPosition(this.domElement, position);

  goog.dom.appendChild(parent, this.domElement);

  // give content dom the maximum possible size
  var viewportSize = goog.dom.getViewportSize();
  var contentSize = size.clone().scaleToFit(viewportSize);
  goog.style.setSize(this.contentContainer, contentSize);

  // set draggers
  this.dragger = new goog.fx.Dragger(this.domElement);

  this.draggerTopLeft = new goog.fx.Dragger(this.topLeftDom);
  this.draggerTopRight = new goog.fx.Dragger(this.topRightDom);
  this.draggerBottomLeft = new goog.fx.Dragger(this.bottomLeftDom);
  this.draggerBottomRight = new goog.fx.Dragger(this.bottomRightDom);

  goog.events.listen(this.draggerTopLeft, goog.fx.Dragger.EventType.START, this.onDragVertexStart, false, this);
  goog.events.listen(this.draggerTopRight, goog.fx.Dragger.EventType.START, this.onDragVertexStart, false, this);
  goog.events.listen(this.draggerBottomLeft, goog.fx.Dragger.EventType.START, this.onDragVertexStart, false, this);
  goog.events.listen(this.draggerBottomRight, goog.fx.Dragger.EventType.START, this.onDragVertexStart, false, this);

  goog.events.listen(this.draggerTopLeft, goog.fx.Dragger.EventType.END, this.onDragVertexEnd, false, this);
  goog.events.listen(this.draggerTopRight, goog.fx.Dragger.EventType.END, this.onDragVertexEnd, false, this);
  goog.events.listen(this.draggerBottomLeft, goog.fx.Dragger.EventType.END, this.onDragVertexEnd, false, this);
  goog.events.listen(this.draggerBottomRight, goog.fx.Dragger.EventType.END, this.onDragVertexEnd, false, this);

  goog.events.listen(this.draggerTopLeft, goog.fx.Dragger.EventType.DRAG, this.onDragVertex, false, this);
  goog.events.listen(this.draggerTopRight, goog.fx.Dragger.EventType.DRAG, this.onDragVertex, false, this);
  goog.events.listen(this.draggerBottomLeft, goog.fx.Dragger.EventType.DRAG, this.onDragVertex, false, this);
  goog.events.listen(this.draggerBottomRight, goog.fx.Dragger.EventType.DRAG, this.onDragVertex, false, this);

  this.perspectiveTransform = new imym.models.PerspectiveRectangle(this.contentContainer);

  this.transformRectangle( new goog.math.Rect(0, 0, this.originalSize.width, this.originalSize.height) );

  // set initial vertices dom positions
  goog.style.setPosition(this.topLeftDom, this.perspectiveTransform.topLeft().x, this.perspectiveTransform.topLeft().y);
  goog.style.setPosition(this.topRightDom, this.perspectiveTransform.topRight().x, this.perspectiveTransform.topRight().y);
  goog.style.setPosition(this.bottomLeftDom, this.perspectiveTransform.bottomLeft().x, this.perspectiveTransform.bottomLeft().y);
  goog.style.setPosition(this.bottomRightDom, this.perspectiveTransform.bottomRight().x, this.perspectiveTransform.bottomRight().y);

  // for debug only
  this.showOriginalRectangle(true);
};
goog.inherits(imym.views.Rectangle, goog.events.EventTarget);


imym.views.Rectangle.prototype.show = function(){

};


imym.views.Rectangle.prototype.hide = function(){
	
};


imym.views.Rectangle.prototype.showOriginalRectangle = function(show){
  if(show === true) {
    goog.style.setSize(this.domElement, this.originalSize);
    goog.style.setStyle(this.domElement, 'outline', '1px solid red');
  }else {
    goog.style.setSize(this.domElement, 0, 0);
    goog.style.setStyle(this.domElement, 'outline', 'none');
  }
};


imym.views.Rectangle.prototype.transformRectangle = function(rect){
  this.transformTopLeft(rect.left, rect.top);
  this.transformTopRight(rect.width, rect.top);
  this.transformBottomLeft(rect.left, rect.height);
  this.transformBottomRight(rect.width, rect.height);
};


imym.views.Rectangle.prototype.transformTopLeft = function(x, y){
  this.perspectiveTransform.topLeft(x, y);
  this.perspectiveTransform.update();
};


imym.views.Rectangle.prototype.transformTopRight = function(x, y){
  this.perspectiveTransform.topRight(x, y);
  this.perspectiveTransform.update();
};


imym.views.Rectangle.prototype.transformBottomLeft = function(x, y){
  this.perspectiveTransform.bottomLeft(x, y);
  this.perspectiveTransform.update();
};


imym.views.Rectangle.prototype.transformBottomRight = function(x, y){
  this.perspectiveTransform.bottomRight(x, y);
  this.perspectiveTransform.update();
};


imym.views.Rectangle.prototype.onDragVertexStart = function(e){
  var vertexDom = e.target.target;
  goog.dom.classes.add(vertexDom, 'active');

  this.dragger.setEnabled(false);
};


imym.views.Rectangle.prototype.onDragVertexEnd = function(e){
  var vertexDom = e.target.target;
  goog.dom.classes.remove(vertexDom, 'active');

  this.dragger.setEnabled(true);
};


imym.views.Rectangle.prototype.onDragVertex = function(e){
  var deltaX = e.dragger.deltaX;
  var deltaY = e.dragger.deltaY;

  switch(e.target) {
    case this.draggerTopLeft:
    this.transformTopLeft(deltaX, deltaY);
    break;

    case this.draggerTopRight:
    this.transformTopRight(deltaX, deltaY);
    break;

    case this.draggerBottomLeft:
    this.transformBottomLeft(deltaX, deltaY);
    break;

    case this.draggerBottomRight:
    this.transformBottomRight(deltaX, deltaY);
    break;
  }
};