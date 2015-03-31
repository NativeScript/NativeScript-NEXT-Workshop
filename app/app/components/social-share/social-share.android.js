var application = require("application");

module.exports = {
	share: function(image) {
		var message = "Text I want to share."
		var intent = new android.content.Intent(android.content.Intent.ACTION_SEND);
		intent.setType("text/plain");
		intent.putExtra(android.content.Intent.EXTRA_TEXT, message);

		var context = application.android.context;
		var shareIntent = android.content.Intent.createChooser(intent, "How would you like to share this image?");
		shareIntent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
		context.startActivity(shareIntent);
	}
};
