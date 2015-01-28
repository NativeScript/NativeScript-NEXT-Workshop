var observableModule = require( "data/observable" ),
	observableArray = require( "data/observable-array" ),
	data = new observableModule.Observable();

data.set( "memes", new observableArray.ObservableArray([
	{ url: "https://google.com/favicon.ico" },
	{ url: "https://twitter.com/favicon.ico" },
	{ url: "https://telerik.com/favicon.ico" }
]));

exports.load = function( args ) {
	args.object.bindingContext = data;
};
