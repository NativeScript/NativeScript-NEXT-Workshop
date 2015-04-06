var application = require("application");
var imageSource = require("image-source");

module.exports = {
	addText: function(image, topText, bottomText, isBlackText) {
		topText = topText || "";
		bottomText = bottomText || "";

		// Android makes you create a mutable Bitmap from an immutable one. Because Java.
		var bitmap = image.android.copy(android.graphics.Bitmap.Config.ARGB_8888, true);

		var type = android.graphics.Typeface.create("Helvetica",
			android.graphics.Typeface.BOLD);

		var paint = new android.graphics.Paint();
		paint.setStyle(android.graphics.Paint.Style.FILL);
		
		paint.setColor(android.graphics.Color.WHITE);
		if (isBlackText) {
			paint.setColor(android.graphics.Color.BLACK);
		}
		
		paint.setTypeface(type);
		paint.setTextAlign(android.graphics.Paint.Align.LEFT);
		paint.setTextSize(40);

		var canvas = new android.graphics.Canvas(bitmap);
		canvas.drawText(topText, 50, 50, paint);
		canvas.drawText(bottomText, 50, bitmap.getHeight() - 50, paint);
		
		return imageSource.fromNativeSource(bitmap);
	}
};
