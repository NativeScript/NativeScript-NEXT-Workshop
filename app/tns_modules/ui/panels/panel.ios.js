var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var panelCommon = require("ui/panels/panel-common");
var OWNER = "_owner";
var NativePanel = UIView.extend({
    get owner() {
        return this[OWNER];
    },
    didMoveToWindow: function () {
        this.super.didMoveToWindow();
        this.owner.didMoveToWindow();
    }
});
var Panel = (function (_super) {
    __extends(Panel, _super);
    function Panel() {
        _super.call(this);
        this._view = NativePanel.new();
        this._view[OWNER] = this;
        this._view.autoresizesSubviews = false;
    }
    Object.defineProperty(Panel.prototype, "ios", {
        get: function () {
            return this._view;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "_nativeView", {
        get: function () {
            return this._view;
        },
        enumerable: true,
        configurable: true
    });
    Panel.prototype._addViewToNativeVisualTree = function (child) {
        _super.prototype._addViewToNativeVisualTree.call(this, child);
        if (child._nativeView) {
            this._view.addSubview(child.ios);
            return true;
        }
        return false;
    };
    Panel.prototype._removeViewFromNativeVisualTree = function (child) {
        _super.prototype._removeViewFromNativeVisualTree.call(this, child);
        if (child._nativeView) {
            child._nativeView.removeFromSuperview();
        }
    };
    Panel.prototype.didMoveToWindow = function () {
        this.onLoaded();
    };
    return Panel;
})(panelCommon.Panel);
exports.Panel = Panel;
