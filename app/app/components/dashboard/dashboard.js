var applicationModule = require("application");
var frameModule = require("ui/frame");
var imageModule = require("ui/image");
var gestures = require("ui/gestures");
var observableModule = require("data/observable");
var observableArray = require("data/observable-array");

var templates = require( "../templates/templates");

var fs = require("file-system");
var imageSource = require("image-source");

var _page;

/*
	0. add onloading
	1. pull images from responsive images.
	2. do not repop the array if there is something already there.
	3. sizes on the main screen
*/

exports.load = function(args) {
	_page = args.object;
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
};

exports.navigatedTo = function (args) {
	populateMemeTemplates();
	populateRecentMemes();
};

exports.create = function() {
	frameModule.topmost().navigate(global.baseViewDirectory + "edit-meme/edit-meme");
};

function populateMemeTemplates() {
	//Get our parrent element such that we can add our items to it dynamically
	var memeContainer = _page.getViewById("memeContainer");
    
    clearOldMemes(memeContainer);

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
}

function populateRecentMemes() {
	console.log("<><> Populating Recent Memes <><>");

	//Get our parrent element such that we can add our items to it dynamically
	var recentMemeContainer = _page.getViewById("recentMemeContainer");
    clearOldMemes(recentMemeContainer);

	var recentMemes = [];
	var documents = fs.knownFolders.documents();
	var recentMemeFolder = documents.getFolder(global.recentMemeFolderName);

	recentMemeFolder.getEntities()
		.then(function (entities) {
			console.log("****** in first then");
		    entities.forEach(function (entity) {
		    	var source = imageSource.fromFile(entity.path);	
				recentMemes.push({ source: source });
		    });
		}).then(function () {
			console.log("****** in second then");
			recentMemes.forEach(function(meme) {			
				console.log("****** Creating Images");

				//Create a new image element 
				var image = new imageModule.Image();
				image.source = meme.source;

				//What do to...  share delete?
				var observer = image.observe(gestures.GestureTypes.Tap, function () { templateSelected(image.source) });
				
				//add to the element.
				recentMemeContainer.addChild(image);	
			});
		}).catch(function (error) {
			console.log("***** ERROR:", error);
		});
}

function clearOldMemes(container) {
    /*
    var items = container._subViews;
    //TNS wrap doesn't seem to like this...
    items.splice(0, items.length);
	*/
	console.log("***** clearing child elements:", container.getChildrenCount());
	if (container.getChildrenCount() > 0 ) {
		for (var i = 0; i < container.getChildrenCount(); i++) {
			container.removeChild(container.getChildAt(i)); 
		}
	}
}

function templateSelected(selectedImageSource) {
	
	if ( selectedImageSource) {
		frameModule.topmost().navigate({
			moduleName: global.baseViewDirectory + "edit-meme/edit-meme",
			context: selectedImageSource
		});
	}
};