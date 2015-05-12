var observableModule = require("data/observable");
var navigation = require( "../../shared/navigation");

var _viewData = new observableModule.Observable();
var _page;

exports.load = function(args) {
	_viewData.set( "imageSource", "~/images/splashScreenBackground.png" );
	_viewData.set("appVersion", global.appVersion );

	_page = args.object;
	_page.bindingContext = _viewData;

	//Get whatever sets the flag
	var firstTimeForVersion = true;
	var delay = 100;

	if (firstTimeForVersion) {
		setTimeout(function () {
			navigation.goReleaseNotes();
		}, delay);
	} else {
		setTimeout(function () {
			navigation.goHome();
		}, delay);
	}
};
