var observableModule = require("data/observable");
var templates = require("../components/templates/templates");

var data = new observableModule.Observable();

exports.loaded = function(args) {
	var page = args.object;
	page.bindingContext = data;
};

// TODO: When there is no index invoke the camera
exports.navigatedTo = function(args) {
	var page = args.object;
	var index = page.navigationContext;
	data.set("imageSource", templates.getByIndex(index).source);
}

