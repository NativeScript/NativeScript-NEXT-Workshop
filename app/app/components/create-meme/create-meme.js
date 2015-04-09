var imageSourceModule = require("image-source");
var cameraModule = require("camera");
var dialogsModule = require("ui/dialogs");

var localStorage = require( "../local-storage/local-storage");
var imageManipulation = require("../image-manipulation/image-manipulation");
var socialShare = require("../social-share/social-share");
var utilities = require( "../../shared/utilities");

var observableModule = require("data/observable");
var _viewData = new observableModule.Observable();

var _page,
	_origImageSource,
	_uniqueImageNameForSession,
	_initialised = false;

exports.loaded = function(args) {
	_page = args.object;
	_page.bindingContext = _viewData;

	// run this code only once
	if(! _initialised) {
		_initialised = true;
		addRefreshOnChange();
	}
};

exports.navigatedTo = function(args) {

	//grab the image from the navigation context.
	var selectedImageSource = _page.navigationContext;
	
	//Save off the original...
	_origImageSource = selectedImageSource;

	_viewData.set("topText", "");
	_viewData.set("bottomText", "");
	_viewData.set("fontSize", 40);
	_viewData.set("isBlackText", false);
	_viewData.set("imageSource", selectedImageSource);
	
	_uniqueImageNameForSession = utilities.generateUUID() + ".png";
};

function addRefreshOnChange() {
	_viewData.addEventListener(observableModule.knownEvents.propertyChange, function(changes) {
		//skip if imageSource changes
		if(changes.propertyName === "imageSource")
			return;

		refreshMeme();
	});
}

function refreshMeme() {
	var image = imageManipulation.addText(
		_origImageSource,
		_viewData.get("topText"),
		_viewData.get("bottomText"),
		_viewData.get("fontSize"),
		_viewData.get("isBlackText")
	);
	_viewData.set("imageSource", image);
};

//Save to localStorage
exports.saveLocally = function() {
	refreshMeme();
	var saved = localStorage.saveLocally(_uniqueImageNameForSession, _viewData.get("imageSource"));

	if (!saved) {
		console.log("New meme not saved....");
	} else {
		var options = {
		    title: "Meme Saved",
		    message: "Congratulations, Meme Saved!",
		    okButtonText: "OK"
		};

		dialogsModule.alert(options);
	}
};

exports.share = function() {
	socialShare.share(_viewData.get("imageSource"));
};