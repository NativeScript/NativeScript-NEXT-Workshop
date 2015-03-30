var camera = require("camera");
var observableModule = require("data/observable");
var templates = require("../templates/templates");

var data = new observableModule.Observable();

exports.loaded = function(args) {
	var page = args.object;
	page.bindingContext = data;
};

function invokeCamera() {
	camera.takePicture().then(function() {
		// TODO: Implement
	});
}

exports.navigatedTo = function(args) {
	var page = args.object;
	var index = page.navigationContext;
	if (typeof index == "number") {
		data.set("imageSource", templates.getByIndex(index).source);
	} else {
		invokeCamera();
	}
};
