var frameModule = require("ui/frame");
var imageSourceModule = require("image-source");
var cameraModule = require("camera");

var everlive = require( "../everlive/everlive");
var localStorage = require( "../local-storage/local-storage");
var utilities = require( "../../shared/utilities");

var observableModule = require("data/observable");
var _viewData = new observableModule.Observable();

var _page,
	_uniqueImageNameForSession;

exports.loaded = function(args) {
	_page = args.object;
	_page.bindingContext = _viewData;

	_uniqueImageNameForSession = utilities.generateUUID() + ".png";
};

exports.navigatedTo = function (args){
	_viewData.set("imageSource", null);
	invokeCamera();
}

//Submit the template to everlive for everyone to use.
exports.submitToEverlive = function() {

	//Will also need to write record to content type...

	everlive.uploadFile(_uniqueImageNameForSession, _viewData.get("imageSource"))
		.then(function(e){
			if ( e.content.statusCode != '200' ) {
				console.log("EVERLIVE RESPONSE", JSON.stringify(e));
			} else {
				console.log("***** Uploaded File *****");
			}
		}).catch(function (error){
			console.log("***** ERROR *****", error);
		});

	goHome();
};

//Save to localStorage
exports.saveLocally = function() {
	saveImageLocally(_viewData.get("imageSource"), _uniqueImageNameForSession);

	goHome();
};

function invokeCamera() {
	console.log("***** INVOKE CAMERA *****");

	//TODO: bug here with the promise...
	cameraModule.takePicture()
		.then(function(r) {
			_viewData.set("imageSource", r);
		}, function() {
			console.log("***** ERROR *****", error);
		});

	//TODO... if on cancel... we should show the camera roll to choose a picture from...
}

function saveImageLocally(memeImageSource, imageName) {
	var saved = localStorage.saveTemplateLocally(imageName, memeImageSource);

	if (!saved) {
		console.log("Recent meme not saved....");
	} else {
		console.log("Recent template saved.");
	}
};

function goHome() {
	frameModule.topmost().navigate(global.baseViewDirectory + "home/home");
}