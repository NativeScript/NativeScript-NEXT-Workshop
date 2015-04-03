var applicationModule = require("application");

var frameModule = require("ui/frame");
var imageModule = require("ui/image");
var gestures = require("ui/gestures");

var observableModule = require("data/observable");
var observableArray = require("data/observable-array");

var templates = require( "../templates/templates");

/*
var data = new observableModule.Observable();
var templatesArray = new observableArray.ObservableArray([]);

templates.list().forEach(function(template) {
	templatesArray.push(template);
});
*/

var page;

exports.load = function(args) {
	page = args.object;
	//data.set("templates", templatesArray);
	//page.bindingContext = data;

	// Make sure we're on iOS before configuring the navigation bar
	if (applicationModule.ios) {
		//Do we want this??? takes up a lot of pixels
		//page.ios.title = "MEME Generator";

		// Get access to the native iOS UINavigationController
		var controller = frameModule.topmost().ios.controller;

		// Call the UINavigationController's setNavigationBarHidden method
		controller.navigationBarHidden = true;
	}

	//Get our parrent element such that we can add our items to it dynamically
	var memeContainer = page.getViewById("memeContainer");			

	//TODO: get the template from BES
	templates.list().forEach(function(template) {
		
		//Create a new image element 
		var image = new imageModule.Image();
		image.source = template.source;

		//Add the gesture to the image such that we can interact with it.
		var observer = image.observe(gestures.GestureTypes.Tap, function () { templateSelected(image.source) });
		
		//add to the element.
		memeContainer.addChild(image);	
	});
};

exports.create = function() {
	frameModule.topmost().navigate("app/components/edit-meme/edit-meme");
};

function templateSelected(args) {
	
	var selectedImageSource = args;
	frameModule.topmost().navigate({
		moduleName: "app/components/edit-meme/edit-meme",
		context: selectedImageSource
	});
	
};