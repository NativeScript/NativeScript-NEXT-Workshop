var camera = require("camera");
var imageManipulation = require("../image-manipulation/image-manipulation");
var observableModule = require("data/observable");
var templates = require("../templates/templates");

var data = new observableModule.Observable();
var templateIndex;

exports.loaded = function(args) {
	var page = args.object;
	page.bindingContext = data;
};

function invokeCamera() {
	camera.takePicture().then(function() {
		// TODO: Save the picture as a template and then set it as the
		// page's imageSource.
	});
}

exports.navigatedTo = function(args) {
	var page = args.object;
	var index = page.navigationContext;
	if (typeof index == "number") {
		templateIndex = index;
		data.set("imageSource", templates.getByIndex(index).source);
	} else {
		invokeCamera();
	}
};

exports.save = function() {
	imageManipulation.addText(
		templateIndex,
		data.get("topText"),
		data.get("bottomText")
	);
}