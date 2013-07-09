goog.provide('imym.controllers.NavigationController');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.History');
goog.require('goog.history.Html5History');
goog.require('goog.history.EventType');
goog.require('goog.string');

/**
 * @constructor
 */
imym.controllers.NavigationController = function(){
  goog.base(this);

  // a toggle of whether to use history API
  this._useHistoryAPI = null;

  // the current token
  this._token = null;

  // the history object
  this._navHistory = null;

  // dispatchers that listen for navigate event
  this._dispatchers = [];
};
goog.inherits(imym.controllers.NavigationController, goog.events.EventTarget);
goog.addSingletonGetter(imym.controllers.NavigationController);


imym.controllers.NavigationController.prototype.init = function(){
  this._useHistoryAPI = (imym.controllers.NavigationController.Implementation === imym.controllers.NavigationController.HISTORY_API);

  if(this._useHistoryAPI) {
  	this._navHistory = new goog.history.Html5History();
  	this._navHistory.setUseFragment(false);
  }else {
  	var input = goog.dom.createDom('input');
  	var iframe = goog.dom.createDom('iframe');
  	this._navHistory = new goog.History(false, null, input, iframe);
  }

  // the current token
  this._token = null;

  goog.events.listen(this._navHistory, goog.history.EventType.NAVIGATE, this.onNavigate, false, this);

  this._navHistory.setEnabled(true);
};


imym.controllers.NavigationController.prototype.addDispatcher = function(dispatcher) {
	if(!goog.array.contains(this._dispatchers, dispatcher)) {
		this._dispatchers.push(dispatcher);
	}
};


imym.controllers.NavigationController.prototype.removeDispatcher = function(dispatcher) {
	if(goog.array.contains(this._dispatchers, dispatcher)) {
		goog.array.remove(this._dispatchers, dispatcher);
	}
};


imym.controllers.NavigationController.prototype.setToken = function(token, title){
	// if using hash, make sure the '/' is prepended
	if(!this._useHistoryAPI) {
		if(!goog.string.startsWith(token, '/')) {
			token = ('/').concat(token);
		}
	}

	this._navHistory.setToken(token ,title);
};


imym.controllers.NavigationController.prototype.getToken = function(){
	var token = this._navHistory.getToken();
	if(goog.string.startsWith(token, '/')) {
		token = token.substring(1);
	}
	return token;
};


imym.controllers.NavigationController.prototype.replaceToken = function(token, title){
	this._navHistory.replaceToken(token ,title);
};


imym.controllers.NavigationController.prototype.handleToken = function(token){
	console.log('handle token: ' + token);

	var ev = {
		type: goog.history.EventType.NAVIGATE,
		token: token
	};

	goog.array.forEach(this._dispatchers, function(dispatcher) {
		dispatcher.dispatchEvent(ev);
	});
};


imym.controllers.NavigationController.prototype.onNavigate = function(e){
	// validate the token by HTML5 history API support,
	// optionally append or remove hash fragment,
	// and reset the window location
	var tokenStr = goog.string.remove(window.location.href, imym.Url.ORIGIN);

	if(e.token === '' && tokenStr !== '') {
		if(this._useHistoryAPI) {
			// indicates a possible hash bang to be removed
			if(goog.string.startsWith(tokenStr, '#/')) {
				var token = tokenStr.substring(2);
				window.location = imym.Url.ORIGIN + token;
			}
		}else{
			// indicates a possible lack of hash bang
			if(!goog.string.startsWith(tokenStr, '#/')) {
				var token = ('#/').concat(tokenStr);
				window.location = imym.Url.ORIGIN + token;
			}
		}

		return false;
	}

	// skip duplicated token returned by the closure html5History API
	if(this._token === e.token) return false;
	else this._token = e.token;

	this.handleToken( this.getToken() );
};


imym.controllers.NavigationController.HASH = 'hash';
imym.controllers.NavigationController.HISTORY_API = 'history_api';
imym.controllers.NavigationController.Implementation = (goog.history.Html5History.isSupported() ? imym.controllers.NavigationController.HISTORY_API : imym.controllers.NavigationController.HASH);