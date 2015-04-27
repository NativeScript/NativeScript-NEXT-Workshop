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

What are we proving here? Nothing other than navigation works correctly when we get to that point.

### Step #1 - onLoaded page events

With our home view now in place let’s turn our attention back to the ‘SplashScreen.xml’ that we built in the first lab. 

Let’s setup the scenario. Today it’s not uncommon to use a SplashScreen to start loading app information that might be used later in your app. For our purposes here we’re going to fake it and use this as an opportunity to explain a few things. 

To simulate some kind of business processing we’re going to call ‘setTimeout()’ to create a slight delay. Something like such:

	//Pretending we’re calling some awesome service.
	setTimeout(function () {
			// Do something really awesome… 
			// Finished doing something awesome.
			// Now let’s navigate.
	}, 100); 

Now at this point we don’t actually have anywhere to put our code which means it’s a good time to introduce [{N} Page Events](http://docs.nativescript.org/ApiReference/ui/core/view/knownEvents/README)

To complete our scenario, when the page loads, we want to wait a some time then just redirect to our new home page. To do so
let’s add the ‘setTimeout’ to our Page’s ‘onLoaded’ event. 

To start we need to tell our view what function should run when the loaded event is fired. We can easily do this by just adding an attribute to our Page’s *Page* element, ‘loaded=“load”’.  

	<Page 
		loaded=“load”>

Now let’s open our SplashScreen’s code file, ‘splashscreen.js’. Right now we have no code but it’s time to add that load  function we we just defined in our view. To do so we need to follow the [CommonJS](http://www.commonjs.org/) pattern for defining and exporting a function. In our case we need to define a function called *load* and export to our view such that it can later be called when our *loaded* event is fired.

	exports.load = function(args) {
	};

With that in place, our function should now run when the page’s loaded event is fired. Now lets add our setTimeout logic in that function.

	exports.load = function(args) {
		setTimeout(function () {
				// Do something really awesome… 
				// Finished doing something awesome.
				// Now let’s navigate.
				conosle.log('Hi There!!!')
		}, 100); 
	};

**Run the application**

Awesome. Now we just need to navigate to our home page. Let's run the application and see if after 100 milliseconds our console statement prints out 'Hi There!!!'.

### Step #2 - Loading your first module

To navigate to a page within your application we first have to get a reference to the topmost frame. The [frame](http://docs.nativescript.org/ApiReference/ui/frame/Frame) as defined:

> Represents the logical View unit that is responsible for navigation within an application.

For us to leverage the frame API we first have to load that module. We do that by calling *require* and passing the path reference to the module we require. If you’ve done any node.js development this should be more than familiar.

	var frameModule = require(“ui/frame”);

Now that we’ve successful loaded our frame module, I’m sure you’re asking, what’s a module and where did you find that? Well as it turns out they’re in a folder called *tns_modules*, where else?

Ok, let’s back up. A [module](http://docs.nativescript.org/modules) is defined as: 

> To let you access the native device and platform capabilities of your target platform, NativeScript uses a modular design pattern. All device, platform or user interface functionalities reside in separate modules. To access the functionality provided by a module, you need to require the module.

> In your project, the files for each module reside in a 	dedicated subdirectory in the {N}_modules directory. Each default module comes along with a package.json file which declares how the module should be called within your call and which file contains its respective code.

Ok, if you’re using AppBuilder that part is sorta hidden. 

**Extra Credit**

Open your terminal/cmd. Assuming you have the {N} cli installed, run ‘tns create [someAppName]’. In doing so this will create a sample shell application that you can take and build upon.  

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

Now that we have our frame, we need to get a reference to our topmost frame and call navigate. Navigate takes a number of parameters which tell it where and how to navigate.

We can easily get our topmost frame by calling
	var top = frameModule.topmost();

Before we can properly navigate we need to setup some the details on how to navigate. Let’s create a navigationEntry that we will later pass to navigate. There are three properties that we can set:

* moduleName: this is the path to the page that we want to be redirect to.
* context: the object that we want to pass along to the next page.
* animated: show the native page transitions.

See the following example:

	var navigationEntry = {
		moduleName: “details-page”,
		context: { info: “something you want to pass to your page” },
		animated: true
	};

Now in our case our moduleName should be the path to our home.xml page './components/home/home' and we also don't have anything to pass along to the home page so we can omit the context. 

With this we just need to call navigate passing our navigation entry to it.

	top.navigate(navigationEntry);

Now the completed ‘SplashScreen.js’ should look similar to what you see listed below. Here we've used some shorthand syntax to add a little sugar into today’s lab:

	// load the frame module
	var frameModule = require(“ui/frame”);

	// expose our load function to the page’s loaded event
	exports.load = function(args) {
		// Fake some work
		setTimeout(function () {
			// Call the frameModule and navigate away
			frameModule.topmost().navigate({
				moduleName: “./app/components/home/home”,
				animated: true
			});
		}, 100);
	};

**Run the application**

You should see the application startup, pause on our splashscreen for the set number of milliseconds, then redirect itself to the home.xml page.

### Step #4 - Laying out Home.xml



### Step #5 - Adding Controls to Home.xml
### Step #6 - Handle Page Events
### Step #7 - XXX

## Resource List:

* [Page Navigation](http://docs.nativescript.org/navigation#navigation)
* [Page Layout](http://docs.nativescript.org/layouts)
