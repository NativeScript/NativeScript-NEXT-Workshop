var imageSourceModule = require("image-source");
var httpModule = require("http");

module.exports = {
	uploadFile: function (fileName, imageSource) {
		return _uploadFile(fileName, imageSource);
	}
}

function _uploadFile (fileName, imageSource) {
	
	//'http://api.everlive.com/v1/your-api-key-here/Files',
	var postUrl = "http://api.everlive.com/v1/" + global.everliveApiKey + "/Files";
	
	var postBody = {
    	"Filename": fileName,
    	"ContentType": "image/png",
    	"base64": imageSource.toBase64String(imageSourceModule.ImageFormat.PNG)
	};

	var postLength = postBody.length;

	var requestOptions = {
		method: "POST",
		url: postUrl,
		headers: {
		  	'Content-Type': "application/json"
		},
		content: JSON.stringify(postBody)
	};

	return httpModule.request(requestOptions);
}

/*

	//SAMPLE CALLING CODE
	
	//TEMP... here for testing...
	var everlive = require( "../everlive/everlive");

	//TEMP just using for testing...
	everlive.uploadFile(_uniqueImageNameForSession, data.get("imageSource")).then(function(e){
		if ( e.content.statusCode != '200' ) {
			console.log(JSON.stringify(e));	
		} else {
			console.log("***** Uploaded File *****");
		}
	}).catch(function (error){
		console.log("***** ERROR *****", error);
	});



*/