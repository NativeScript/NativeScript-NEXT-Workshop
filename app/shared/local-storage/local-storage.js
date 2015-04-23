
var fs = require("file-system");
var imageSourceModule = require("image-source");
var enumsModule = require("ui/enums");

var _documentsFolder = fs.knownFolders.documents();
var _recentMemeFolder = _documentsFolder.getFolder(global.recentMemeFolderName);
var _appTemplateFolder = global.appTemplateFolderName;
var _localTemplateFolder = _documentsFolder.getFolder(global.localTemplateFolderName);
var _everliveTemplateFolder = _documentsFolder.getFolder(global.everliveTemplateFolderName);

module.exports = {
	getMyMemes: function () {
		return _getMyMemes();
	},
	getAppTemplates: function () {
		return _getAppTemplates();
	},
	getMyTemplates: function () {
		return _getMyTemplates();
	},
	getEverliveTemplates: function () {
		return _getEverliveTemplates();
	},
	getEverliveTemplateFile: function (fileName) {
		return _getEverliveTemplateFile(fileName);
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
	},
	saveEverliveTemplateLocally: function(imageName, imageSource) {
		return _saveEverliveTemplateLocally(imageName, imageSource);
	},
	doesEverliveTemplateExist: function(imageFileName) {
		return _doesEverliveTemplateExist(imageFileName);
	}
}

function _getMyMemes() {
	return _recentMemeFolder.getEntities();
}

function _getAppTemplates() {
	var fullPath = fs.path.join(fs.knownFolders.currentApp().path, _appTemplateFolder);
	var templatesFolder = fs.Folder.fromPath(fullPath);
	
	return templatesFolder.getEntities();
}

function _getMyTemplates() {
	return _localTemplateFolder.getEntities();
}

function _getEverliveTemplates () {
	return _everliveTemplateFolder.getEntities();
}

function _getEverliveTemplateFile(fileName) {
	
	var fullPath = fs.path.join(_everliveTemplateFolder.path, fileName);
	var templateImage = imageSourceModule.fromFile(fullPath);

	return templateImage;
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
	var saved = imageSource.saveToFile(fullPath, enumsModule.ImageFormat.png);

	console.log("Meme Saved To:", fullPath);

	return saved;
}

function _doesEverliveTemplateExist(imageName) {
	var fullPath = fs.path.join(_everliveTemplateFolder.path, imageName);
	return fs.File.exists(fullPath);
}

function _saveTemplateLocally(imageName, imageSource) {
	var fullPath = fs.path.join(_localTemplateFolder.path, imageName);
	console.log("***** Saved image to:", fullPath);

	var saved = imageSource.saveToFile(fullPath, enumsModule.ImageFormat.png);
	return saved;
}

function _saveEverliveTemplateLocally(imageName, imageSource) {
	var fullPath = fs.path.join(_everliveTemplateFolder.path, imageName);
	console.log("***** Saved template to:", fullPath);
	
	var saved = imageSource.saveToFile(fullPath, enumsModule.ImageFormat.png);
	return saved;
}