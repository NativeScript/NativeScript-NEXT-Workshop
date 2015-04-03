var camera = require("camera");
var imageManipulation = require("../image-manipulation/image-manipulation");
var observableModule = require("data/observable");
var templates = require("../templates/templates");

var data = new observableModule.Observable();
var templateIndex;

var _page;

exports.loaded = function(args) {
	_page = args.object;
	_page.bindingContext = data;
};

function invokeCamera() {
	camera.takePicture().then(function() {
		// TODO: Save the picture as a template and then set it as the
		// page's imageSource.
	});
}

exports.navigatedTo = function(args) {
	var selectedImageSource = _page.navigationContext;

	if ( selectedImageSource ) {
		data.set("imageSource", selectedImageSource);
	} else {
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

};
