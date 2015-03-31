module.exports = {
	share: function(image) {
		var activityController = UIActivityViewController.alloc()
			.initWithActivityItemsApplicationActivities([], []);
		UIApplication.sharedApplication().keyWindow.rootViewController
			.presentViewControllerAnimatedCompletion(activityController, true, null);
	}
};
