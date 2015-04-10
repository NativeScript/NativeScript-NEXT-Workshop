var imageSource = require("image-source");
var fs = require("file-system");
var httpModule = require("http");

var everlive = require("../everlive/everlive");
var localStorage = require("../local-storage/local-storage");

var templates = [];
for (var i = 0; i <= 12; i++) {
	var path = "~/app/images/templates/" + i + ".png";
	templates.push({ path: path });
}

module.exports = {
	getMyMemes: function(callback) {
		return _getMyMemes(callback);
	},
	getTemplates: function(callback) {

	},

	//TEMP....
	list: function() {
		return templates;
	},
	getByIndex: function(index) {
		return templates[index];
	},
	getFromEverlive: function() {
		return _getTemplatesFromEverlive();
	}
}

function _getMyMemes(callback) {
	var recentMemes = [];

	localStorage.getMyMemes()
	.then(function (entities) {

		entities.forEach(function (entity) {
			var source = imageSource.fromFile(entity.path);
			recentMemes.push({ source: source, fileName: entity.name, lastModified: entity.lastModified});
		});

		//sort to get in the order of most recent
		recentMemes.sort(function (a, b) {
			return b.lastModified.getTime() - a.lastModified.getTime();
		});
		
		recentMemes.forEach(function(meme) {
			callback(meme.source, meme.fileName);
		});

	});
}

function _getTemplatesFromEverlive(callback) {
	var templatesFound = 0;

	return new Promise(function (resolve, reject) {
		everlive.getTemplateIndex()
		.then(function(result) {
			var results = JSON.parse(result.content);
			console.log("***** TemplateIndex Result *****", JSON.stringify(result));
			console.log("***** Templates Returned *****", results.Count);

			var imagePromises = [];
			results.Result.forEach(function(template) {
				imagePromises.push(new Promise(function(resolve, reject) {
					//Before we download, check to see if we already have it...
					if (!localStorage.doesTemplateExist(template.FileName)) {
						console.log("**** Getting " + template.Url + " ****");
						httpModule.getImage(template.Url).then(function(imageSource) {
							templatesFound++;
							console.log("**** Got " + template.Url + " ****");
							var saved = localStorage.saveTemplateLocally(template.FileName, imageSource);
							
							/*
							if (saved) {
								callback(imageSource);
							}
							*/
							resolve();
						});
					} else {
						resolve();
					}
				}));
			});

			Promise.all(imagePromises).then(function() {
				resolve(templatesFound);
			});

		}).catch(function(error){
			console.log("***** ERROR", JSON.stringify(error));
			reject(error);
		});
	});	
}