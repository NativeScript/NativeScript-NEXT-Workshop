var imageSource = require("image-source");
var fs = require("file-system");

var templates = [];
for (var i = 0; i <= 11; i++) {
	var source = imageSource.fromFile("~/app/images/templates/" + i + ".png");
	templates.push({ source: source });
}

module.exports = {
	list: function() {
		return templates;
	},
	getRecentMemes: function () {
		var recentMemes = [];

		var documents = fs.knownFolders.documents();
		var recentMemeFolder = documents.getFolder(global.recentMemeFolderName);

		recentMemeFolder.getEntities().then(function (entities) {
		    entities.forEach(function (entity) {
				var source = imageSource.fromFile(entity);	
				recentMemes.push({ source: source });
		    });
		}, function (error) {
		    // Failed to obtain folder's contents.
		    globalConsole.error(error.message);
		});

		return recentMemes;
	},
	getByIndex: function(index) {
		return templates[index];
	}
}