var observableModule = require("data/observable");
var observableArray = require("data/observable-array");
var data = new observableModule.Observable();

var fileSystemModule = require("file-system");
new fileSystemModule.File("path/to/file");

data.set("memes", new observableArray.ObservableArray([
	{ url: "https://google.com/favicon.ico" },
	{ url: "https://twitter.com/favicon.ico" },
	{ url: "https://telerik.com/favicon.ico" }
]));

exports.load = function(args) {
	args.object.bindingContext = data;
};
