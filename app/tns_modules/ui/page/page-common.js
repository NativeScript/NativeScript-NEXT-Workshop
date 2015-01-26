var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var contentView = require("ui/content-view");
var view = require("ui/core/view");
var styleScope = require("ui/styling/style-scope");
var trace = require("trace");
var knownEvents;
(function (knownEvents) {
    knownEvents.navigatedTo = "navigatedTo";
})(knownEvents = exports.knownEvents || (exports.knownEvents = {}));
var Page = (function (_super) {
    __extends(Page, _super);
    function Page(options) {
        _super.call(this, options);
        this._styleScope = new styleScope.StyleScope();
    }
    Page.prototype.onLoaded = function () {
        if (this.css) {
            this._applyCss();
        }
        _super.prototype.onLoaded.call(this);
    };
    Object.defineProperty(Page.prototype, "navigationContext", {
        get: function () {
            return this._navigationContext;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Page.prototype, "css", {
        get: function () {
            return this._styleScope.css;
        },
        set: function (value) {
            if (this._cssApplied) {
                this._resetCssValues();
            }
            this._styleScope.css = value;
            this._cssApplied = false;
            if (this.isLoaded) {
                this._applyCss();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Page.prototype, "frame", {
        get: function () {
            return this._frame;
        },
        set: function (value) {
            this._frame = value;
        },
        enumerable: true,
        configurable: true
    });
    Page.prototype.onNavigatingTo = function (context) {
        this._navigationContext = context;
    };
    Page.prototype.onNavigatedTo = function (context) {
        this._navigationContext = context;
        this.notify({
            eventName: knownEvents.navigatedTo,
            object: this,
            context: context
        });
    };
    Page.prototype.onNavigatingFrom = function () {
    };
    Page.prototype.onNavigatedFrom = function () {
        this._navigationContext = undefined;
    };
    Page.prototype._getStyleScope = function () {
        return this._styleScope;
    };
    Page.prototype._applyCss = function () {
        if (this._cssApplied) {
            return;
        }
        try {
            this._styleScope.assureSelectors();
            var scope = this._styleScope;
            var checkSelectors = function (view) {
                scope.applySelectors(view);
                return true;
            };
            checkSelectors(this.content);
            if (this.content) {
                view.eachDescendant(this.content, checkSelectors);
            }
            this._cssApplied = true;
        }
        catch (e) {
            trace.write("Css styling failed: " + e, trace.categories.Style);
        }
    };
    Page.prototype._resetCssValues = function () {
        var resetCssValuesFunc = function (view) {
            view.style._resetCssValues();
            return true;
        };
        resetCssValuesFunc(this.content);
        if (this.content) {
            view.eachDescendant(this.content, resetCssValuesFunc);
        }
    };
    return Page;
})(contentView.ContentView);
exports.Page = Page;
