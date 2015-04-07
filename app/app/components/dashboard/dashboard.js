var applicationModule = require("application");
var frameModule = require("ui/frame");
var imageModule = require("ui/image");
var gesturesModule = require("ui/gestures");
var dialogsModule = require("ui/dialogs");
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
		// Get access to the native iOS UINavigationController
		var controller = frameModule.topmost().ios.controller;

		// Call the UINavigationController's setNavigationBarHidden method
		controller.navigationBarHidden = true;
	}

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
		var observer = image.observe(gesturesModule.GestureTypes.Tap, function () { templateSelected(image.source) });
		
		//add to the element.
		memeContainer.addChild(image);	
	});
}

//TODO: this should navigate to a new page. not the edit meme.
function populateRecentMemes() {
	//Get our parrent element such that we can add our items to it dynamically
	var recentMemeContainer = _page.getViewById("recentMemeContainer");
	clearOldMemes(recentMemeContainer);

	var recentMemes = [];
	var documents = fs.knownFolders.documents();
	var recentMemeFolder = documents.getFolder(global.recentMemeFolderName);

	recentMemeFolder.getEntities()
		.then(function (entities) {
			entities.forEach(function (entity) {
		    	var source = imageSource.fromFile(entity.path);	
				recentMemes.push({ source: source });
		    });
		}).then(function () {
			recentMemes.forEach(function(meme) {			
				//Create a new image element 
				var image = new imageModule.Image();
				image.source = meme.source;

				//What do to...  share delete?
				var observer = image.observe(gesturesModule.GestureTypes.Tap, myMemesActionSheet );
				
				//add to the element.
				recentMemeContainer.addChild(image);	
			});
		}).catch(function (error) {
			console.log("***** ERROR:", error);
		});
}

function myMemesActionSheet () {
	var options = {
	    title: "My Memes",
	    message: "What Do You Want To Do?",
	    cancelButtonText: "Cancel",
	    actions: ["Delete", "Share"]
	};
	
	dialogsModule.action(options).then(function (result) {
    	switch (result) {
    		case "Delete" :
    			deleteMeme();
    			break;
    		case "Share" : 
    			shareMeme();
    			break;
    	}
	});
}

function shareMeme() {
	console.log("SHARE MEME CALLED");
}

function deleteMeme() {
	console.log("DELETE MEME CALLED");
}

function clearOldMemes(container) {
	/*
	//you could loop through like this but the visual tree will have to reindex the items and shift things
	while (container.getChildrenCount() > 0) {
		container.removeChild(container.getChildAt(0));
	}
	*/

	//Or just work backwards picking off the back
	
	for (var i = container.getChildrenCount() - 1; i >= 0; i-- ) {
		container.removeChild(container.getChildAt(i));
	}
}

function templateSelected(selectedImageSource) {
	
	if ( selectedImageSource ) {
		frameModule.topmost().navigate({
			moduleName: global.baseViewDirectory + "edit-meme/edit-meme",
			context: selectedImageSource
		});
	}
}