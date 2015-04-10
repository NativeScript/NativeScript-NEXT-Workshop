var imageSource = require("image-source");
var fs = require("file-system");
var httpModule = require("http");

var everlive = require("../everlive/everlive");
var localStorage = require("../local-storage/local-storage");


module.exports = {
	getMyMemes: function(callback) {
		return _getMyMemes(callback);
	},
	getTemplates: function(callback) {
		return _getTemplates(callback);
	},
	addNewPublicTemplate: function(fileName, imageSource) {
		return _addNewPublicTemplate(fileName, imageSource);
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

function _addNewPublicTemplate(fileName, imageSource) {
	return everlive.addTemplate(fileName, imageSource)
			.then(function(){
				//Save locally too, then we don't have to ever download again...
				localStorage.addEverliveTemplate(fileName, imageSource);
			});
}

function _getTemplates(callback, container) {

	/*
	Templates come from three places... 
		1. included in the app.
		2. templates someone saved locally
		3. templates from everlive. 
	*/

	var templateImageSources = [];
	localStorage.getAppTemplates()
	.then(function(entities){
		entities.forEach(function (template) {
			callback(imageSource.fromFile(template.path));
		});
	});

	//Should see if we can get this differently... From local storage
	/*
	var templates = [];
	for (var i = 0; i <= 12; i++) {
		var path = "~/app/images/templates/" + i + ".png";
		templates.push({ path: path });
	}

	var templateList = [];

	templates.list().forEach(function(x){
		templateList.push(x);
	});

	localStorage.getMyTemplates()
		.then(function (localTemplateEntities) {

			localTemplateEntities.forEach(function(item){
				templateList.push(item);
			});

			//TODO: Do we need to sort this list????

			templateList.forEach(callback());

				function(template) {
				var currentImageSource = imageSourceModule.fromFile(template.path);

				var image = new imageModule.Image();
				image.source = currentImageSource;
			
				//Add the gesture to the image such that we can interact with it.
				//todo... this callback should be renamed to a navigate to edit. something....
				var observer = image.observe(gesturesModule.GestureTypes.Tap, function () { templateSelected(currentImageSource) });
				
				//add to the element.
				memeContainer.addChild(image);
			});
		});

	*/
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
					if (!localStorage.doesEverliveTemplateExist(template.FileName)) {
						console.log("**** Getting " + template.Url + " ****");
						httpModule.getImage(template.Url).then(function(imageSource) {
							templatesFound++;
							console.log("**** Got " + template.Url + " ****");
							var saved = localStorage.saveEverliveTemplateLocally(template.FileName, imageSource);
							
							if (saved) {
								callback(imageSource);
							}
							
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