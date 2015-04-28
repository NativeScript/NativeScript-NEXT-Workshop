# 2015 TelerikNEXT NativeScript {N} Workshop - Lab #3
Contributors: [Clark Sell](http://csell.net) & [TJ Vantoll](http://tjvantoll.com/) & Sebastian Witalec. You can find us on Twitter at: [@csell5](https://twitter.com/csell5), [@tjvantoll](https://twitter.com/tjvantoll), [@sebawita](https://twitter.com/sebawita)

Tags: TelerikNEXT, NativeScript, {N}, JavaScript, CSS3, iOS, Android

## What are we learning?

In this lab we are going to learn about:

* Implementing MVVM with {N}
	* How to build an Observable ViewModel
	* How to connect a View to its ViewModel
	* (optional) More of the same but with TypeScript
* How to add Analytics
	* Importing analytics (external JS library)
	* Wrapping it in a module
	* Tracking feature use
	* Tracking Exceptions
 
## Getting Setup
Create a new application in AppBuilder. [How to create a new application](http://backUpOne.com/backup)

{N} lab projects in Github:
* [Starting Project](http://tbd.com)
* [Finished Project](http://tbd.com)

## The Lab

### Step #0 - Examine the ViewModel of the Create Meme page
Go to app->components->create-meme folder and open "view-model.js"
Here you can see the code to create a new ViewModel

	var observableModule = require("data/observable");
	var viewModel = new observableModule.Observable();
	
And finally the ViewModel is exposed from the module, through:

	exports.viewModel = viewModel;

There are also few placeholders prepared to implement the functionality of the ViewModel:

**MODULE IMPORTS**: here is where we are going to import the required modules

**VIEW MODEL METHOD PLACEHOLDERS**: here is where we are going to implement the methods of the ViewModel

**EVENT HANDLER**: here is where we are going to add on property change handler

### Step #1 - Copy imports

First we have to start with copying over the module imports from the beginning of create-meme.js.

Open create-meme.js and copy the first 6 lines (which import the required modules) and paste them in view-model.js just below //---MODULE IMPORTS---//

### Step #2 - Implement prepareNewMeme

Let's start with implementing the method that should reset the ViewModel to default values and set the selectedImage as the basis for image manipulation.
This method will be called every time a new image is selected.

Let's start with adding prepareNewMeme function:

	viewModel.prepareNewMeme = function(selectedImage) {
	
	};

And now copy the contents of **exports.navigatedTo** into prepareNewMeme.

Finally we need to tweak it a bit:

a) 

	_selectedImageSource = _page.navigationContext;

changes to:

	this.selectedImage = selectedImage;

b)

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


c)

	_uniqueImageName = utilities.generateUUID() + ".png";

changes to:

	this.uniqueImageName = utilities.generateUUID() + ".png";


You probably noticed the pattern.
Change _viewData to this and place any variable inside this.
Also we no longer refernce the page, as the ViewModel shouldn't be aware of the view.

You are probably thinking what is the difference between **this.x = 1** and **this.set("x", 1);** and when to use which.
This is rather straight forward. 
The first approach is for internal use only: any changes to it shouldn't affect the UI, while the second one is meant to affect the UI, the UI components should be able to bind to it and any changes to it on the ViewModel side propagates the change to the View.

Here is how your prepareNewMeme should look like:

	viewModel.prepareNewMeme = function(selectedImage) {
		this.selectedImage = selectedImage;
	
		this.set("topText", "");
		this.set("bottomText", "");
		this.set("fontSize", 40);
		this.set("isBlackText", false);
		this.set("memeImage", selectedImage);
	
		this.uniqueImageName = utilities.generateUUID() + ".png";
	};

### Step #3 - Refresh Meme
From here things get even easier.

First add refreshMeme to the ViewModel

	viewModel.refreshMeme = function () {
		
	};
	
Now copy the contents from **refreshMeme** from edit-meme.js.
Replace **_viewData** with **viewModel** and replace **_selectedImageSource** with **viewModel.selectedImage**. Finally you should end up with something like:

	viewModel.refreshMeme = function () {
		var image = imageManipulation.addText(viewModel.selectedImage, viewModel.topText, viewModel.bottomText, viewModel.fontSize, viewModel.isBlackText);
	
		viewModel.set("memeImage", image);
	};

### Step #4 - Save Locally

First add refreshMeme to the ViewModel

	viewModel.saveLocally = function () {
		
	};
	
Now copy the contents from **saveLocally** from edit-meme.js.

refreshMeme() is a function of the viewModel (not a global function), so we have to refer to it as this.refreshMeme().
Also the two parameters passed to localStorage.saveLocally come from the ViewModel, therefore we should change it to this.uniqueImageName and this.memeImage. As a result you should get:

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

### Step #5 - Share
This is the last and the easiest of the functions that we need to implement.

So this will be without a surprise that you should get something like:

	viewModel.share = function() {
		socialShare.share(this.memeImage);
	}

### Step #6 - On Property Changed

Add following code to the **//---EVENT HANDLER---//** section:

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

#### Step #7 - Update and clear up create-meme.js

#### Step #8 - Update create-meme.xml


## Resource List:

* [TBD](http://tbd.com)
