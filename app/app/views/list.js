var observableModule = require("data/observable");
var observableArray = require("data/observable-array");

var data = new observableModule.Observable();
var memes = new observableArray.ObservableArray([]);
data.set("memes", memes);

exports.load = function(args) {
	var page = args.object;
	page.bindingContext = data;
};
