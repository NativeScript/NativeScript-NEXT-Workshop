var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/content-view/content-view-common");
var ContentView = (function (_super) {
    __extends(ContentView, _super);
    function ContentView() {
        _super.call(this);
        this._view = new UIView();
        this._view.autoresizesSubviews = false;
    }
    Object.defineProperty(ContentView.prototype, "ios", {
        get: function () {
            return this._view;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContentView.prototype, "_nativeView", {
        get: function () {
            return this._view;
        },
        enumerable: true,
        configurable: true
    });
    ContentView.prototype._addViewToNativeVisualTree = function (child) {
        _super.prototype._addViewToNativeVisualTree.call(this, child);
        if (child._nativeView) {
            this._nativeView.addSubview(child._nativeView);
            return true;
        }
        return false;
    };
    ContentView.prototype._removeViewFromNativeVisualTree = function (child) {
        _super.prototype._removeViewFromNativeVisualTree.call(this, child);
        if (child._nativeView) {
            child._nativeView.removeFromSuperview();
        }
    };
    return ContentView;
})(common.ContentView);
exports.ContentView = ContentView;
