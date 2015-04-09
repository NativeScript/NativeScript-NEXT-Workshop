var imageSourceModule = require("image-source");
var httpModule = require("http");

module.exports = {
	uploadFile: function (fileName, imageSource) {
		return _uploadFile(fileName, imageSource);
	},
	updateTemplateIndex: function (imageName) {
		return _updateTemplateIndex(imageName);
	},
	getTemplateIndex: function() {
		return _getTemplatesIndex();
	},
	getTemplateImage: function(imageUrl) {
		return _getTemplateImage(imageUrl);
	}
}

function _uploadFile (fileName, imageSource) {
	var postUrl = "http://api.everlive.com/v1/" + global.everliveApiKey + "/Files";
	
	var postBody = {
		"Filename": fileName,
		"ContentType": "image/png",
		"base64": imageSource.toBase64String(imageSourceModule.ImageFormat.PNG)
	};

	return _postToEverlive(postUrl, postBody)
}

function _getTemplatesIndex() {
	return null;
}

function _updateTemplateIndex (imageName) {
	//Call the content type and get the json blob with approved templates.
	return null;
}

function _getTemplateImage(imageUrl){

}

function _getFromEverlive(url) {
	var requestOptions = {
		method: "GET",
		url: url,
		headers: {
			'Content-Type': "application/json"
		}
	};

	return _callEverlive(requestOptions);
}

function _postToEverlive(url, postBody) {

	var requestOptions = {
		method: "POST",
		url: url,
		headers: {
			'Content-Type': "application/json"
		},
		content: JSON.stringify(postBody)
	};

	return _callEverlive(requestOptions);
}

function _callEverlive(requestOptions) {

	return httpModule.request(requestOptions);
}