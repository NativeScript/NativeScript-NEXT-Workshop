var application = require("application");
var frameModule = require("ui/frame");
var dialogsModule = require("ui/dialogs");

var platformModule = require("platform");

// Comment this to stop tracing

/*
var trace = require("trace");
trace.enable();
trace.setCategories(trace.categories.concat(
    trace.categories.Debug
    , "TabView"
    , "Camera"
    //, trace.categories.Navigation
    //, trace.categories.ViewHierarchy
    //, trace.categories.VisualTreeEvents
    ));
*/

application.mainModule = "./components/splashscreen/splashscreen";
application.cssFile = "./app.css";

// Application Events: https://github.com/NativeScript/docs/tree/master/ApiReference/application
application.onLaunch = function (context) {	
	console.log("***** application.onLaunch *****");
};

application.onResume = function (context) {	
	console.log("***** application.onResume *****");

	/*
	var analyticsMonitor = require("./shared/analytics");
	analyticsMonitor.start();
	*/

	//var topmost = frameModule.topmost();
	//topmost.navigate(global.baseViewDirectory + "home/home");
};

application.onSuspend = function () {	
	console.log("***** application.onSuspend *****");
};

application.onExit = function () {	
	console.log("***** application.onExit *****");

	var analyticsMonitor = require("./shared/analytics");
	analyticsMonitor.stop();
};

application.onUncaughtError = function (error) {	
	console.log("***** application onUncaughtError *****", error);

	var analyticsMonitor = require("./shared/analytics");
	analyticsMonitor.trackException(error, "onUncaughtError");
};

global.baseViewDirectory = "./components/";
global.recentMemeFolderName = "myMemes";

global.appTemplateFolderName = "./images/templates";
global.localTemplateFolderName = "localTemplates";
global.everliveTemplateFolderName = "everliveTemplates";

global.everliveApiKey = "wFQtgknUo8yPqENA";
global.everliveBaseAddress = "http://api.everlive.com/v1/" + global.everliveApiKey;
global.everliveFunctionBaseAddress = "https://platform.telerik.com/bs-api/v1/" + global.everliveApiKey + "/Functions"; 

application.start();