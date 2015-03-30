var applicationModule = require("application");
var frameModule = require("ui/frame");
var imageSource = require("image-source");
var observableModule = require("data/observable");
var observableArray = require("data/observable-array");

var data = new observableModule.Observable();
var templates = new observableArray.ObservableArray([]);

for (var i = 0; i <= 11; i++) {
	var source = imageSource.fromFile("~/app/images/templates/" + i + ".png");
	templates.push({ source: source });
}

// Why doesn't this work...?
// templates.push({ url: "https://bs3.cdn.telerik.com/v1/MRAN03IikvuJWlLT/fd21bda0-d706-11e4-90e9-d96e92f3b4c7" });
data.set("templates", templates);

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
