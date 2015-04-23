var application = require("application");

var device = (function () {
    function device() {
    }

    Object.defineProperty(device, "language", {
        get: function () {
            if (!device._language) {
                var context = application.android.context,
                    locale = context.getResources().getConfiguration().locale;
                if (locale) {
                    device._language = locale.toString();
                } else {
                    device._language = java.util.Locale.getDefault().toString();
                }
            }
            return device._language;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(device, "userAgent", {
        get: function () {
            if (!device._userAgent) {
                var context = application.android.context;
                device._userAgent = new android.webkit.WebView(context).getSettings().getUserAgentString();
            }
            return device._userAgent;
        },
        enumerable: true,
        configurable: true
    });
    return device;
})();

exports.device = device;