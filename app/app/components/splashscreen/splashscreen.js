
var observableModule = require("data/observable");
var frameModule = require("ui/frame");

var _pageData = new observableModule.Observable();
var _page;

exports.load = function(args) {
	_page = args.object;
	
	_pageData.set( "imageSource", "~/app/images/splashScreenBackground.png" );

	//Set the binding context on the page.
	_page.bindingContext = _pageData;

	//we should load some data here... so the dashboard page is ready.
	setTimeout(function () {
		frameModule.topmost().navigate("app/components/dashboard/dashboard");
	}, 2000);
};