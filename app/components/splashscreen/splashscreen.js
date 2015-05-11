var observableModule = require("data/observable");
var navigation = require( "../../shared/navigation");
var absoluteLayoutModule = require("ui/layouts/absolute-layout");
var labelModule = require("ui/label");

var _viewData = new observableModule.Observable();
var _page;

exports.load = function(args) {
	_page = args.object;
	_viewData.set( "imageSource", "~/images/splashScreenBackground.png" );
	_viewData.set("appVersion", global.appVersion );

	//Set the binding context on the page.
	_page.bindingContext = _viewData;

	setTimeout(function () {
		navigation.goHome();
	}, 100);
};
