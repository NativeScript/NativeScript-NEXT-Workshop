var imageSource = require("image-source");
var templates = require("../templates/templates");

module.exports = {
	addText: function(templateIndex, topText, bottomText) {
		topText = "One does not simply";
		bottomText = "Write a mobile app";

		// Get the UIImage
		var image = templates.getByIndex(templateIndex).source.ios;

		var font = UIFont.boldSystemFontOfSize(12);
		UIGraphicsBeginImageContext(image.size);

		var rect = CGRectMake(0, 0, image.size.width, image.size.height);

		UIColor.whiteColor().set();

		var attrDict = NSMutableDictionary.alloc().init();
		var nsAttributedString = NSMutableAttributedString.alloc().initWithStringAttributes(topText, attrDict);
		nsAttributedString.drawInRect( rect );

		var newImage = UIGraphicsGetImageFromCurrentImageContext();
		UIGraphicsEndImageContext();

		return imageSource.fromNativeSource(newImage);
	}
};
