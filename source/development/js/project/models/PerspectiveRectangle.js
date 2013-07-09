goog.provide('imym.models.PerspectiveRectangle');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.object');

/**
 * @constructor
 */
imym.models.PerspectiveRectangle = function(domElement){
  goog.base(this);

  this.domElement = domElement;

  var domSize = goog.style.getSize(this.domElement);

  this.transform = new PerspectiveTransform(this.domElement, domSize.width, domSize.height, true);
};
goog.inherits(imym.models.PerspectiveRectangle, goog.events.EventTarget);


imym.models.PerspectiveRectangle.prototype.topLeft = function(x, y){
	if(goog.isNumber(x) || goog.isNumber(y)) {
		if(goog.isNumber(x)) this.transform.topLeft.x = x;
		if(goog.isNumber(y)) this.transform.topLeft.y = y;
	}else {
		return this.transform.topLeft;
	}
};


imym.models.PerspectiveRectangle.prototype.topRight = function(x, y){
	if(goog.isNumber(x) || goog.isNumber(y)) {
		if(goog.isNumber(x)) this.transform.topRight.x = x;
		if(goog.isNumber(y)) this.transform.topRight.y = y;
	}else {
		return this.transform.topRight;
	}
};


imym.models.PerspectiveRectangle.prototype.bottomLeft = function(x, y){
	if(goog.isNumber(x) || goog.isNumber(y)) {
		if(goog.isNumber(x)) this.transform.bottomLeft.x = x;
		if(goog.isNumber(y)) this.transform.bottomLeft.y = y;
	}else {
		return this.transform.bottomLeft;
	}
};


imym.models.PerspectiveRectangle.prototype.bottomRight = function(x, y){
	if(goog.isNumber(x) || goog.isNumber(y)) {
		if(goog.isNumber(x)) this.transform.bottomRight.x = x;
		if(goog.isNumber(y)) this.transform.bottomRight.y = y;
	}else {
		return this.transform.bottomRight;
	}
};


imym.models.PerspectiveRectangle.prototype.update = function(){
	this.transform.update();
};