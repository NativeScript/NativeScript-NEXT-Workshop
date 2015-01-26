var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var viewCommon = require("ui/core/view-common");
var geometry = require("utils/geometry");
var layout = require("ui/core/layout");
var trace = require("trace");
var utils = require("utils/utils");
require("utils/module-merge").merge(viewCommon, exports);
function onIsEnabledPropertyChanged(data) {
    var view = data.object;
    if (!view._nativeView) {
        return;
    }
    view._nativeView.userInteractionEnabled = data.newValue;
}
viewCommon.isEnabledProperty.metadata.onSetNativeValue = onIsEnabledPropertyChanged;
var View = (function (_super) {
    __extends(View, _super);
    function View() {
        _super.apply(this, arguments);
    }
    View.prototype._addViewCore = function (view) {
        _super.prototype._addViewCore.call(this, view);
        layout.LayoutInfo.propagateResumeLayout(this._layoutInfo, view._layoutInfo);
        this._invalidateMeasure();
    };
    View.prototype._removeViewCore = function (view) {
        _super.prototype._removeViewCore.call(this, view);
        layout.LayoutInfo.propagateSuspendLayout(view._layoutInfo);
        view._onDetached();
        this._invalidateMeasure();
    };
    View.prototype._measureOverride = function (availableSize) {
        return this._measureNativeView(availableSize);
    };
    View.prototype._measureNativeView = function (availableSize, options) {
        var desiredSize = this._nativeView.sizeThatFits(CGSizeMake(availableSize.width, availableSize.height));
        return new geometry.Size(desiredSize.width, desiredSize.height);
    };
    View.prototype._setBounds = function (rect) {
        _super.prototype._setBounds.call(this, rect);
        var frame = CGRectMake(rect.x, rect.y, rect.width, rect.height);
        var nativeView = this._nativeView;
        if (!CGRectEqualToRect(nativeView.frame, frame)) {
            trace.write(this + ", Native setFrame: " + NSStringFromCGRect(frame), trace.categories.Layout);
            nativeView.frame = frame;
        }
    };
    View.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        utils.copyFrom(this._options, this);
        delete this._options;
    };
    Object.defineProperty(View.prototype, "_nativeView", {
        get: function () {
            return this.ios;
        },
        enumerable: true,
        configurable: true
    });
    View.prototype._onSubviewDesiredSizeChanged = function () {
        this._invalidateMeasure();
    };
    View.prototype._prepareNativeView = function (view) {
    };
    return View;
})(viewCommon.View);
exports.View = View;
