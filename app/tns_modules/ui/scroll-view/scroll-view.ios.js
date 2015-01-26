var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var contentView = require("ui/content-view");
var common = require("ui/scroll-view/scroll-view-common");
var geometry = require("utils/geometry");
var enums = require("ui/enums");
require("utils/module-merge").merge(common, exports);
var ScrollView = (function (_super) {
    __extends(ScrollView, _super);
    function ScrollView() {
        _super.call(this);
        this._scroll = new UIScrollView();
    }
    Object.defineProperty(ScrollView.prototype, "orientation", {
        get: function () {
            return this._getValue(common.orientationProperty);
        },
        set: function (value) {
            this._setValue(common.orientationProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "horizontalOffset", {
        get: function () {
            return this._scroll.contentOffset.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "verticalOffset", {
        get: function () {
            return this._scroll.contentOffset.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "scrollableWidth", {
        get: function () {
            if (this.orientation !== enums.Orientation.horizontal) {
                return 0;
            }
            return Math.max(0, this._scroll.contentSize.width - this._scroll.bounds.size.width);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "scrollableHeight", {
        get: function () {
            if (this.orientation !== enums.Orientation.vertical) {
                return 0;
            }
            return Math.max(0, this._scroll.contentSize.height - this._scroll.bounds.size.height);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "ios", {
        get: function () {
            return this._scroll;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "_nativeView", {
        get: function () {
            return this._scroll;
        },
        enumerable: true,
        configurable: true
    });
    ScrollView.prototype.scrollToVerticalOffset = function (value, animated) {
        if (this.orientation === enums.Orientation.vertical) {
            var bounds = this._scroll.bounds.size;
            this._scroll.scrollRectToVisibleAnimated(CGRectMake(0, value, bounds.width, bounds.height), animated);
        }
    };
    ScrollView.prototype.scrollToHorizontalOffset = function (value, animated) {
        if (this.orientation === enums.Orientation.horizontal) {
            var bounds = this._scroll.bounds.size;
            this._scroll.scrollRectToVisibleAnimated(CGRectMake(value, 0, bounds.width, bounds.height), animated);
        }
    };
    ScrollView.prototype._measureOverride = function (availableSize) {
        if (!this.content) {
            return geometry.Size.zero;
        }
        var contentMeasureSize;
        if (this.orientation === enums.Orientation.vertical) {
            contentMeasureSize = new geometry.Size(availableSize.width, Number.POSITIVE_INFINITY);
        }
        else {
            contentMeasureSize = new geometry.Size(Number.POSITIVE_INFINITY, availableSize.height);
        }
        var contentDesiredSize = this.content.measure(contentMeasureSize);
        this._scroll.contentSize = contentDesiredSize;
        return availableSize;
    };
    ScrollView.prototype._arrangeOverride = function (finalSize) {
        if (this.content) {
            this.content.arrange(new geometry.Rect(0, 0, finalSize.width, finalSize.height));
        }
    };
    ScrollView.prototype._addViewToNativeVisualTree = function (child) {
        _super.prototype._addViewToNativeVisualTree.call(this, child);
        if (child._nativeView) {
            this._nativeView.addSubview(child._nativeView);
            return true;
        }
        return false;
    };
    ScrollView.prototype._removeViewFromNativeVisualTree = function (child) {
        _super.prototype._removeViewFromNativeVisualTree.call(this, child);
        if (child._nativeView) {
            child._nativeView.removeFromSuperview();
        }
    };
    return ScrollView;
})(contentView.ContentView);
exports.ScrollView = ScrollView;
