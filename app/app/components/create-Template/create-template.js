var frameModule = require("ui/frame");
var imageSourceModule = require("image-source");
var cameraModule = require("camera");

var templates = require( "../../shared/templates/templates");
var utilities = require( "../../shared/utilities");

var observableModule = require("data/observable");
var _viewData = new observableModule.Observable();

var _page,
	_uniqueImageNameForSession;

exports.loaded = function(args) {
	_page = args.object;
	_page.bindingContext = _viewData;

	_uniqueImageNameForSession = utilities.generateUUID() + ".png";

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
		}, function() {
			console.log("***** ERROR *****", error);
		});

	//TODO... if on cancel... we should show the camera roll to choose a picture from???...
}

//Save to localStorage
exports.saveLocally = function() {
	saveImageLocally(_viewData.get("imageSource"), _uniqueImageNameForSession);

	goHome();
};

function saveImageLocally(memeImageSource, imageName) {
	var saved = templates.addNewLocalTemplate(imageName, memeImageSource);

	if (!saved) {
		console.log("Recent meme not saved....");
	} else {
		console.log("Recent template saved.");
	}
};

//Submit the template to everlive for everyone to use.
exports.submitToEverlive = function() {
	templates.addNewPublicTemplate(_uniqueImageNameForSession, _viewData.get("imageSource"))
		.catch(function (error){
			console.log("***** ERROR *****", error);
		});

	goHome();
};

function goHome() {
	frameModule.topmost().navigate(global.baseViewDirectory + "home/home");
}