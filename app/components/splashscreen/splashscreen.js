var appSettingsModule = require("application-settings");
var observableModule = require("data/observable");
var navigation = require( "../../shared/navigation");


var _viewData = new observableModule.Observable();
var _page;
var _delay = 100;

exports.load = function(args) {
	_viewData.set( "imageSource", "~/images/splashScreenBackground.png" );
	_viewData.set("appVersion", global.appVersion );

	_page = args.object;
	_page.bindingContext = _viewData;

	//check version numbers
	if (appSettingsModule.hasKey("currentVersion")){
		var lastVersion = appSettingsModule.getString("currentVersion");
		if (lastVersion !== global.appVersion) {
			navigateToReleaseNotes();
		} else {
			navigateHome();
		}
	} else {
		navigateToReleaseNotes();
	}
};

function navigateToReleaseNotes() {
	appSettingsModule.setString("currentVersion", global.appVersion);
	setTimeout(function () {
		navigation.goReleaseNotes();
	}, _delay);
}

function navigateHome() {
	setTimeout(function () {
		navigation.goHome();
	}, _delay);
}
