var navigation = require( "../../shared/navigation");
var imageSourceModule = require("image-source");
var cameraModule = require("camera");

var templates = require( "../../shared/templates/templates");
var utilities = require( "../../shared/utilities");

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
	console.log("***** INVOKING CAMERA *****");

	//TODO: bug here with the promise...
	cameraModule.takePicture()
		.then(function(r) {
			console.log("***** Invoke Camera Return *****", r);

			_viewData.set("imageSource", r);
			_viewData.set("pictureTaken", true);
		}, function() {
			console.log("***** ERROR *****", error);
		});

	//TODO... if on cancel... we should show the camera roll to choose a picture from???...
}

//Start camera
exports.startCamera = function() {
	invokeCamera();
}

//Save to localStorage
exports.saveLocally = function() {
	if(_viewData.pictureTaken === false)
		return;
	
	_viewData.set("isBusy", true);

	templates.addNewLocalTemplate(_uniqueImageNameForSession, _viewData.get("imageSource"));
	
	navigation.goHome();
};

//Submit the template to everlive for everyone to use.
exports.submitToEverlive = function() {
	if(_viewData.pictureTaken === false)
		return;
	
	_viewData.set("isBusy", true);

	templates.addNewPublicTemplate(_uniqueImageNameForSession, _viewData.get("imageSource"))
	.then(function(){
		navigation.goHome();
	});
};