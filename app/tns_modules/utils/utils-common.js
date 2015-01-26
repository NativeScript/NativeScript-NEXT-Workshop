var types = require("utils/types");
var platform;
(function (platform) {
    platform.android = "android";
    platform.ios = "ios";
})(platform = exports.platform || (exports.platform = {}));
function targetPlatform() {
    if (global.NSObject) {
        return platform.ios;
    }
    if (global.android) {
        return platform.android;
    }
    return "";
}
exports.targetPlatform = targetPlatform;
function copyFrom(source, target) {
    if (types.isDefined(source) && types.isDefined(target)) {
        var i;
        var key;
        var value;
        var keys = Object.keys(source);
        for (i = 0; i < keys.length; i++) {
            key = keys[i];
            value = source[key];
            if (types.isDefined(value)) {
                target[key] = value;
            }
        }
    }
}
exports.copyFrom = copyFrom;
