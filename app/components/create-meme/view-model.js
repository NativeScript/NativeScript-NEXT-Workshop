var imageManipulation = require("../image-manipulation/image-manipulation");
var localStorage = require("../../shared/local-storage/local-storage");
var socialShare = require("../social-share/social-share");
var utilities = require("../../shared/utilities");
var dialogsModule = require("ui/dialogs");
var analyticsMonitor = require("../../shared/analytics");

var observable = require("data/observable");
var viewModel = new observable.Observable();

viewModel.prepareNewMeme = function(selectedImage) {
	this.selectedImage = selectedImage;

	this.set("topText", "");
	this.set("bottomText", "");
	this.set("fontSize", 50);
	this.set("isBlackText", false);
	this.set("memeImage", selectedImage);

	this.uniqueImageName = utilities.generateUUID() + ".png";
};

viewModel.refreshMeme = function () {
	var image = imageManipulation.addText(viewModel.selectedImage, viewModel.topText, viewModel.bottomText, viewModel.fontSize, viewModel.isBlackText);

	viewModel.set("memeImage", image);
};

viewModel.saveLocally = function () {
	analyticsMonitor.trackFeature("CreateMeme.SaveLocally");
	this.refreshMeme();
	var saved = localStorage.saveLocally(this.uniqueImageName, this.memeImage);

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

viewModel.share = function() {
	analyticsMonitor.trackFeature("CreateMeme.Share");
	socialShare.share(this.memeImage);
};

//Add event listener to refresh the memeImage every time there is a change to the params
viewModel.addEventListener(observable.Observable.propertyChangeEvent, function(changes) {
	//skip if memeImage changes
	if (changes.propertyName === "memeImage") {
		return;
	}

	//Call refresh meme, but make sure it doesn't get called more often than every 200ms
	callOncePerGivenTime(viewModel.refreshMeme, 200);
});

var shouldDelayNextCall = false;
var additonalUpdateRequested = false;
function callOncePerGivenTime(delegate, delay) {
	//skip if an update has already been requested
	if (shouldDelayNextCall) {
		additonalUpdateRequested = true;
		return;
	}

	shouldDelayNextCall = true;

	// call the function here
	delegate();

	//delay the next call by a bit it, to make the app a bit more cost effective
	setTimeout(function() {
		shouldDelayNextCall = false;

		//call the function again in case there was a request during the blocking period
		if (additonalUpdateRequested) {
			additonalUpdateRequested = false;
			delegate();
		}
	}, delay);
}
/*
// Calls the function with a delay, blocking all the other requests in the mean time
function callOncePerGivenTimeSimple(delegate, delay) {
	//skip if already requested
	if (shouldDelayNextCall) {
		return;
	}

	shouldDelayNextCall = true;

	// call the function with a delay
	setTimeout(function() {
		shouldDelayNextCall = false;
		delegate();
	}, delay);
}
*/
exports.viewModel = viewModel;
