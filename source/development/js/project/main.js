goog.provide('imym.main');

goog.require('goog.fx.anim');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.style');
goog.require('soy');
goog.require('imym.templates');
goog.require('imym.controllers.NavigationController');
goog.require('imym.controllers.WindowController');
goog.require('imym.views.Playground');


// define global paths
imym.Url = {};
imym.Url.ORIGIN = window.location.protocol + '//' + window.location.hostname + '/';


imym.main = function() {
	goog.fx.anim.setAnimationWindow(window);

	imym.main.create();

	// init navigation controller
	imym.main.controllers.navigationController.init();
};

imym.main.create = function(e) {
	imym.main.controllers.navigationController = imym.controllers.NavigationController.getInstance();
	imym.main.controllers.windowController = imym.controllers.WindowController.getInstance();

	imym.main.views.playground = new imym.views.Playground();
};

imym.main.controllers = {};
imym.main.views = {};
imym.main.assets = null;

// export
goog.exportProperty(window, 'imym', imym);
goog.exportProperty(imym, 'main', imym.main);