var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var view = require("ui/core/view");
var pages = require("ui/page");
var types = require("utils/types");
var trace = require("trace");
var builder = require("ui/builder");
var fs = require("file-system");
var fileSystemAccess = require("file-system/file-system-access");
var frameStack = [];
function buildEntryFromArgs(arg) {
    var entry;
    if (arg instanceof pages.Page) {
        entry = {
            page: arg
        };
    }
    else if (types.isString(arg)) {
        entry = {
            moduleName: arg
        };
    }
    else if (types.isFunction(arg)) {
        entry = {
            create: arg
        };
    }
    else {
        entry = arg;
    }
    return entry;
}
function resolvePageFromEntry(entry) {
    var page;
    if (entry.page || entry.create) {
        page = entry.page || entry.create();
    }
    else if (entry.moduleName) {
        var currentAppPath = fs.knownFolders.currentApp().path;
        var moduleNamePath = fs.path.join(currentAppPath, entry.moduleName);
        var moduleExports = require(moduleNamePath);
        if (entry.resolvedPage) {
            page = entry.resolvedPage;
        }
        else if (moduleExports.createPage) {
            page = moduleExports.createPage();
        }
        else {
            page = pageFromBuilder(moduleNamePath, moduleExports);
        }
    }
    return page;
}
function pageFromBuilder(moduleName, moduleExports) {
    var page;
    var element;
    var fileName = moduleName + ".xml";
    if (fs.File.exists(fileName)) {
        element = builder.load(fileName, moduleExports);
        if (element instanceof pages.Page) {
            page = element;
            var cssFileName = moduleName + ".css";
            if (fs.File.exists(cssFileName)) {
                new fileSystemAccess.FileSystemAccess().readText(cssFileName, function (r) {
                    page.css = r;
                });
            }
        }
    }
    return page;
}
var knownEvents;
(function (knownEvents) {
    var android;
    (function (android) {
        android.optionSelected = "optionSelected";
    })(android = knownEvents.android || (knownEvents.android = {}));
})(knownEvents = exports.knownEvents || (exports.knownEvents = {}));
var NavigationContext = (function () {
    function NavigationContext() {
        this.isBackNavigation = false;
    }
    return NavigationContext;
})();
var Frame = (function (_super) {
    __extends(Frame, _super);
    function Frame() {
        _super.call(this);
        this._isInFrameStack = false;
        this._backStack = new Array();
        this._navigationStack = new Array();
    }
    Frame.prototype.canGoBack = function () {
        return this._backStack.length > 0;
    };
    Frame.prototype.goBack = function () {
        trace.write(this._getTraceId() + ".goBack();", trace.categories.Navigation);
        if (!this.canGoBack()) {
            return;
        }
        var entry = this._backStack.pop();
        var newPage = entry.resolvedPage;
        if (!newPage) {
            throw new Error("Failed to resolve Page instance to navigate to. Processing entry: " + entry);
        }
        var navigationContext = {
            entry: entry,
            oldPage: this._currentPage,
            newPage: newPage,
            isBackNavigation: true
        };
        this._navigationStack.push(navigationContext);
        if (this._navigationStack.length === 1) {
            this._processNavigationContext(navigationContext);
        }
        else {
            trace.write(this._getTraceId() + ".goBack scheduled;", trace.categories.Navigation);
        }
    };
    Frame.prototype.navigate = function (param) {
        trace.write(this._getTraceId() + ".navigate();", trace.categories.Navigation);
        var entry = buildEntryFromArgs(param);
        entry.resolvedPage = resolvePageFromEntry(entry);
        if (!entry.resolvedPage) {
            throw new Error("Failed to resolve Page instance to navigate to. Processing entry: " + entry);
        }
        this._pushInFrameStack();
        var navigationContext = {
            entry: entry,
            oldPage: this._currentPage,
            newPage: entry.resolvedPage,
            isBackNavigation: false
        };
        this._navigationStack.push(navigationContext);
        if (this._navigationStack.length === 1) {
            this._processNavigationContext(navigationContext);
        }
        else {
            trace.write(this._getTraceId() + ".navigation scheduled;", trace.categories.Navigation);
        }
    };
    Frame.prototype._processNavigationStack = function (page) {
        if (this._navigationStack.length === 0) {
            return;
        }
        var currentNavigationPage = this._navigationStack[0].newPage;
        if (page !== currentNavigationPage) {
            throw new Error("Corrupted navigation stack.");
        }
        this._navigationStack.shift();
        if (this._navigationStack.length > 0) {
            var navigationContext = this._navigationStack[0];
            this._processNavigationContext(navigationContext);
        }
    };
    Frame.prototype._processNavigationContext = function (navigationContext) {
        if (navigationContext.isBackNavigation) {
            this.performGoBack(navigationContext);
        }
        else {
            this.performNavigation(navigationContext);
        }
    };
    Frame.prototype.performNavigation = function (navigationContext) {
        this._onNavigatingTo(navigationContext);
        if (this._currentPage) {
            this._backStack.push(this._currentEntry);
        }
        this._navigateCore(navigationContext);
        this._onNavigatedTo(navigationContext);
    };
    Frame.prototype.performGoBack = function (navigationContext) {
        this._onNavigatingTo(navigationContext);
        this._goBackCore(navigationContext.entry);
        this._onNavigatedTo(navigationContext);
    };
    Frame.prototype._goBackCore = function (entry) {
    };
    Frame.prototype._navigateCore = function (context) {
    };
    Frame.prototype._onNavigatingTo = function (context) {
        if (this._currentPage) {
            this._currentPage.onNavigatingFrom();
        }
        context.newPage.frame = this;
        context.newPage.onNavigatingTo(context.entry.context);
    };
    Frame.prototype._onNavigatedTo = function (context) {
        if (this._currentPage) {
            this._currentPage.onNavigatedFrom();
        }
    };
    Object.defineProperty(Frame.prototype, "animated", {
        get: function () {
            return this._animated;
        },
        set: function (value) {
            this._animated = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Frame.prototype, "backStack", {
        get: function () {
            return this._backStack;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Frame.prototype, "currentPage", {
        get: function () {
            return this._currentPage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Frame.prototype, "currentEntry", {
        get: function () {
            return this._currentEntry;
        },
        enumerable: true,
        configurable: true
    });
    Frame.prototype._pushInFrameStack = function () {
        if (this._isInFrameStack) {
            return;
        }
        frameStack.push(this);
        this._isInFrameStack = true;
    };
    Frame.prototype._popFromFrameStack = function () {
        if (!this._isInFrameStack) {
            return;
        }
        var top = _topmost();
        if (top !== this) {
            throw new Error("Cannot pop a Frame which is not at the top of the navigation stack.");
        }
        frameStack.pop();
        this._isInFrameStack = false;
    };
    Object.defineProperty(Frame.prototype, "_childrenCount", {
        get: function () {
            if (this._currentPage) {
                return 1;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Frame.prototype._eachChildView = function (callback) {
        if (this._currentPage) {
            callback(this._currentPage);
        }
    };
    Frame.prototype._getIsAnimatedNavigation = function (entry) {
        if (entry && types.isDefined(entry.animated)) {
            return entry.animated;
        }
        if (types.isDefined(this.animated)) {
            return this.animated;
        }
        return Frame.defaultAnimatedNavigation;
    };
    Frame.prototype._getTraceId = function () {
        return "Frame<" + this._domId + ">";
    };
    Frame.defaultAnimatedNavigation = true;
    return Frame;
})(view.View);
exports.Frame = Frame;
var _topmost = function () {
    if (frameStack.length > 0) {
        return frameStack[frameStack.length - 1];
    }
    return undefined;
};
exports.topmost = _topmost;
function goBack() {
    var top = _topmost();
    if (top.canGoBack()) {
        top.goBack();
        return true;
    }
    if (frameStack.length > 1) {
        top._popFromFrameStack();
    }
    return false;
}
exports.goBack = goBack;
function stack() {
    return frameStack;
}
exports.stack = stack;
