
var observableModule = require("data/observable");
var frameModule = require("ui/frame");

var _viewData = new observableModule.Observable();
var _page;

exports.load = function(args) {
	_page = args.object;
	
	_viewData.set( "imageSource", "~/app/images/splashScreenBackground.png" );

	//Set the binding context on the page.
	_page.bindingContext = _viewData;

	//we should load some data here... so the dashboard page is ready.
	setTimeout(function () {
		frameModule.topmost().navigate(global.baseViewDirectory + "dashboard/dashboard");
	}, 2000);
};