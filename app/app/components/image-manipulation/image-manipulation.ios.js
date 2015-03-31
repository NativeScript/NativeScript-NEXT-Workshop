var imageSource = require("image-source");
var templates = require("../templates/templates");

var font = UIFont.boldSystemFontOfSize(30);

module.exports = {
	addText: function(templateIndex, topText, bottomText) {
		topText = "One does not simply";
		bottomText = "Write a mobile app";

		// Get the UIImage
		var image = templates.getByIndex(templateIndex).source.ios;

		UIGraphicsBeginImageContext(image.size);

		// Draw the original image in
		image.drawInRect(
			CGRectMake(0, 0, image.size.width, image.size.height)
		);

		// Create rectangles for each line of text
		var topRect = CGRectMake(50, 50, image.size.width, image.size.height);
		var bottomRect = CGRectMake(50, 200, image.size.width, image.size.height);

		// Set the color of the text to white, although this doesn't appear to work.
		UIColor.whiteColor().set();

		var attrDict = NSMutableDictionary.alloc().init();
		var topString = NSMutableAttributedString.alloc().initWithStringAttributes(topText, attrDict);
		topString.drawInRect( topRect );

		var bottomString = NSMutableAttributedString.alloc().initWithStringAttributes(bottomText, attrDict);
		bottomString.drawInRect( bottomRect );

		var newImage = UIGraphicsGetImageFromCurrentImageContext();
		UIGraphicsEndImageContext();

		return imageSource.fromNativeSource(newImage);
	}
};
