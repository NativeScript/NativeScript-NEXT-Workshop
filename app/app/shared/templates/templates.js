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
	list: function() {
		return templates;
	},
	getByIndex: function(index) {
		return templates[index];
	},
	getFromEverlive: function() {
		return _getFromEverlive();
	}
}

function _getFromEverlive() {
	var templatesFound = 0;

	return new Promise(function (resolve, reject) {
		everlive.getTemplateIndex()
		.then(function(result){
			var results = JSON.parse(result.content);
			console.log("***** TemplateIndex Result *****", JSON.stringify(result));
			console.log("***** Templates Returned *****", results.Count);

			Promise.all(results.Result.forEach(function (template){
				httpModule.getImage(template.Url).then(function(imageSource){
					templatesFound++;
					localStorage.saveTemplateLocally(template.FileName, imageSource).then(function(){
						console.log("***** _getFromEverlive SAVED *****");
					});
				});
			}));
		}).then(function(){
			resolve(templatesFound);
		}).catch(function(error){
			console.log("***** ERROR", JSON.stringify(error));
			reject(error);
		});
	});	
}