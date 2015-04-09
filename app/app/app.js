/* This breaks my app: Samsung Note 3, Companion App
console.log("***** MEME App Starting *****");
*/
var application = require("application");
application.mainModule = "app/components/splashscreen/splashscreen";

global.baseViewDirectory = "app/components/";
global.recentMemeFolderName = "recentMemes";
global.templateFolderName = "templates";

global.everliveApiKey = "wFQtgknUo8yPqENA";
global.everliveBaseAddress = "http://api.everlive.com/v1/" + global.everliveApiKey;

application.start();

