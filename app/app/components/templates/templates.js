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
	getByIndex: function(index) {
		return templates[index];
	}
}