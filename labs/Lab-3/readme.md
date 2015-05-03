# 2015 TelerikNEXT NativeScript {N} Workshop - Lab #3
Contributors: [Clark Sell](http://csell.net) & [TJ VanToll](http://tjvantoll.com/) & Sebastian Witalec. You can find us on Twitter at: [@csell5](https://twitter.com/csell5), [@tjvantoll](https://twitter.com/tjvantoll), [@sebawita](https://twitter.com/sebawita)

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

In the first lab you learned how to [clone an existing project](https://github.com/NativeScript/NativeScript-NEXT-Workshop/tree/master/labs/Lab-1#step-1-clone-the-repo) in AppBuilder. For this lab here is the starting and ending points:

{N} lab projects in GitHub:
* [Starting Project](https://github.com/NativeScript/NativeScript-NEXT-Workshop-Lab3-Start)
* [Finished Project](https://github.com/NativeScript/NativeScript-NEXT-Workshop-Lab3-Finish)

## The Lab

The lab is divided into few sections:
* Steps 1-10 will take you through an excersise of converting create-meme page to use MVVM, by moving the app logic from `create-meme.js` to `View-model.js`. The purpose of this excersise is to show you how you can migrate from one approach (app logic mixed with view's code-behind) to the other (app logic in the ViewModel) and to show you how a ViewModel should be strucutred.
* Step 11 shows you how a ViewModel looks when implemented in TypeScript. TypeScript is a great language that can speed up and simplyfy the process building JavaScript modules. The best thing is that TypeScript compiles into JavaScript, so you are never missing out.
* Steps 12-17 show you how to add app usage Analytics to your app, so that you could see how often/which features people use.

### Step #0.1- Examine the ViewModel of the Create Meme page
Go to app->components->create-meme folder and open `view-model.js` file
Here you can see the code to create a new ViewModel

```JavaScript
var observable = require("data/observable");
var viewModel = new observable.Observable();
```
	
And finally the ViewModel is exposed from the module, through:

```JavaScript
exports.viewModel = viewModel;
```

There are also a few placeholders prepared to implement the functionality of the ViewModel:

**MODULE IMPORTS**: This is where we're going to import the required modules

**VIEW MODEL METHOD PLACEHOLDERS**: This is where we're going to implement the methods of the ViewModel

**EVENT HANDLER**: this is where we're going to add on the property change handler

### Step #0.2 - Examine `create-meme.js` file
Go to app->components->create-meme folder and open `create-meme.js`file.

Here we have:
* `exports.loaded` - provides the code for the `loaded` event in the view. Here is where we initialise the page and add the `propertyChange` event,
* `exports.navigatedTo` - provides the code for the `navigatedTo` event in the view. Here is were we retrieve the image passed in through `_page.navigationContext` and then reset the values to their default state,
* `function refreshMeme()` - this function refreshes the MemeImage
* `exports.saveLocally` - provides the code for the `tap` event of the Save button in the View `<Button text="Save" tap="saveLocally" />`. It contains the necessary code to save the Meme to a file.
* `exports.share` - provides the code for the `tap` event of the Save button in the View `<Button text="Share" tap="share" />`. It contains the necessary code to share the Meme Image with other apps.
* `function addRefreshOnChange()` - adds a change event handler, which is raised every time there is a change made to `_viewData` calling `refreshMeme()`, unless the event is raised by a change to `memeImage`.

You can note that the part of code begin with `exports.` are exposed to the View (`create-meme.xml`).

### Step #1 - [view-model.js] Copy imports

First we have to start by copying over the module imports from the beginning of create-meme.js.

Open create-meme.js and copy the first 5 lines (which import the required modules) and paste them in view-model.js just below the //---MODULE IMPORTS---// line.

You should get something like:
	
```JavaScript
//---MODULE IMPORTS---//
var imageManipulation = require("../image-manipulation/image-manipulation");
var localStorage = require("../../shared/local-storage/local-storage");
var socialShare = require("../social-share/social-share");
var utilities = require("../../shared/utilities");
var dialogsModule = require("ui/dialogs");
```

### Step #2 - [view-model.js] Implement prepareNewMeme

Let's start with implementing the method that should reset the ViewModel to default values and set the selectedImage as the basis for image manipulation.
This method will be called every time a new image is selected.

Let's start with adding the `prepareNewMeme` function:

```JavaScript
viewModel.prepareNewMeme = function(selectedImage) {

};
```

And now copy the contents of `exports.navigatedTo` into `prepareNewMeme`.

Finally we need to tweak it a bit:

a) Change the following line that changes the selected image source from:

```JavaScript
_selectedImageSource = _page.navigationContext;
```

to:

```JavaScript
this.selectedImage = selectedImage;
```

b) Change the following property assignments from

```JavaScript
_viewData.set("topText", "");
_viewData.set("bottomText", "");
_viewData.set("fontSize", 40);
_viewData.set("isBlackText", false);
_viewData.set("memeImage", _selectedImageSource);
```

to:

```JavaScript
this.set("topText", "");
this.set("bottomText", "");
this.set("fontSize", 40);
this.set("isBlackText", false);
this.set("memeImage", selectedImage);
```

c) And change the unique image name assignment from

```JavaScript
_uniqueImageName = utilities.generateUUID() + ".png";
```

to:

```JavaScript
this.uniqueImageName = utilities.generateUUID() + ".png";
```

You probably noticed the pattern: change `_viewData` to `this` and place any variable inside `this`.
Also we no longer reference the page, as the ViewModel shouldn't be aware of the view.

You are probably thinking what is the difference between `this.x = 1` and `this.set("x", 1);`, and when to use which.
This is rather straight forward. 
The first approach is for internal use only: any changes to it shouldn't affect the UI, while the second one (`set()`), should. The UI components should be able to bind to the view model and any changes to it should propagate to the View.

Here is what your `prepareNewMeme` function should look like:

```JavaScript
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
```

### Step #3 - [view-model.js] Refresh Meme
From here things get even easier.

First add a `refreshMeme` function to the ViewModel

```JavaScript
viewModel.refreshMeme = function () {
	
};
```

Now copy the contents from the `refreshMeme` function in edit-meme.js.
Replace `_viewData` with `viewModel` and replace `_selectedImageSource` with `viewModel.selectedImage`. Finally you should end up with something like:

```JavaScript
//Refresh Meme
viewModel.refreshMeme = function () {
	var image = imageManipulation.addText(viewModel.selectedImage, viewModel.topText, viewModel.bottomText, viewModel.fontSize, viewModel.isBlackText);

	viewModel.set("memeImage", image);
};
```

### Step #4 - [view-model.js] Save Locally

Next, let's tackle the `saveLocally` function. First add a `saveLocally` function to the ViewModel:

```JavaScript
viewModel.saveLocally = function () {
	
};
```

Now copy the contents of `saveLocally` from edit-meme.js.

`refreshMeme()` is a function of the viewModel (not a global function), so we have to refer to it as `this.refreshMeme()`.

Also the two parameters passed to `localStorage.saveLocally` come from the ViewModel, therefore we should change it to `this.uniqueImageName` and `this.memeImage`. As a result your `saveLocally` function should look like this:

```JavaScript
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
```

### Step #5 - [view-model.js] Share
This is the last and the easiest of the functions that we need to implement. So this will be without a surprise that you should get something like:

```JavaScript
//Share
viewModel.share = function() {
	socialShare.share(this.memeImage);
}
```

### Step #6 - [view-model.js] On Property Changed

Add following code to the **//---EVENT HANDLER---//** section:

```JavaScript
//---EVENT HANDLER---//
viewModel.addEventListener(observable.knownEvents.propertyChangeEvent, function(changes) {
	//skip if memeImage changes
	if (changes.propertyName === "memeImage") {
		return;
	}
	
	//Call refresh meme, but make sure it doesn't get called more often than every 200ms
	viewModel.refreshMeme();
});
```

A few things worth noting:
You don't need to place the above code into another function. This piece of code will only execute once throughout the lifecycle of the app. This is because calling `require` on a module definition is only executed once, regardless of how many times it's required.

We call `viewModel.refreshMeme();` and not `this.refreshMeme();` because the `propertyChangeEvent` triggers a call back from a different scope, so `this` wouldn't be referring to the viewModel anymore.

The same `propertyChangeEvent` is raised regardless of which property of the ViewModel changes. This is why there is a bit of code that checks if the `propertyName` is "memeImage".

#### Step #7 - [create-meme.js] Add ViewModel
Open create-meme.js

We no longer need `var _viewData`, as this is replaced by our ViewModel. So replace

```JavaScript
var _viewData = new observable.Observable();
```
	
with

```JavaScript
var createMemeViewModel = require("./view-model").viewModel;
```

Let's explain the code above. `require("./view-model")` retrieves our ViewModel Module. While `.viewModel` retrieves the exported viewModel instance.

#### Step #8 - [create-meme.js] loaded and navigatedTo

Now let's update the `exports.loaded` function. The `bindingContext` should be set to `createMemeViewModel` and we no longer need the call to `addRefreshOnChange` function, as that is handled inside the ViewModel.

You should end up with:

```JavaScript
exports.loaded = function(args) {
	_page = args.object;
	_page.bindingContext = createMemeViewModel;
};
```

Now let's update the `exports.navigatedTo` function. Everything that is happening in this function is handled by `prepareNewMeme`.

So let's replace its content with a call to the viewModel.

You should get something like:

```JavaScript
exports.navigatedTo = function(args) {
	//grab the image from the navigation context.
	var selectedImage = _page.navigationContext;
	createMemeViewModel.prepareNewMeme(selectedImage);
};
```

#### Step #9 - [create-meme.js] Clean up
Once we added the ViewModel, we no longer need the require imports at the top of the file, so delete them all, leaving only the one that loads the ViewModel.

Also we no longer need:

* The `refreshMeme()` function, 
* `exports.saveLocally()`,
* `exports.share()` and
* `function addRefreshOnChange()`

Finally, `var _page` is the only variable that we are still using, so delete the rest.

The final version of create-meme.js should look as follows:

```JavaScript
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
```

#### Step #10 [create-meme.xml] Binding reference update
The final step is to setup bindings on the buttons.

Open create-meme.xml and find the 2 button definitions. Change the `tap` event's bindings to the ViewModel functions, by adding `{{ }}` around the name of the function.

The buttons should look as follows:

```xml
<Button text="Save" tap="{{ saveLocally }}" />
<Button text="Share" tap="{{ share }}" />
```

Here's a quick explanation:
`tap="{{ saveLocally }}"` means: on tap -> go to the ViewModel -> and call `viewModel.saveLocally`

#### Step #11 [view-model-v2.ts] ViewModel using TypeScript

Right click on the **create-meme** folder -> Add -> New File. Select TypeScript, and call it view-model-v2.ts

Now paste and save the following code:

```JavaScript
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
		
		this.addEventListener(observable.knownEvents.propertyChange, function(changes) {
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
```

Now expand view-model-v2.ts (you might need to right click on it and select "Compile to JavaScript" first) and open the .js file. This is the code that is generated from the TypeScript version.

#### Step #12 - Create Analytics project

Go back to Telerik Platform and create a new Analytics project and make sure to select **JavaScript** as the target platform.

[Instructions: How to Create a new Analytics Project] (http://docs.telerik.com/platform/help/projects/create/analytics-project)

Once the new project is ready go to Getting Started -> SDK. Note the string passed into the `createSettings` function:

```JavaScript
var settings = _eqatec.createSettings("1234567890asdfghjkl23456789");
```

This is your Analytics Key. Make a copy of it, we will use it in a moment.

#### Step #13 - Add Analytics Key

Go back to your NativeScript project and then open app/shared/analytics.js.
Paste your Analytics key where it says `'analytics-key-here'`

This will link the Analytics Monitor with your Analytics project.

#### Step #14 - Add Analytics Module to create-meme

Open view-model.js in create-meme folder and a line to require the analytics module:

```JavaScript
var analyticsMonitor = require("../../shared/analytics");
```

From now you can:

* Track Feature Usage
```JavaScript	
analyticsMonitor.trackFeature('MyCategory.MyFeature');`
```
* Track Used Values
```JavaScript
analyticsMonitor.trackFeatureValue('MyCategory.MyValue', 1000);
```
* Track How Long It Takes To Run Something
```JavaScript
analyticsMonitor.trackFeatureStart('MyCategory.MyFeature');
//Do something here
analyticsMonitor.trackFeatureStop('MyCategory.MyFeature');
```

* Track Raised Exceptions
```JavaScript
analyticsMonitor.trackException(new Error('some error'), 'some error message');
```
or
```JavaScript
try {
	//do something
} catch (exception) {
	analyticsMonitor.trackException(exception, 'some error message');
}
```

**IMPORTANT**

There is a 1-day delay for the feature tracking to appear in the Analytics Portal, so please be patient.
However you can see current and recently connected devices at Developer Reports -> Live

#### Step #15 Tracking the usage of saveLocally() and share()

Go to the `viewModel.saveLocally()` function and insert the following code as the first line of the function:

```JavaScript
analyticsMonitor.trackFeature("CreateMeme.SaveLocally");
```

Now do the same for `viewModel.share()`:

```JavaScript
analyticsMonitor.trackFeature("CreateMeme.Share");
```

At the end your function should look like this:

```JavaScript
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
```

#### Step #16 Exception tracking for refreshMeme

Go to the `viewModel.refreshMeme()` and wrap its content with a try/catch (like it is shown in Step 14) and add an error message inside the `trackException` call.

You should get something like this:

```JavaScript
viewModel.refreshMeme = function () {
	try {
		var image = imageManipulation.addText(viewModel.selectedImage, viewModel.topText, viewModel.bottomText, viewModel.fontSize, viewModel.isBlackText);
		viewModel.set("memeImage", image);
	} catch (exception) {
		analyticsMonitor.trackException(exception, 'Failed Refreshing Meme Image');
	}
};
```

#### Step #17 Experiment with Analytics

It is up to you now to go around the project and experiment with Analytics. Try to look for other opportunities within this project to track features or exceptions. 

You can also check **app/components/home/home.js** and **app/components/create-template/create-template.js** and look for commented out code that uses `analyticsMonitor`.

## Resource List

* [Observable](http://docs.nativescript.org/ApiReference/data/observable/HOW-TO.html)
* [Analytics Overview] (http://docs.telerik.com/platform/analytics/getting-started/introduction)
* [Analytics SDK](http://docs.telerik.com/platform/analytics/sdk/js/classes/AnalyticsMonitor.html)
