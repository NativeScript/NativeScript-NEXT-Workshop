var applicationModule = require("application");
var frameModule = require("ui/frame");
var imageModule = require("ui/image");
var gesturesModule = require("ui/gestures");
var dialogsModule = require("ui/dialogs");
var observableModule = require("data/observable");
var observableArray = require("data/observable-array");

var templates = require( "../templates/templates");
var socialShare = require("../social-share/social-share");

var fs = require("file-system");
var imageSource = require("image-source");

var _page;

/*
	1. pull images from responsive images.
*/

exports.load = function(args) {
	_page = args.object;

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
				recentMemes.push({ source: source, fileName: entity.name });
		    });
		}).then(function () {
			recentMemes.forEach(function(meme) {			
				//Create a new image element 
				var image = new imageModule.Image();
				image.source = meme.source;

				//What do to...  share delete?
				var observer = image.observe(gesturesModule.GestureTypes.Tap, function () { myMemesActionSheet(meme.source, meme.fileName) });
				
				//add to the element.
				recentMemeContainer.addChild(image);	
			});
		}).catch(function (error) {
			console.log("***** ERROR:", error);
		});
}

function myMemesActionSheet (imageSource, imageFileName) {
	var options = {
	    title: "My Memes",
	    message: "What Do You Want To Do?",
	    cancelButtonText: "Cancel",
	    actions: ["Delete", "Share"]
	};
	
	dialogsModule.action(options).then(function (result) {
    	switch (result) {
    		case "Delete" :
    			deleteMeme(imageFileName);
    			break;
    		case "Share" : 
    			shareMeme(imageSource);
    			break;
    	}
	});
}

function shareMeme(imageSource) {
	socialShare.share(imageSource);
}

function deleteMeme(imageFileName) {
	var documents = fs.knownFolders.documents();
	var recentMemeFolder = documents.getFolder(global.recentMemeFolderName);

	var file = recentMemeFolder.getFile(imageFileName);
	file.remove().then(function (result) {
	    console.log("Meme Removed")
	    
	    //Repopulate the screen
	    populateRecentMemes();

	}, function (error) {
	    console.log("***** ERROR *****", error);
	});
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