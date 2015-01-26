var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var panelCommon = require("ui/panels/panel-common");
var trace = require("trace");
var utils = require("utils/utils");
var OWNER = "_owner";
exports.NativePanel = android.view.ViewGroup.extend({
    get owner() {
        return this[OWNER];
    },
    onMeasure: utils.ad.layout.onMeasureNative,
    onLayout: utils.ad.layout.onLayoutNative
});
var Panel = (function (_super) {
    __extends(Panel, _super);
    function Panel() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(Panel.prototype, "android", {
        get: function () {
            return this._viewGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "_nativeView", {
        get: function () {
            return this._viewGroup;
        },
        enumerable: true,
        configurable: true
    });
    Panel.prototype._createUI = function () {
        this._viewGroup = new exports.NativePanel(this._context);
        this._viewGroup[OWNER] = this;
    };
    Panel.prototype._addViewToNativeVisualTree = function (child) {
        _super.prototype._addViewToNativeVisualTree.call(this, child);
        if (this._viewGroup && child._nativeView) {
            this._viewGroup.addView(child._nativeView);
            return true;
        }
        return false;
    };
    Panel.prototype._removeViewFromNativeVisualTree = function (child) {
        _super.prototype._removeViewFromNativeVisualTree.call(this, child);
        if (this._viewGroup && child._nativeView) {
            this._viewGroup.removeView(child._nativeView);
            trace.notifyEvent(child, "childInPanelRemovedFromNativeVisualTree");
        }
    };
    return Panel;
})(panelCommon.Panel);
exports.Panel = Panel;
