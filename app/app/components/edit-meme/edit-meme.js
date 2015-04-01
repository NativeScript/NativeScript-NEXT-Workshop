var camera = require("camera");
var imageManipulation = require("../image-manipulation/image-manipulation");
var observableModule = require("data/observable");
var socialShare = require("../social-share/social-share");
var templates = require("../templates/templates");

var data = new observableModule.Observable();
var templateIndex;

exports.loaded = function(args) {
	var page = args.object;
	page.bindingContext = data;
};

function invokeCamera() {
	// This just completely crashes. WHY???
	/*
	camera.takePicture().then(function() {
		data.set("imageSource", source);
		// TODO: Save the picture as a template
	});
	*/
}

exports.navigatedTo = function(args) {
	var page = args.object;
	var index = page.navigationContext;
	if (typeof index == "number") {
		templateIndex = index;
		data.set("imageSource", templates.getByIndex(index).source);
	} else {
		data.set("imageSource", null);
		invokeCamera();
	}
};

exports.save = function() {
	var image = imageManipulation.addText(
		templates.getByIndex(templateIndex).source,
		data.get("topText"),
		data.get("bottomText")
	);
	data.set("imageSource", image);
};

exports.share = function() {
	socialShare.share(data.get("imageSource"));
};
