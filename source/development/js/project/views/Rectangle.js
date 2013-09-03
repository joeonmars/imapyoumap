goog.provide('imym.views.Rectangle');

goog.require('imym.models.PerspectiveRectangle');
goog.require('goog.events.EventTarget');
goog.require('goog.events.KeyHandler');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.object');

/**
 * @constructor
 */
imym.views.Rectangle = function(parent, position, size){
  goog.base(this);

  this.isActive = false;
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

  this.parentDom = parent;
  goog.dom.appendChild(this.parentDom, this.domElement);

  // give content dom the maximum possible size
  var viewportSize = goog.dom.getViewportSize();
  var contentSize = size.clone().scaleToFit(viewportSize);
  goog.style.setSize(this.contentContainer, contentSize);

  // set draggers
  this.dragger = new goog.fx.Dragger(this.domElement);
  this.dragger.setHysteresis(10);

  this.draggerTopLeft = new goog.fx.Dragger(this.topLeftDom);
  this.draggerTopLeft.setHysteresis(5);

  this.draggerTopRight = new goog.fx.Dragger(this.topRightDom);
  this.draggerTopRight.setHysteresis(5);

  this.draggerBottomLeft = new goog.fx.Dragger(this.bottomLeftDom);
  this.draggerBottomLeft.setHysteresis(5);

  this.draggerBottomRight = new goog.fx.Dragger(this.bottomRightDom);
  this.draggerBottomRight.setHysteresis(5);

  this.perspectiveTransform = new imym.models.PerspectiveRectangle(this.contentContainer);

  this.transformRectangle( new goog.math.Rect(0, 0, this.originalSize.width, this.originalSize.height) );

  // set initial vertices dragger dom positions
  this.updateDraggersPositions();

  // set key handlers
  this._keyHandler = new goog.events.KeyHandler(document);

  // set mode
  var modeController = imym.main.controllers.modeController;
  modeController.addDispatcher(this);
  goog.events.listen(this, imym.models.modes.Mode.prototype.EventType.ACTIVATE, this.onActivate, false, this);
  goog.events.listen(this, imym.models.modes.Mode.prototype.EventType.DEACTIVATE, this.onDeactivate, false, this);

  // for debug only
  this.showOriginalRectangle(!true);
};
goog.inherits(imym.views.Rectangle, goog.events.EventTarget);


imym.views.Rectangle.prototype.getPositionsOfVertices = function(){
  var originalPosition = goog.style.getRelativePosition(this.domElement, this.parentDom);

  var positions = {
    topLeft: goog.math.Coordinate.sum(originalPosition, this.perspectiveTransform.getTopLeft()),
    topRight: goog.math.Coordinate.sum(originalPosition, this.perspectiveTransform.getTopRight()),
    bottomLeft: goog.math.Coordinate.sum(originalPosition, this.perspectiveTransform.getBottomLeft()),
    bottomRight: goog.math.Coordinate.sum(originalPosition, this.perspectiveTransform.getBottomRight())
  };

  return positions;
};


imym.views.Rectangle.prototype.updateDraggersPositions = function(){
  goog.style.setPosition(this.topLeftDom, this.perspectiveTransform.topLeft().x, this.perspectiveTransform.topLeft().y);
  goog.style.setPosition(this.topRightDom, this.perspectiveTransform.topRight().x, this.perspectiveTransform.topRight().y);
  goog.style.setPosition(this.bottomLeftDom, this.perspectiveTransform.bottomLeft().x, this.perspectiveTransform.bottomLeft().y);
  goog.style.setPosition(this.bottomRightDom, this.perspectiveTransform.bottomRight().x, this.perspectiveTransform.bottomRight().y);
};


imym.views.Rectangle.prototype.setActive = function(isActive){
  this.isActive = (isActive === false ? false : true);

  if(this.isActive) {
    goog.dom.classes.add(this.domElement, 'active');
    goog.style.setStyle(this.domElement, 'z-index', 1);
  }else {
    goog.dom.classes.remove(this.domElement, 'active');
    goog.style.setStyle(this.domElement, 'z-index', null);
  }
};


imym.views.Rectangle.prototype.show = function(show){
  goog.style.showElement(this.domElement, show);
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


imym.views.Rectangle.prototype.showControls = function(show){
  goog.style.showElement(this.topLeftDom, show);
  goog.style.showElement(this.topRightDom, show);
  goog.style.showElement(this.bottomLeftDom, show);
  goog.style.showElement(this.bottomRightDom, show);
};


imym.views.Rectangle.prototype.enable = function(enable){
  if(enable === false) {
    goog.dom.classes.add(this.domElement, 'disabled');
  }else {
    goog.dom.classes.remove(this.domElement, 'disabled');
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


imym.views.Rectangle.prototype.onActivate = function(e){
  if(e.mode === imym.main.controllers.modeController.modes.idleMode) {
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

    this.dragger.setEnabled(true);
    this.draggerTopLeft.setEnabled(true);
    this.draggerTopRight.setEnabled(true);
    this.draggerBottomLeft.setEnabled(true);
    this.draggerBottomRight.setEnabled(true);

    goog.events.listen(this.domElement, 'mousedown', this.onDown, false, this);
    goog.events.listen(document, 'mousedown', this.onDown, false, this);

    goog.events.listen(this._keyHandler, goog.events.KeyHandler.EventType.KEY, this.onKeyDown, false, this);
  }
};


imym.views.Rectangle.prototype.onDeactivate = function(e){
  if(e.mode === imym.main.controllers.modeController.modes.idleMode) {
    goog.events.unlisten(this.draggerTopLeft, goog.fx.Dragger.EventType.START, this.onDragVertexStart, false, this);
    goog.events.unlisten(this.draggerTopRight, goog.fx.Dragger.EventType.START, this.onDragVertexStart, false, this);
    goog.events.unlisten(this.draggerBottomLeft, goog.fx.Dragger.EventType.START, this.onDragVertexStart, false, this);
    goog.events.unlisten(this.draggerBottomRight, goog.fx.Dragger.EventType.START, this.onDragVertexStart, false, this);

    goog.events.unlisten(this.draggerTopLeft, goog.fx.Dragger.EventType.END, this.onDragVertexEnd, false, this);
    goog.events.unlisten(this.draggerTopRight, goog.fx.Dragger.EventType.END, this.onDragVertexEnd, false, this);
    goog.events.unlisten(this.draggerBottomLeft, goog.fx.Dragger.EventType.END, this.onDragVertexEnd, false, this);
    goog.events.unlisten(this.draggerBottomRight, goog.fx.Dragger.EventType.END, this.onDragVertexEnd, false, this);

    goog.events.unlisten(this.draggerTopLeft, goog.fx.Dragger.EventType.DRAG, this.onDragVertex, false, this);
    goog.events.unlisten(this.draggerTopRight, goog.fx.Dragger.EventType.DRAG, this.onDragVertex, false, this);
    goog.events.unlisten(this.draggerBottomLeft, goog.fx.Dragger.EventType.DRAG, this.onDragVertex, false, this);
    goog.events.unlisten(this.draggerBottomRight, goog.fx.Dragger.EventType.DRAG, this.onDragVertex, false, this);

    this.dragger.setEnabled(false);
    this.draggerTopLeft.setEnabled(false);
    this.draggerTopRight.setEnabled(false);
    this.draggerBottomLeft.setEnabled(false);
    this.draggerBottomRight.setEnabled(false);

    goog.events.unlisten(this.domElement, 'mousedown', this.onDown, false, this);
    goog.events.unlisten(document, 'mousedown', this.onDown, false, this);

    goog.events.unlisten(this._keyHandler, goog.events.KeyHandler.EventType.KEY, this.onKeyDown, false, this);
  }
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

  // snap to closest vertex position
  var vertexPositionToSnap;
  var verticesPositions = this.getPositionsOfVertices();
  var originalPosition = goog.style.getPosition(this.domElement);
  var deltaX;
  var deltaY;

  switch(e.target) {
    case this.draggerTopLeft:
    vertexPositionToSnap = verticesPositions.topLeft;
    break;

    case this.draggerTopRight:
    vertexPositionToSnap = verticesPositions.topRight;
    break;

    case this.draggerBottomLeft:
    vertexPositionToSnap = verticesPositions.bottomLeft;
    break;

    case this.draggerBottomRight:
    vertexPositionToSnap = verticesPositions.bottomRight;
    break;
  }

  var vertexPositionToSnapTo = imym.main.views.playground.getClosestRectangleVertexPosition(this, vertexPositionToSnap);

  if(vertexPositionToSnapTo) {
    deltaX = vertexPositionToSnapTo.x - originalPosition.x;
    deltaY = vertexPositionToSnapTo.y - originalPosition.y;

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

    this.updateDraggersPositions();
  }
};


imym.views.Rectangle.prototype.onDown = function(e){
  if(goog.dom.contains(this.domElement, e.target)) {
    this.setActive(true);
  }else {
    this.setActive(false);
  }
};


imym.views.Rectangle.prototype.onKeyDown = function(e){
  if(!this.isActive) return false;

  var nudgeX = 0;
  var nudgeY = 0;

  var position = goog.style.getPosition(this.domElement);

  if(e.keyCode === goog.events.KeyCodes.LEFT) {
    nudgeX = -1;
    position.x += nudgeX;
  }else if(e.keyCode === goog.events.KeyCodes.RIGHT) {
    nudgeX = 1;
    position.x += nudgeX;
  }else if(e.keyCode === goog.events.KeyCodes.UP) {
    nudgeY = -1;
    position.y += nudgeY;
  }else if(e.keyCode === goog.events.KeyCodes.DOWN) {
    nudgeY = 1;
    position.y += nudgeY;
  }

  goog.style.setPosition(this.domElement, position);
};