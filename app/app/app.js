console.log("***** MEME App Starting *****");

var application = require("application");
application.mainModule = "app/components/splashscreen/splashscreen";


global.baseViewDirectory = "app/components/";
global.recentMemeFolderName = "recentMemes";

application.start();

