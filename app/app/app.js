var application = require("application");
application.mainModule = "app/components/splashscreen/splashscreen";

global.baseViewDirectory = "app/components/";
global.recentMemeFolderName = "myMemes";

global.appTemplateFolderName = "~/app/images/templates/";
global.localTemplateFolderName = "localTemplates";
global.everliveTemplateFolderName = "everliveTemplates";

global.everliveApiKey = "wFQtgknUo8yPqENA";
global.everliveBaseAddress = "http://api.everlive.com/v1/" + global.everliveApiKey;

application.start();

