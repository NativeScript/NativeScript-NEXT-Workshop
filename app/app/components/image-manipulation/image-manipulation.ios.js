var imageSource = require("image-source");
var templates = require("../templates/templates");

var font = UIFont.boldSystemFontOfSize(30);

module.exports = {
	addText: function(templateIndex, topText, bottomText) {
		topText = topText || "";
		bottomText = bottomText || "";

		// Get the UIImage
		var image = templates.getByIndex(templateIndex).source.ios;

		UIGraphicsBeginImageContext(image.size);

		// Draw the original image in
		image.drawInRect(
			CGRectMake(0, 0, image.size.width, image.size.height)
		);

		// Create rectangles for each line of text
		var topRect = CGRectMake(30, 30, image.size.width, image.size.height);
		var bottomRect = CGRectMake(30, 200, image.size.width, image.size.height);

		// Set the color of the text to white
		UIColor.whiteColor().set();

		// Draw the top text into the image
		var topString = NSString.alloc().initWithString(topText);
		topString.drawInRectWithFont(topRect, font);

		// Draw the bottom text into the image
		var bottomString = NSString.alloc().initWithString(bottomText);
		bottomString.drawInRectWithFont(bottomRect, font);

		// Get the newly created image
		var newImage = UIGraphicsGetImageFromCurrentImageContext();
		UIGraphicsEndImageContext();

		// Return the image as an ImageSource
		return imageSource.fromNativeSource(newImage);
	}
};
