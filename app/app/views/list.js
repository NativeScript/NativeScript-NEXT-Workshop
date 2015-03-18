var applicationModule = require("application");
var frameModule = require("ui/frame");
var observableModule = require("data/observable");
var observableArray = require("data/observable-array");

var data = new observableModule.Observable();
var memes = new observableArray.ObservableArray([]);
data.set("memes", memes);

exports.load = function(args) {
	var page = args.object;
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
