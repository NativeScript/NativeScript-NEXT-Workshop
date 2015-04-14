var imageSourceModule = require("image-source");
var httpModule = require("http");

module.exports = {
	
	addTemplate: function (fileName, imageSource) {
		//This should also save locally....
		return _addTemplate(fileName, imageSource );
	},
	getTemplateIndex: function() {
		return _getTemplatesIndex();
	},
	getTemplateImage: function(imageUrl) {
		return _getTemplateImage(imageUrl);
	}
}

function _getTemplatesIndex() {
	var getUrl = global.everliveFunctionBaseAddress + "/GetTemplates";
	return _getFromEverlive(getUrl);
}

function _addTemplate (fileName, imageSource) {
	return _uploadFile(fileName, imageSource)
		.then(function(uploadResponse){
			console.log("***** RESULT FROM EVERLIVE:", JSON.stringify(uploadResponse));

			var result = JSON.parse(uploadResponse.content).Result;
			
			console.log("***** RESULT FROM EVERLIVE after:", result.Id);
			_addTemplateToContentType(fileName, result.Id, result.Uri);
		}); 
}

function _uploadFile (fileName, imageSource) {
	var postUrl = global.everliveBaseAddress + "/Files";
	
	var postBody = {
		"Filename": fileName,
		"ContentType": "image/png",
		"base64": imageSource.toBase64String(imageSourceModule.ImageFormat.PNG)
	};

	return _postToEverlive(postUrl, postBody)
}

function _addTemplateToContentType (fileName, id, uri) {
	var postUrl = global.everliveBaseAddress + "/TemplateIndex";

	var post_data = {
		Url: uri,
		FileName: fileName,
		ImageId: id
	};

	return _postToEverlive(postUrl, post_data);
}

function _getTemplateImage(imageUrl){
	return httpModule.getImage(imageUrl);
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