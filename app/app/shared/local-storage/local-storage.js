
var fs = require("file-system");
var imageSourceModule = require("image-source");

var _documentsFolder = fs.knownFolders.documents();
var _recentMemeFolder = _documentsFolder.getFolder(global.recentMemeFolderName);
var _templateFolder = _documentsFolder.getFolder(global.templateFolderName);

module.exports = {
	getMyMemes: function () {
		return _getMyMemes();
	},
	getMyTemplates: function () {
		return _getMyTemplates();
	},
	deleteMeme: function (imageFileName) {
		return _deleteMeme(imageFileName);
	},
	deleteAllMemes: function () {
		return _clearMemeFolder();
	},
	saveLocally: function(imageName, imageSource) {
		return _saveImageLocally(imageName, imageSource);
	},
	saveTemplateLocally: function(imageName, imageSource) {
		return _saveTemplateLocally(imageName, imageSource);
	}
}

function _getMyMemes() {
	return _recentMemeFolder.getEntities();
}

function _getMyTemplates() {
	return _templateFolder.getEntities();
}

function _deleteMeme(imageFileName) {
	var file = _recentMemeFolder.getFile(imageFileName);
	return file.remove();
}

function _clearMemeFolder () {
	return _recentMemeFolder.clear();
}

function _saveImageLocally (imageName, imageSource) {
	var fullPath = fs.path.join(_recentMemeFolder.path, imageName);
	var saved = imageSource.saveToFile(fullPath, imageSourceModule.ImageFormat.PNG);

	return saved;
}

function _saveTemplateLocally(imageName, imageSource) {
	var fullPath = fs.path.join(_templateFolder.path, imageName);
	var saved = imageSource.saveToFile(fullPath, imageSourceModule.ImageFormat.PNG);

	return saved;
}