var imageSource = require("image-source");
var templates = require("../templates/templates");

var font = UIFont.boldSystemFontOfSize(12);

module.exports = {
	addText: function(templateIndex, topText, bottomText) {
		topText = "One does not simply";
		bottomText = "Write a mobile app";

		// Get the UIImage
		var image = templates.getByIndex(templateIndex).source.ios;

		UIGraphicsBeginImageContext(image.size);
		image.drawInRect(
			CGRectMake(0, 0, image.size.width, image.size.height)
		);

		var topRect = CGRectMake(0, 0, image.size.width, image.size.height);
		var bottomRect = CGRectMake(100, 100, image.size.width, image.size.height);

		UIColor.whiteColor().set();

		var attrDict = NSMutableDictionary.alloc().init();
		var topString = NSMutableAttributedString.alloc().initWithStringAttributes(topText, attrDict);
		topString.drawInRect( topRect );

		var bottomString = NSMutableAttributedString.alloc().initWithStringAttributes(bottomText, attrDict);
		bottomString.drawInRect( topRect );

		var newImage = UIGraphicsGetImageFromCurrentImageContext();
		UIGraphicsEndImageContext();

		return imageSource.fromNativeSource(newImage);
	}
};
