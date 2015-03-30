var applicationModule = require("application");
var frameModule = require("ui/frame");
var observableModule = require("data/observable");
var observableArray = require("data/observable-array");
var templates = require( "../components/templates/templates");

var data = new observableModule.Observable();
var templatesArray = new observableArray.ObservableArray([]);
templates.list().forEach(function(template) {
	templatesArray.push(template);
});

exports.load = function(args) {
	var page = args.object;
	data.set("templates", templatesArray);
	page.bindingContext = data;

	// Make sure we're on iOS before configuring the navigation bar
	if (applicationModule.ios) {
		page.ios.title = "MEME Generator";

		// Get access to the native iOS UINavigationController
		var controller = frameModule.topmost().ios.controller;

		// Call the UINavigationController's setNavigationBarHidden method
		controller.navigationBarHidden = false;
	}
};

exports.create = function() {
	frameModule.topmost().navigate("app/views/create");
};

exports.templateSelected = function(args) {
	var index = args.index;
	frameModule.topmost().navigate({
		moduleName: "app/views/create",
		context: index
	});
};