var camera = require("camera");
var imageManipulation = require("../image-manipulation/image-manipulation");
var observableModule = require("data/observable");
var socialShare = require("../social-share/social-share");
var templates = require("../templates/templates");

var imageSourceModule = require("image-source");
var fs = require("file-system");

var data = new observableModule.Observable();
var templateIndex;

var _page;
var _origImageSource;
var _uniqueImageNameForSession;
var _initialised = false;

exports.loaded = function(args) {
	_page = args.object;
	_page.bindingContext = data;
    
	// run this code only once
	if(! _initialised) {
		_initialised = true;
    	addRefreshOnChange();
	}
};

function invokeCamera() {
	camera.takePicture().then(function(r) {
		data.set("imageSource", r);
		_origImageSource = r;
	}, function(e) {
		alert("An error occurred taking the photo");
	});
}

exports.navigatedTo = function(args) {

	//grab the image from the navigation context.
	var selectedImageSource = _page.navigationContext;
	//Save off the original...
	_origImageSource = selectedImageSource;

	data.set("topText", "");
	data.set("bottomText", "");
    data.set("fontSize", 40);
    data.set("isBlackText", false);

	if ( selectedImageSource ) {
		data.set("imageSource", selectedImageSource);
	} else {
		templateIndex = null;
		data.set("imageSource", null);
		invokeCamera();
	}
    
    _uniqueImageNameForSession = generateUUID() + ".png";
};

function addRefreshOnChange() {
	data.addEventListener(observableModule.knownEvents.propertyChange, function(changes) {
		//skip if imageSource changes
		if(changes.propertyName === "imageSource")
			return;

		refreshMeme();
	});
}

function refreshMeme() {
	var image = imageManipulation.addText(
		_origImageSource,
		data.get("topText"),
		data.get("bottomText"),
        data.get("fontSize"),
        data.get("isBlackText")
	);
	data.set("imageSource", image);
};


exports.save = function() {
    refreshMeme();
    
	//Save locally
	saveImageLocally(data.get("imageSource"), _uniqueImageNameForSession);
};

exports.share = function() {
	socialShare.share(data.get("imageSource"));
};

exports.deleteImage = function () {

};

function saveImageLocally(memeImageSource, imageName) {

	var documents = fs.knownFolders.documents();
	var recentMemeFolder = documents.getFolder(global.recentMemeFolderName);
	var fullPath = fs.path.join(documents.path, global.recentMemeFolderName, imageName);
	
	var saved = memeImageSource.saveToFile(fullPath, imageSourceModule.ImageFormat.PNG);
	
	if (!saved) {
		console.log("Recent meme not saved....");
	} else {
		console.log("Recent Meme Saved To:", fullPath);
	}
};

function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};