var applicationModule = require("application");
var imageSourceModule = require("image-source");
var cameraModule = require("camera");

var navigation = require("../../shared/navigation");
var templates = require( "../../shared/templates/templates");
var utilities = require( "../../shared/utilities");
var analyticsMonitor = require("../../shared/analytics");

var observableModule = require("data/observable");
var _viewData = new observableModule.Observable();

var _page,
	_uniqueImageNameForSession;

exports.navigatedTo = function(args) {
	_page = args.object;
	_page.bindingContext = _viewData;

	_uniqueImageNameForSession = utilities.generateUUID() + ".png";

	_viewData.set("pictureTaken", false);
	_viewData.set("isBusy", false);
	_viewData.set("imageSource", null);
	invokeCamera();
};

function invokeCamera() {
	//https://github.com/NativeScript/docs/blob/master/camera.md
	
	cameraModule.takePicture(
		applicationModule.ios ? 300 : 750,
		applicationModule.ios ? 200 : 450,
		true)
		.then(function(r) {
			analyticsMonitor.trackFeature("CreateTemplate.TakePicture");
			console.log("***** Invoke Camera Return *****", r);

			_viewData.set("imageSource", r);
			_viewData.set("pictureTaken", true);			
		}, function(error) {
			analyticsMonitor.trackException(error, "Failed to TakePicture");
			console.log("***** ERROR *****", error);
		});

	//TODO... if on cancel... we should show the camera roll to choose a picture from???...
}

//Save to localStorage
exports.saveLocally = function() {
	_viewData.set("isBusy", true);
	analyticsMonitor.trackFeature("CreateTemplate.SaveLocally");
	templates.addNewLocalTemplate(_uniqueImageNameForSession, _viewData.get("imageSource"));
	navigation.goHome();
};

//Submit the template to everlive for everyone to use.
exports.submitToEverlive = function() {
	_viewData.set("isBusy", true);
	analyticsMonitor.trackFeatureStart("CreateTemplate.SavedToEverlive");

	templates.addNewPublicTemplate(_uniqueImageNameForSession, _viewData.get("imageSource"))
	.then(function(){
		analyticsMonitor.trackFeature("CreateTemplate.SavedToEverlive");
		analyticsMonitor.trackFeatureStop("CreateTemplate.SavedToEverlive");

		navigation.goHome();
	});
};