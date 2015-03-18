var camera = require("camera");
var observableModule = require("data/observable");
var data = new observableModule.Observable();

exports.load = function(args) {
	var page = args.object;
	page.bindingContext = data;
};

exports.takePicture = function() {
	camera.takePicture().then(function(result) {

	});
};
