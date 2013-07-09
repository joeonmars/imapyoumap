goog.provide('imym.views.Playground');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.object');
goog.require('imym.views.playgroundtools.ClickDragTool');
goog.require('imym.views.Rectangle');

/**
 * @constructor
 */
imym.views.Playground = function(){
  goog.base(this);

  this.domElement = goog.dom.createDom('div', {id: 'playground'}, [
  	this.outerDom = goog.dom.createDom('div', 'outer', [
      this.innerDom = goog.dom.createDom('div', 'inner', [
        this.contentDom = goog.dom.createDom('div', 'content'),
        this.toolsContainerDom = goog.dom.createDom('div', 'toolsContainer')
        ])
      ])
  	]);

  goog.dom.appendChild(document.body, this.domElement);

  //
  this.rectangles = [];

  // listen to events
  goog.events.listen(this, imym.views.Playground.EventType.CREATE_RECTANGLE, this.onCreateRectangle, false, this);

  // create tools
  this.clickDragTool = new imym.views.playgroundtools.ClickDragTool(this, this.toolsContainerDom, this.domElement);
};
goog.inherits(imym.views.Playground, goog.events.EventTarget);


imym.views.Playground.prototype.init = function(){

};


imym.views.Playground.prototype.onCreateRectangle = function(e){
  var rectangle = new imym.views.Rectangle(this.contentDom, e.position, e.size);
  this.rectangles.push(rectangle);
};


imym.views.Playground.EventType = {
  CREATE_RECTANGLE: 'create_rectangle'
};