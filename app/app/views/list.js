var observableModule = require( "data/observable" ),
	observableArray = require( "data/observable-array" ),
	data = new observableModule.Observable(),
	view;

data.set( "language", "" );
data.set( "list", new observableArray.ObservableArray([
	{ name: "C#" },
	{ name: "Java" },
	{ name: "JavaScript" }
]));

exports.load = function( args ) {
	view = args.object;
	view.bindingContext = data;
};
exports.add = function() {
	var language = data.get( "language" ),
		list = data.get( "list" );

	// Hide the keyboard on iOS (UIView.endEditing)
	if ( view._nativeView.endEditing ) { // Guard against Android, WP, etc
		view._nativeView.endEditing( true );
	}

	list.push({ name: language });
	data.set( "language", "" );
};
