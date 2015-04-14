var application = require("application");
var frameModule = require("ui/frame");
var dialogsModule = require("ui/dialogs");

application.mainModule = "app/components/splashscreen/splashscreen";

application.onResume = function (context) {	
	console.log("***** application.onResume *****");
	
	//var topmost = frameModule.topmost();
	//topmost.navigate(global.baseViewDirectory + "home/home");
};

/*
application.onUncaughtError = function (error) {	
	console.log("***** application onUncaughtError *****", error);
	
	dialogs.prompt({
	  title: "Application Uncaught Error",
	  message: error,
	  okButtonText: "Go Back Home"
	
	}).then(function (r) {
		var topmost = frameModule.topmost();
		topmost.navigate(global.baseViewDirectory + "home/home");
	});
};
*/

global.baseViewDirectory = "app/components/";
global.recentMemeFolderName = "myMemes";

global.appTemplateFolderName = "app/images/templates";
global.localTemplateFolderName = "localTemplates";
global.everliveTemplateFolderName = "everliveTemplates";

global.everliveApiKey = "wFQtgknUo8yPqENA";
global.everliveBaseAddress = "http://api.everlive.com/v1/" + global.everliveApiKey;
global.everliveFunctionBaseAddress = "https://platform.telerik.com/bs-api/v1/" + global.everliveApiKey + "/Functions"; 

application.start();

