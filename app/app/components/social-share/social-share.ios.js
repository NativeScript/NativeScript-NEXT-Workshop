module.exports = {
	share: function(image) {
		var activityController = UIActivityViewController.alloc()
			.initWithActivityItemsApplicationActivities([image.ios], null);
		UIApplication.sharedApplication().keyWindow.rootViewController
			.presentViewControllerAnimatedCompletion(activityController, true, null);
	}
};
