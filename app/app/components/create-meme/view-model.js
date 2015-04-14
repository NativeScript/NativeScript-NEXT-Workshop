var observable = require("data/observable");
var imageManipulation = require("../image-manipulation/image-manipulation");
var localStorage = require( "../../shared/local-storage/local-storage");
var socialShare = require("../social-share/social-share");
var utilities = require( "../../shared/utilities");
var dialogsModule = require("ui/dialogs");

var viewModel = new observable.Observable();

viewModel.prepareNewMeme = function(baseImage) {
	this.selectedImage = baseImage;

    this.set("topText", "");
    this.set("bottomText", "");
    this.set("fontSize", 40);
    this.set("isBlackText", false);
    this.set("memeImage", baseImage);

    this.uniqueImageName = utilities.generateUUID() + ".png";
};

viewModel.refreshMeme = function () {
    var image = imageManipulation.addText(this.selectedImage, this.topText, this.bottomText, this.fontSize, this.isBlackText);

    this.set("memeImage", image);
};

viewModel.saveLocally = function () {
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
	socialShare.share(this.memeImage);
};

//Add event listener to refresh the memeImage every time there is a change to the params
viewModel.addEventListener(observable.knownEvents.propertyChange, function (changes) {
    //skip if memeImage changes
    if (changes.propertyName === "memeImage")
        return;

    viewModel.refreshMeme();
});

exports.viewModel = viewModel;