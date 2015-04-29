# 2015 TelerikNEXT NativeScript {N} Workshop - Lab #3
Contributors: [Clark Sell](http://csell.net) & [TJ Vantoll](http://tjvantoll.com/) & Sebastian Witalec. You can find us on Twitter at: [@csell5](https://twitter.com/csell5), [@tjvantoll](https://twitter.com/tjvantoll), [@sebawita](https://twitter.com/sebawita)

Tags: TelerikNEXT, NativeScript, {N}, JavaScript, CSS3, iOS, Android

## What are we learning?

In this lab we are going to learn about:

* Implementing MVVM with {N}
	* How to build an Observable ViewModel
	* How to connect a View to its ViewModel
	* (optional) More of the same but with TypeScript
* How to use Analytics
	* Creating Analytics Project
	* Linking it with your app
	* Tracking feature use and Exceptions
 
## Getting Setup
Create a new application in AppBuilder. [How to create a new application](http://backUpOne.com/backup)

{N} lab projects in Github:
* [Starting Project](http://tbd.com)
* [Finished Project](http://tbd.com)

## The Lab

### Step #0 - Examine the ViewModel of the Create Meme page
Go to app->components->create-meme folder and open "view-model.js"
Here you can see the code to create a new ViewModel

	var observable = require("data/observable");
	var viewModel = new observable.Observable();
	
And finally the ViewModel is exposed from the module, through:

	exports.viewModel = viewModel;

There are also few placeholders prepared to implement the functionality of the ViewModel:

**MODULE IMPORTS**: here is where we are going to import the required modules

**VIEW MODEL METHOD PLACEHOLDERS**: here is where we are going to implement the methods of the ViewModel

**EVENT HANDLER**: here is where we are going to add on property change handler

### Step #1 - [view-model.js] Copy imports

First we have to start with copying over the module imports from the beginning of create-meme.js.

Open create-meme.js and copy the first 6 lines (which import the required modules) and paste them in view-model.js just below //---MODULE IMPORTS---//

You should get something like:
	
	//---MODULE IMPORTS---//
	var imageManipulation = require("../image-manipulation/image-manipulation");
	var localStorage = require("../../shared/local-storage/local-storage");
	var socialShare = require("../social-share/social-share");
	var utilities = require("../../shared/utilities");
	var dialogsModule = require("ui/dialogs");

### Step #2 - [view-model.js] Implement prepareNewMeme

Let's start with implementing the method that should reset the ViewModel to default values and set the selectedImage as the basis for image manipulation.
This method will be called every time a new image is selected.

Let's start with adding prepareNewMeme function:

	viewModel.prepareNewMeme = function(selectedImage) {
	
	};

And now copy the contents of **exports.navigatedTo** into prepareNewMeme.

Finally we need to tweak it a bit:

a) SelectedImage assignment tweak

	_selectedImageSource = _page.navigationContext;

changes to:

	this.selectedImage = selectedImage;

b) Properties tweak

	_viewData.set("topText", "");
	_viewData.set("bottomText", "");
	_viewData.set("fontSize", 40);
	_viewData.set("isBlackText", false);
	_viewData.set("memeImage", _selectedImageSource);
changes to:

	this.set("topText", "");
	this.set("bottomText", "");
	this.set("fontSize", 40);
	this.set("isBlackText", false);
	this.set("memeImage", selectedImage);


c) Unique Image Name tweak

	_uniqueImageName = utilities.generateUUID() + ".png";

changes to:

	this.uniqueImageName = utilities.generateUUID() + ".png";


You probably noticed the pattern.
Change **_viewData** to **this** and place any variable inside this.
Also we no longer refernce the page, as the ViewModel shouldn't be aware of the view.

You are probably thinking what is the difference between **this.x = 1** and **this.set("x", 1);** and when to use which.
This is rather straight forward. 
The first approach is for internal use only: any changes to it shouldn't affect the UI, while the second one is meant to affect the UI, the UI components should be able to bind to it and any changes to it on the ViewModel side propagates the change to the View.

Here is how your prepareNewMeme should look like:

	//Prepare New Meme
	viewModel.prepareNewMeme = function(selectedImage) {
		this.selectedImage = selectedImage;
	
		this.set("topText", "");
		this.set("bottomText", "");
		this.set("fontSize", 40);
		this.set("isBlackText", false);
		this.set("memeImage", selectedImage);
	
		this.uniqueImageName = utilities.generateUUID() + ".png";
	};

### Step #3 - [view-model.js] Refresh Meme
From here things get even easier.

First add refreshMeme to the ViewModel

	viewModel.refreshMeme = function () {
		
	};
	
Now copy the contents from **refreshMeme** from edit-meme.js.
Replace **_viewData** with **viewModel** and replace **_selectedImageSource** with **viewModel.selectedImage**. Finally you should end up with something like:

	//Refresh Meme
	viewModel.refreshMeme = function () {
		var image = imageManipulation.addText(viewModel.selectedImage, viewModel.topText, viewModel.bottomText, viewModel.fontSize, viewModel.isBlackText);
	
		viewModel.set("memeImage", image);
	};

### Step #4 - [view-model.js] Save Locally

First add refreshMeme to the ViewModel

	viewModel.saveLocally = function () {
		
	};
	
Now copy the contents from **saveLocally** from edit-meme.js.

refreshMeme() is a function of the viewModel (not a global function), so we have to refer to it as this.refreshMeme().
Also the two parameters passed to localStorage.saveLocally come from the ViewModel, therefore we should change it to this.uniqueImageName and this.memeImage. As a result you should get:

	//Save Locally
	viewModel.saveLocally = function () {
		this.refreshMeme();
		var saved = localStorage.saveLocally(this.uniqueImageName, this.memeImage);
	
		if (!saved) {
			console.log("New meme not saved....");
		} else {
			var options = {
				title: "Meme Saved",
				message: "Congratulations, Meme Saved!",
				okButtonText: "OK"
			};
	
			dialogsModule.alert(options);
		}
	};

### Step #5 - [view-model.js] Share
This is the last and the easiest of the functions that we need to implement.

So this will be without a surprise that you should get something like:

	//Share
	viewModel.share = function() {
		socialShare.share(this.memeImage);
	}

### Step #6 - [view-model.js] On Property Changed

Add following code to the **//---EVENT HANDLER---//** section:

	//---EVENT HANDLER---//
	viewModel.addEventListener(observable.Observable.propertyChangeEvent, function(changes) {
		//skip if memeImage changes
		if (changes.propertyName === "memeImage") {
			return;
		}
		
		//Call refresh meme, but make sure it doesn't get called more often than every 200ms
		viewModel.refreshMeme();
	});

Few things worth noting:
You don't need to place the above code into another function. This piece of code will only execute once through the lifecycle of the app. This is because calling require on a module definition is only executed once, regardles of how many time it is required.

We call **viewModel.refreshMeme();** not **this.refreshMeme();** because propertyChangeEvent triggers a call back from a different scope, so **this** wouldn't be referring to the viewModel anymore.

The same propertyChangeEvent is raised regardless of which property of the ViewModel changes. This is why there is a bit of code that checks is the **propertyName** is "memeImage".

#### Step #7 - [create-meme.js] Add ViewModel
Open create-meme.js

We no longer need var _viewData, as this is replaced by our ViewModel. So replace

	var _viewData = new observable.Observable();
	
with

	var createMemeViewModel = require("./view-model").viewModel;

To explain the above. **require("./view-model")** retrieves our ViewModel Module. While **.viewModel** retrieves the exported viewModel instance.

#### Step #8 - [create-meme.js] loaded and navigatedTo

Now let's update **exports.loaded** function
bindingContex should be set to createMemeViewModel
and we no longer need the call to addRefreshOnChange, as that is handled inside the ViewModel.

You should end up with:

	exports.loaded = function(args) {
		_page = args.object;
		_page.bindingContext = createMemeViewModel;
	};

Now let's update **exports.navigatedTo** function
Everything that is happening in this function is handled by prepareNewMeme

So let's replace its content with a call to the viewModel.

You should get something like:

	exports.navigatedTo = function(args) {
		//grab the image from the navigation context.
		var selectedImage = _page.navigationContext;
		createMemeViewModel.prepareNewMeme(selectedImage);
	};


#### Step #9 - [create-meme.js] Clean up
Once we added the ViewModel, we no longer need the require imports at the top of the file, so delete them all, leaving only the one that loads the ViewModel.

Also we no longer need 
* function refreshMeme(), 
* exports.saveLocally(),
* exports.share() and
* function addRefreshOnChange()

Finally var _page is the only variable that we are still using, so delete the rest.

The final version of create-meme.js should look as follows:

	var createMemeViewModel = require("./view-model").viewModel;
	
	var _page;
	
	exports.loaded = function(args) {
		_page = args.object;
		_page.bindingContext = createMemeViewModel;
	};
	
	exports.navigatedTo = function(args) {
		//grab the image from the navigation context.
		var selectedImage = _page.navigationContext;
		createMemeViewModel.prepareNewMeme(selectedImage);
	};

#### Step #10 [create-meme.xml] Binding reference update
The final step is to setup bindings on the buttons.

Open crete-meme.xml and find the 2 button definitions. Change tap events bindings to the ViewModel functions, by adding {{ }} around the name of the function.

The buttons should look as follows:

	<Button text="Save" tap="{{ saveLocally }}" />
	<Button text="Share" tap="{{ share }}" />

Quick explanation:
**tap="{{ saveLocally }}"** means: on tap -> go to the ViewModel -> and call **viewModel.saveLocally**

#### Step #11 [view-model-v2.ts] ViewModel using TypeScript

Right click on **create-meme** folder -> Add -> New File. Select TypeScript and call it view-model-v2.ts

Now paste and save the following code:

	var imageManipulation = require("../image-manipulation/image-manipulation");
	var localStorage = require("../../shared/local-storage/local-storage");
	var socialShare = require("../social-share/social-share");
	var utilities = require("../../shared/utilities");
	var dialogsModule = require("ui/dialogs");
	var observable = require("data/observable");
	
	export class CreateMemeViewModel extends observable.Observable {
		public topText: string = "";
		public bottomText: string = "";
		public fontSize: number = 40;
		public isBlackText: boolean = false;
		private selectedImage: any;
		public memeImage: any;
		private uniqueImageName: string;
		
		public prepareEditor(image: any) {
			this.selectedImage = image;
	
			this.set("topText", "");
			this.set("bottomText", "");
		    this.set("fontSize", 40);
		    this.set("isBlackText", false);
			this.set("memeImage", image);
			
			this.refreshUniqueName();
		}
		
		public refreshMeme() {
			var image = imageManipulation.addText(
				this.selectedImage, this.topText, this.bottomText, this.fontSize, this.isBlackText);
	
			this.set("memeImage", image);
		}
		
		public addRefreshOnChange() {
			var viewModel = this;
			
			this.addEventListener(observable.Observable.propertyChange, function(changes) {
				//skip if memeImage changes
				if(changes.propertyName === "memeImage")
					return;
				
				viewModel.refreshMeme();
	        });
	    }
	
	    refreshUniqueName() {
			this.uniqueImageName = utilities.generateUUID() + ".png";
	    }
	
		public saveLocally() {
			this.refreshMeme();
			var saved = localStorage.saveLocally(this.uniqueImageName, this.memeImage);
	
			if (!saved) {
				console.log("New meme not saved....");
			} else {
				var options = {
					title: "Meme Saved",
					message: "Congratulations, Meme Saved!",
					okButtonText: "OK"
				};
	
				dialogsModule.alert(options);
			}
	    }
	
	    public share() {
	        socialShare.share(this.memeImage);
	    }
	}
	
	export var viewModel = new CreateMemeViewModel();
	viewModel.addRefreshOnChange();

Now expand view-model-v2.ts (you might need to right click on it and select "Compile to JavaScript" first) and open the .js file. This is the code that is generated from the TypeScript version.

#### Step #12 - Create Analytics project

Go back to Telerik Platform and create a new Analytics project and make sure to select **JavaScript** as the target platform.

[Instructions: How to Create a new Analytics Project] (http://docs.telerik.com/platform/help/projects/create/analytics-project)

Once the new project is ready go to Getting Started -> SDK. Note the string passed into createSettings

	var settings = _eqatec.createSettings("1234567890asdfghjkl23456789");

This is your Analytics Key. Make a copy of it, we will use it in a moment.

#### Step #13 - Add Analytics Key

Go back to your NativeScript project and then open app/shared/analytics.js.
Paste your Analytics key where it says **'analytics-key-here'**

This will link the Analytics Monitor with your Analytics project.

#### Step #14 - Add Analytics Module to create-meme

Open view-model.js in create-meme folder and add require the analytics module:

	var analyticsMonitor = require("../../shared/analytics");

From now you can:

* Track Feature Usage
	
		analyticsMonitor.trackFeature('MyCategory.MyFeature');

* Track Used Values

		analyticsMonitor.trackFeatureValue('MyCategory.MyValue', 1000);

* Track How Long It Takes To Run Something
	
		analyticsMonitor.trackFeatureStart('MyCategory.MyFeature');
		//Do something here
		analyticsMonitor.trackFeatureStop('MyCategory.MyFeature');

* Track Raised Exceptions

		analyticsMonitor.trackException(new Error('some error'), 'some error message');

or

		try {
			//do something
		} catch (exception) {
			analyticsMonitor.trackException(exception, 'some error message');
		}


**IMPORTANT**

	There is 1 day delay for the feature tracking to appear in the Analytics Portal, so please be patient.
	However you can see current and recently connected devices at Developer Reports -> Live

#### Step #15 Tracking the usage of saveLocally() and share()

Go to viewModel.saveLocally() and insert the following code, as the first line of the function:

	analyticsMonitor.trackFeature("CreateMeme.SaveLocally");
	

Now do the same for viewModel.share():

	analyticsMonitor.trackFeature("CreateMeme.Share");


This should look like:

	//Save Locally
	viewModel.saveLocally = function() {
		analyticsMonitor.trackFeature("CreateMeme.SaveLocally");
		this.refreshMeme();
		var saved = localStorage.saveLocally(this.uniqueImageName, this.memeImage);
	
		if (!saved) {
			console.log("New meme not saved....");
		} else {
			var options = {
				title: "Meme Saved",
				message: "Congratulations, Meme Saved!",
				okButtonText: "OK"
			};
	
			dialogsModule.alert(options);
		}
	}
	
	//Share
	viewModel.share = function() {
		analyticsMonitor.trackFeature("CreateMeme.Share");
		socialShare.share(this.memeImage);
	}
#### Step #16 Exception tracking for refreshMeme

Go to viewModel.refreshMeme() and wrap its content with try and catch (like it is shown in Step 14) and add an error message inside the trackException call.

You should get something like:

	viewModel.refreshMeme = function () {
		try {
			var image = imageManipulation.addText(viewModel.selectedImage, viewModel.topText, viewModel.bottomText, viewModel.fontSize, viewModel.isBlackText);
			viewModel.set("memeImage", image);
		} catch (exception) {
			analyticsMonitor.trackException(exception, 'Failed Refreshing Meme Image');
		}
	};

#### Step #17 Experiment with Analytics

It is up to you now to go around the project and experiment with Analytics. Try to look for other opportunities within this project to track features or exceptions. 

You can also check **app/components/home/home.js** and **app/components/create-template/create-template.js** and look for commented out code with analyticsMonitor.

## Resource List

* [Observable](http://docs.nativescript.org/ApiReference/data/observable/HOW-TO.html)
* [Analytics Overview] (http://docs.telerik.com/platform/analytics/getting-started/introduction)
* [Analytics SDK](http://docs.telerik.com/platform/analytics/sdk/js/classes/AnalyticsMonitor.html)
