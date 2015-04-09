var imageSourceModule = require("image-source");
var viewModel = require("./view-model").createMemeViewModel;

var	_page,
	_initialised = false;

exports.loaded = function(args) {
	_page = args.object;
	_page.bindingContext = viewModel;
    
	// run this code only once
	if(! _initialised) {
		_initialised = true;
    	viewModel.addRefreshOnChange();
	}
};

exports.navigatedTo = function(args) {
	//grab the image from the navigation context.
	var selectedImageSource = _page.navigationContext;

	viewModel.prepareEditor(selectedImageSource);
};