var imageSource = require("image-source");
var appModule = require("application");
var fileSystem = require("file-system");
var REQUEST_IMAGE_CAPTURE = 3453;
exports.takePicture = function () {
    return new Promise(function (resolve, reject) {
        try {
            var takePictureIntent = new android.content.Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
            var dateStamp = createDateTimeStamp();
            var tempPicturePath = fileSystem.path.join(appModule.android.currentContext.getExternalFilesDir(null).getAbsolutePath(), "cameraPicture_" + dateStamp + ".jpg");
            var nativeFile = new java.io.File(tempPicturePath);
            var tempPictureUri = android.net.Uri.fromFile(nativeFile);
            takePictureIntent.putExtra(android.provider.MediaStore.EXTRA_OUTPUT, tempPictureUri);
            if (takePictureIntent.resolveActivity(appModule.android.context.getPackageManager()) != null) {
                var previousResult = appModule.android.onActivityResult;
                appModule.android.onActivityResult = function (requestCode, resultCode, data) {
                    appModule.android.onActivityResult = previousResult;
                    if (requestCode === REQUEST_IMAGE_CAPTURE && resultCode === android.app.Activity.RESULT_OK) {
                        var tempSource = imageSource.fromFile(tempPicturePath);
                        var scaledBitmap = android.graphics.Bitmap.createScaledBitmap(tempSource.android, 750, 450, false);
                        resolve(imageSource.fromNativeSource(scaledBitmap));
                    }
                };
                appModule.android.foregroundActivity.startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE);
            }
        }
        catch (e) {
            if (reject) {
                reject(e);
            }
        }
    });
};
var createDateTimeStamp = function () {
    var result = "";
    var date = new Date();
    result = date.getDate().toString() + (date.getMonth() + 1).toString() + date.getFullYear().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString();
    return result;
};
