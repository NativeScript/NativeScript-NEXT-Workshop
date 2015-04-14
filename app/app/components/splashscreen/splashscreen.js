var observableModule = require("data/observable");
var navigation = require( "../../shared/navigation");

var templates = require( "../../shared/templates/templates");

var _viewData = new observableModule.Observable();
var _page;

exports.load = function(args) {
	_page = args.object;
	_viewData.set( "imageSource", "~/app/images/splashScreenBackground.png" );

	//Set the binding context on the page.
	_page.bindingContext = _viewData;
	
	setTimeout(function () {
		navigation.goHome();
	}, 100);
	
};