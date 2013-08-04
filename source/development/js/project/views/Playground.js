goog.provide('imym.views.Playground');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.object');
goog.require('imym.views.playgroundtools.ClickDragTool');
goog.require('imym.views.playgroundtools.PanTool');
goog.require('imym.views.Rectangle');

/**
 * @constructor
 */
imym.views.Playground = function(){
  goog.base(this);

  this.domElement = goog.dom.getElement('playground');
  this.toolsContainerDom = goog.dom.getElementByClass('toolsContainer', this.domElement);
  this.outerDom = goog.dom.getElementByClass('outer', this.domElement);
  this.innerDom = goog.dom.getElementByClass('inner', this.outerDom);
  this.contentDom = goog.dom.getElementByClass('content', this.innerDom);

  this.rectangles = [];

  // listen to events
  goog.events.listen(this, imym.views.Playground.EventType.CREATE_RECTANGLE, this.onCreateRectangle, false, this);

  // create tools
  this.clickDragTool = new imym.views.playgroundtools.ClickDragTool(this, this.toolsContainerDom, this.domElement);
  this.panTool = new imym.views.playgroundtools.PanTool(this, this.toolsContainerDom, this.domElement, this.innerDom);
};
goog.inherits(imym.views.Playground, goog.events.EventTarget);


imym.views.Playground.prototype.init = function(){

};


imym.views.Playground.prototype.onCreateRectangle = function(e){
  var outerPosition = goog.style.getPosition(this.outerDom);
  var innerPosition = goog.style.getPosition(this.innerDom);
  var rectangleX = e.position.x - innerPosition.x - outerPosition.x;
  var rectangleY = e.position.y - innerPosition.y - outerPosition.y;
  var rectanglePosition = new goog.math.Coordinate(rectangleX, rectangleY);

  var rectangle = new imym.views.Rectangle(this.contentDom, rectanglePosition, e.size);
  this.rectangles.push(rectangle);
};


imym.views.Playground.EventType = {
  CREATE_RECTANGLE: 'create_rectangle'
};