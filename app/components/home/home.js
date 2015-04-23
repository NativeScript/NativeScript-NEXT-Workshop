var applicationModule = require("application");
var imageModule = require("ui/image");
var gesturesModule = require("ui/gestures");
var dialogsModule = require("ui/dialogs");

var colorModule = require("color");
var frameModule = require("ui/frame");

var navigation = require( "../../shared/navigation");
var templates = require( "../../shared/templates/templates");
var localStorage = require( "../../shared/local-storage/local-storage");
var socialShare = require("../social-share/social-share");
var analyticsMonitor = require("../../shared/analytics");

var _page;

exports.load = function(args) {
	_page = args.object;
	_page.onNavigatingFrom = function(){};

	// Make sure we're on iOS before configuring the navigation bar
	var controller = frameModule.topmost().ios;
	//controller.showNavigationBar = false;

	controller.showNavigationBar = false;

 	console.log("frameModule controller::", controller);
 	//console.log("frameModule frame::", Object.keys(frameModule.Frame));
 	//console.log("frameModule topmost::", Object.keys(frameModule.topmost().ios));
 	

	/*
	if (applicationModule.ios) {
		
		// Temp CODE
		_page.ios.title = "Meme";
		console.log("page" ,_page.ios);

		var controller = frameModule.topmost().ios.controller;
		var navigationItem = controller.visibleViewController.navigationItem;
		navigationItem.setHidesBackButtonAnimated(true, false);

		var navBar = controller.navigationBar;
		navBar.barTintColor = UIColor.colorWithRedGreenBlueAlpha(0.86, 0.20, 0.25, 1);
		navBar.titleTextAttributes =
			new NSDictionary([UIColor.whiteColor()],
				[NSForegroundColorAttributeName]);

		navBar.barStyle = 1;
		navBar.tintColor = UIColor.whiteColor();
		
		// creates item with UIBarButtonSystemItemAction icon
		var shareItem = new UIBarButtonItem(UIBarButtonSystemItem.UIBarButtonSystemItemEdit, null, null);

		// add item to navigation bar
		var actionButtonItems = [shareItem];
		navigationItem.rightBarButtonItems = actionButtonItems;
	}
	*/
};

exports.navigatedTo = function(args){
	populateTemplates();
	populateMyMemes();
}

exports.createNewTemplate = function() {
	navigation.goCreateTemplate();

	analyticsMonitor.trackFeature("Home.Template.CreateNew");
};

function populateTemplates() {
	//Get our parrent element such that we can add our items to it dynamically
	var container = _page.getViewById("templateContainer");
	clearOldMemes(container);
	
	templates.getTemplates(function(imageSource){
		var image = new imageModule.Image();
		image.imageSource = imageSource;
		
		image.observe(gesturesModule.GestureTypes.Tap, function () { 
			templateSelected(imageSource); 
		});
				
		//add to the element.
		container.addChild(image);
	});
}

function populateMyMemes() {
	//Get our parent element such that we can add our items to it dynamically
	var container = _page.getViewById("myMemeContainer");
	clearOldMemes(container);

	templates.getMyMemes(function(imageSource, fileName){
		//Create a new image element 
		var image = new imageModule.Image();
		image.imageSource = imageSource;

		//What do to...  share delete?
		image.observe(gesturesModule.GestureTypes.Tap, function () {
		 	myMemesActionSheet(imageSource, fileName); 
		});
		
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
				analyticsMonitor.trackFeature("Home.MemesOptions.Delete");
				break;
			case "Share" : 
				shareMeme(imageSource);
				analyticsMonitor.trackFeature("Home.MemesOptions.ShareMeme");
				break;
			case "Delete All" : 
				deleteAllMemes();
				analyticsMonitor.trackFeature("Home.MemesOptions.DeleteAllMemes");
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
		analyticsMonitor.trackFeature("Home.TemplateSelected");
		navigation.goCreateMeme(selectedImageSource);
	}
}