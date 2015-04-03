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
	camera.takePicture().then(function(r) {
		data.set("imageSource", r);
	}, function(e) {
		alert("An error occurred taking the photo");
	});
}

exports.navigatedTo = function(args) {
	var page = args.object;
	var index = page.navigationContext;
	data.set("topText", "");
	data.set("bottomText", "");

	if (typeof index == "number") {
		templateIndex = index;
		data.set("imageSource", templates.getByIndex(index).source);
	} else {
		templateIndex = null;
		data.set("imageSource", null);
		invokeCamera();
	}
};

exports.save = function() {
	var image = imageManipulation.addText(
		templateIndex ? templates.getByIndex(templateIndex).source :
			data.get("imageSource"),
		data.get("topText"),
		data.get("bottomText")
	);
	data.set("imageSource", image);
};

exports.share = function() {
	socialShare.share(data.get("imageSource"));
};
