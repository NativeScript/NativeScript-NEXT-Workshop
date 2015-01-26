var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var panel = require("ui/panels/panel");
var common = require("ui/content-view/content-view-common");
var OWNER = "_owner";
var ContentView = (function (_super) {
    __extends(ContentView, _super);
    function ContentView() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(ContentView.prototype, "android", {
        get: function () {
            return this._viewGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContentView.prototype, "_nativeView", {
        get: function () {
            return this._viewGroup;
        },
        enumerable: true,
        configurable: true
    });
    ContentView.prototype._createUI = function () {
        this._viewGroup = new panel.NativePanel(this._context);
        this._viewGroup[OWNER] = this;
    };
    ContentView.prototype._addViewToNativeVisualTree = function (child) {
        _super.prototype._addViewToNativeVisualTree.call(this, child);
        if (this._viewGroup && child._nativeView) {
            this._viewGroup.addView(child._nativeView);
            return true;
        }
        return false;
    };
    ContentView.prototype._removeViewFromNativeVisualTree = function (child) {
        _super.prototype._removeViewFromNativeVisualTree.call(this, child);
        if (this._viewGroup && child._nativeView) {
            this._viewGroup.removeView(child._nativeView);
        }
    };
    return ContentView;
})(common.ContentView);
exports.ContentView = ContentView;
