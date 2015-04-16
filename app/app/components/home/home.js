var applicationModule = require("application");
var navigation = require( "../../shared/navigation");
var imageModule = require("ui/image");
var gesturesModule = require("ui/gestures");
var dialogsModule = require("ui/dialogs");

var templates = require( "../../shared/templates/templates");
var localStorage = require( "../../shared/local-storage/local-storage");
var socialShare = require("../social-share/social-share");

var _page;
var _observers;
var _containers;

exports.load = function(args) {
	_page = args.object;
	
	_observers = [];
	_containers = [];

	_page.onNavigatingFrom = function(){
		_observers.forEach(function(observer){
			observer.disconnect();
		});

		_containers.forEach(function(container){
			clearOldMemes(container);
		});
	};

	// Make sure we're on iOS before configuring the navigation bar
	if (applicationModule.ios) {
		navigation.hideIOSNavigationBar();
	}

	populateTemplates();
	populateMyMemes();
};

exports.createNewTemplate = function() {
	navigation.goCreateTemplate();
};

function populateTemplates() {
	//Get our parrent element such that we can add our items to it dynamically
	var container = _page.getViewById("templateContainer");
	//clearOldMemes(container);
	_containers.push(container);
	
	templates.getTemplates(function(imageSource){

		var image = new imageModule.Image();
		image.source = imageSource;
			
		//_observers.push(image.observe(gesturesModule.GestureTypes.Tap, function () { templateSelected(imageSource) }));
		image.observe(gesturesModule.GestureTypes.Tap, function () { templateSelected(imageSource) });
				
		//add to the element.
		container.addChild(image);
	});
}

function populateMyMemes() {
	//Get our parent element such that we can add our items to it dynamically
	var container = _page.getViewById("myMemeContainer");
	//clearOldMemes(container);
	_containers.push(container);

	templates.getMyMemes(function(imageSource, fileName){
		//Create a new image element 
		var image = new imageModule.Image();
		image.source = imageSource;

		//What do to...  share delete?
		//_observers.push(image.observe(gesturesModule.GestureTypes.Tap, function () { myMemesActionSheet(imageSource, fileName) }));
		image.observe(gesturesModule.GestureTypes.Tap, function () { myMemesActionSheet(imageSource, fileName) });
		
		//add to the element.
		container.addChild(image);
	});
}

function myMemesActionSheet (imageSource, imageFileName) {
	var options = {
		title: "My Memes",
		message: "What Do You Want To Do?",
		cancelButtonText: "Cancel",
		actions: ["Delete", "Delete All", "Share"]
	};
	
	dialogsModule.action(options).then(function (result) {
		switch (result) {
			case "Delete" :
				deleteMeme(imageFileName);
				break;
			case "Share" : 
				shareMeme(imageSource);
				break;
			case "Delete All" : 
				deleteAllMemes();
				break;
		}
	});
}

function shareMeme(imageSource) {
	socialShare.share(imageSource);
}

function deleteMeme(imageFileName) {
	localStorage.deleteMeme(imageFileName)
		.then(function (result) {
			console.log("Meme Removed")

			//Repopulate the screen
			populateMyMemes();

		}).catch(function (error) {
			console.log("***** ERROR:", error);
		});
}

function deleteAllMemes() {

	dialogsModule.confirm("Are you sure?")
		.then(function (result) {
			if(result) {
				localStorage.deleteAllMemes().then(function () {
					console.log("Folder Cleared")

					//Repopulate the screen
					populateMyMemes();
				}).catch(function (error) {
					console.log("***** ERROR:", error);
				});
			}
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
	console.log("***** Clearing X children:", container.getChildrenCount());
	
	for (var i = container.getChildrenCount() - 1; i >= 0; i-- ) {
		var childItem = container.getChildAt(i);
		
		//DO we need to remove the tap event listener to keep us from creating a memory leak...
		container.removeChild(childItem);
	}
}

function templateSelected(selectedImageSource) {
	if ( selectedImageSource ) {
		navigation.goCreateMeme(selectedImageSource);
	}
}