
var fs = require("file-system");

var _documentsFolder = fs.knownFolders.documents();
var _recentMemeFolder = _documentsFolder.getFolder(global.recentMemeFolderName);

module.exports = {
	getMyMemes: function () {
		return _getMyMemes();
	},
	deleteMeme: function (imageFileName) {
		return _deleteMeme(imageFileName);
	},
	deleteAllMemes: function () {
		return _clearMemeFolder();
	}
}

function _getMyMemes() {
	return _recentMemeFolder.getEntities();
}

function _deleteMeme(imageFileName) {
	var file = _recentMemeFolder.getFile(imageFileName);
	return file.remove();
}

function _clearMemeFolder () {
	return _recentMemeFolder.clear();
}