goog.provide('imym.models.PerspectiveRectangle');

goog.require('hlc.models.SongModel');
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


imym.models.PerspectiveRectangle.prototype.topLeft = function(){
  return {x: this.transform.topLeft.x, y: this.transform.topLeft.y};
};


imym.models.PerspectiveRectangle.prototype.topRight = function(){
  return {x: this.transform.topRight.x, y: this.transform.topRight.y};
};


imym.models.PerspectiveRectangle.prototype.bottomLeft = function(){
  return {x: this.transform.bottomLeft.x, y: this.transform.bottomLeft.y};
};


imym.models.PerspectiveRectangle.prototype.bottomRight = function(){
  return {x: this.transform.bottomRight.x, y: this.transform.bottomRight.y};
};