var types = require("utils/types");
var timer = require("timer");
var consoleModule = require("console");
global.setTimeout = timer.setTimeout;
global.clearTimeout = timer.clearTimeout;
global.setInterval = timer.setInterval;
global.clearInterval = timer.clearInterval;
if (types.isUndefined(global.NSObject)) {
    global.console = new consoleModule.Console();
}
