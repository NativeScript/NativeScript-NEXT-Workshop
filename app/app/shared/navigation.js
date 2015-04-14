var frameModule = require("ui/frame");
var applicationModule = require("application");

module.exports = {
	goHome: function () {
		isHome = true;
		frameModule.topmost().navigate(global.baseViewDirectory + "home/home");
	},
	goCreateMeme: function (imageSource) {
		isHome = false;
		
		frameModule.topmost().navigate({
			moduleName: global.baseViewDirectory + "create-meme/create-meme",
			context: imageSource
		});
		
	},
	goCreateTemplate: function () {
		isHome = false;
		frameModule.topmost().navigate(global.baseViewDirectory + "create-template/create-template");
	},
	goBack: function () {
		if(isHome === false)
			frameModule.topmost().goBack();
	},
	showIOSNavigationBar: function() {
		// Make sure we're on iOS before configuring the navigation bar
		if (applicationModule.ios) {
			// Get access to the native iOS UINavigationController
			var controller = frameModule.topmost().ios.controller;
			
			// Call the UINavigationController's setNavigationBarHidden method
			controller.navigationBarHidden = false;
		}
    },
	hideIOSNavigationBar: function() {
		// Make sure we're on iOS before configuring the navigation bar
		if (applicationModule.ios) {
			// Get access to the native iOS UINavigationController
			var controller = frameModule.topmost().ios.controller;
			
			// Call the UINavigationController's setNavigationBarHidden method
			controller.navigationBarHidden = true;
		}
    }
}