var applicationModule = require("application");
var viewModel = require("./view-model").viewModel;
var _page;

exports.loaded = function(args) {
	_page = args.object;
	_page.bindingContext = viewModel;

	if (applicationModule.ios) {
		_page.ios.title = "Create New";
	}
};

exports.navigatedTo = function(args) {
	//grab the image from the navigation context.
	var selectedImageSource = _page.navigationContext;
	
	viewModel.prepareNewMeme(selectedImageSource);
};