# 2015 TelerikNEXT NativeScript {N} Workshop - Lab #2
Contributors: [Clark Sell](http://csell.net) & [TJ Vanoll](http://tjvantoll.com/) & Sebastian Witalec. You can find us on Twitter at: [@csell5](https://twitter.com/csell5), [@tjvantoll](https://twitter.com/tjvantoll), [@sebawita](https://twitter.com/sebawita)

Tags: TelerikNEXT, NativeScript, {N}, JavaScript, CSS3, iOS, Android

## What are we learning?

In this lab we’re going to build upon the splash screen we built  in the first lab. Our overall goal here is to navigate to our home page, get and load some images, navigate to our next page. In doing so we will explore the following topics:

* Page navigation
* Page layout and structure
* Handling page events
* UI Controls
* Control Events
* Basic Modules
 
## Getting Setup
In the first lab you learned how to [clone an existing project](https://github.com/NativeScript/NativeScript-NEXT-Workshop/tree/master/labs/Lab-1#step-1-clone-the-repo) in AppBuilder. For this lab here is the starting and ending points:

* [Starting Project](http://tbd.com)
* [Finished Project](http://tbd.com)

## The Lab

### Step #0 - Creating the home.xml shell

In an effort to keep our app always running, before we can navigate away from the splash screen we will need something to navigate to. To start, let’s create the basic shell of our home screen that we will later redirect our splash screen too.

**Creating Home**

1. In our components folder ‘/app/components’ let’s create a new folder called *home* that will contain all of our home’s components.
2. Every view can have three components. The layout (xml), the style (css), and the view’s code (js). When those files all have the same root name, in our case *home*, the {N} runtime will load them accordingly.
3. Let’s create those three file that we will need to display our home page:

* /app/components/home/**home.xml**
* /app/components/home/**home.js**
* /app/components/home/**home.css**

With those three files in place, let’s update our *home.xml* to include the worlds simplest {N} page markup. 

	<Page>
		<Label text=“hi from home”/>
	</Page>

### Step #1 - onLoaded page events

With our home view now in place let’s turn our attention back to the ‘SplashScreen.xml’ that we built in the first lab. 

Let’s setup the scenario. Today it’s not uncommon to use a SplashScreen to start loading app information that might be used later in your app. For our purposes here we’re going to fake it.   To simulate some kind of load we’re going to call ‘setTimeout()’ to create a delay. Something like such:

	//Pretending we’re calling some awesome service.
	setTimeout(function () {
			//Got it. Now let’s navigate.
	}, 100); 

Now at this point we don’t actually have anywhere to put our code, good time to introduce [{N} Page Events](http://docs.nativescript.org/ApiReference/ui/core/view/knownEvents/README)

Let’s add this simulated logic to the Page’s ‘onLoaded’ event. To start we need to start by telling our view what function should run when the loaded event is fire. We do this by just adding an attribute to our Page element, ‘loaded=“load”’.  

	<Page 	loaded=“load”>

Now let’s open our SplashScreen’s code file, ‘splashscreen.js’. Right now we have no code but it’s time to add that load  function we we just defined in our view. To do so we need to follow the [CommonJS](http://www.commonjs.org/) pattern for defining and exporting a function. In our case we need to define a function called *load* and export to our view such that it can later be called when our *loaded* event is fired.

	exports.load = function(args) {
	};


### Step #2 - Loading your first module

To navigate to another page within your application we first have to get a reference to the topmost frame. The [frame](http://docs.nativescript.org/ApiReference/ui/frame/Frame) as defined:

> Represents the logical View unit that is responsible for navigation within an application.

For use to use the frame we first have to load that module. We do that by calling *require* and passing the path reference to our module.

	var frameModule = require(“ui/frame”);

Now that we’ve successful loaded our frame module I am sure you’re asking, what’s a module and where did you find that? Well as it turns out they’re in a folder called *tns_modules*, where else?

Ok let’s back up. A [module](http://docs.nativescript.org/modules) is defined as: 

> To let you access the native device and platform capabilities of your target platform, NativeScript uses a modular design pattern. All device, platform or user interface functionalities reside in separate modules. To access the functionality provided by a module, you need to require the module.

> In your project, the files for each module reside in a 	dedicated subdirectory in the {N}_modules directory. Each default module comes along with a package.json file which declares how the module should be called within your call and which file contains its respective code.

Ok, if you’re using AppBuilder that part is actually hidden. 

**Extra Credit**

Open your terminal/cmd. Assuming you have the {N} cli installed, ‘run tns create [someAppName]’. In doing so this will create a sample shell application that you can take and build upon.  

After running *create*, you should see a file & folder structure similar to what you see listed below. Look closely and you will find the tns_modules folder. This is where all of the default modules are hiding.

	├── app
	│   ├── App_Resources
	│   │   ├── Android
	│   │   │   ├── …
	│   │   └── iOS
	│   │       ├── …
	│   ├── LICENSE
	│   ├── README.md
	│   ├── app
	│   │   ├── app.css
	│   │   ├── app.js
	│   │   ├── bootstrap.js
	│   │   ├── main-page.js
	│   │   ├── main-page.xml
	│   │   ├── main-view-model.js
	│   │   └── package.json
	│   ├── package.json
	│   └── tns_modules
	│       ├── LICENSE
	│       ├── application
	│       │   ├── application-common.js
	│       │   ├── application.android.js
	│       │   ├── application.ios.js
	│       │   └── package.json
	│       ├── camera
	│       │   ├── camera.android.js
	│       │   ├── camera.ios.js
	│       │   └── package.json
	│       ├── …
	└── platforms

### Step #3 - Take me Home.xml

Now that we have our frame, we want our topmost 

Finished ‘SplashScreen.js’ code:

	var frameModule = require(“ui/frame”);

	exports.load = function(args) {
		setTimeout(function () {
			frameModule.topmost().navigate({
				moduleName: “~/app/components/home/home”,
				animated: true
			});
		}, 100);
	};

### Step #4 - Laying out Home.xml
### Step #5 - Adding Controls to Home.xml
### Step #6 - Handle Page Events
### Step #7 - XXX

## Resource List:

* [Page Navigation](http://docs.nativescript.org/navigation#navigation)
* [Page Layout](http://docs.nativescript.org/layouts)


## Step 1: Deploy to companion app

After creating the project you're taken into the AppBuilder environment. AppBuilder offers a lot of functionality—everything from a coding IDE to