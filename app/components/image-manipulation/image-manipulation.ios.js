var imageSource = require("image-source");
var font;
var uiImage;

function drawTextOnImage(options) {
	var rect = CGRectMake(options.x, options.y, uiImage.size.width - 50, uiImage.size.height);

	// Set the color of the text to white
	if (options.blackText) {
		UIColor.blackColor().set();
	} else {
		UIColor.whiteColor().set();
	}

	// Draw the text into the image
	var textString = NSString.alloc().initWithString(options.text);
	textString.drawInRectWithFont(rect, font);
}

module.exports = {
	addText: function(image, topText, bottomText, fontSize, isBlackText) {
		topText = topText || "";
		bottomText = bottomText || "";
		fontSize = fontSize || 30;

		// Set the font size to use for all text
		font = UIFont.boldSystemFontOfSize(fontSize);

		// Store off a reference to the UIImage
		uiImage = image.ios;

		UIGraphicsBeginImageContext(uiImage.size);

		// Draw the original image in
		uiImage.drawInRect(
			CGRectMake(0, 0, uiImage.size.width, uiImage.size.height)
		);

		// Draw an outline for the top text
		drawTextOnImage({
			blackText: !isBlackText,
			text: topText,
			x: 28,
			y: 28
		});

		// Draw the top text
		drawTextOnImage({
			blackText: isBlackText,
			text: topText,
			x: 30,
			y: 30
		});

		// Draw an outline for the bottom text
		drawTextOnImage({
			blackText: !isBlackText,
			text: bottomText,
			x: 28,
			y: uiImage.size.height - 98
		});

		// Draw the bottom text
		drawTextOnImage({
			blackText: isBlackText,
			text: bottomText,
			x: 30,
			y: uiImage.size.height - 100
		});

		// Get the newly created image
		var newImage = UIGraphicsGetImageFromCurrentImageContext();
		UIGraphicsEndImageContext();

		// Return the image as an ImageSource
		return imageSource.fromNativeSource(newImage);
	}
};
