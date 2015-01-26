var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var contentView = require("ui/content-view");
var common = require("ui/scroll-view/scroll-view-common");
var utils = require("utils/utils");
var geometry = require("utils/geometry");
var enums = require("ui/enums");
require("utils/module-merge").merge(common, exports);
var OWNER = "_owner";
common.orientationProperty.metadata.onValueChanged = function scrollViewOrientationChanged(data) {
    data.object._onOrientationChanged(data.oldValue, data.newValue);
};
var NativeVerticalScrollView = android.widget.ScrollView.extend({
    get owner() {
        return this[OWNER];
    },
    onMeasure: utils.ad.layout.onMeasureNative,
    onLayout: utils.ad.layout.onLayoutNative
});
var NativeHorizontalScrollView = android.widget.HorizontalScrollView.extend({
    get owner() {
        return this[OWNER];
    },
    onMeasure: utils.ad.layout.onMeasureNative,
    onLayout: utils.ad.layout.onLayoutNative
});
var ScrollView = (function (_super) {
    __extends(ScrollView, _super);
    function ScrollView() {
        _super.apply(this, arguments);
        this._contentDesiredSize = geometry.Size.empty;
        this._scrollableLength = 0;
    }
    Object.defineProperty(ScrollView.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "_nativeView", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
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
            if (!this._android) {
                return 0;
            }
            return this._android.getScrollX() / utils.ad.layout.getDisplayDensity();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "verticalOffset", {
        get: function () {
            if (!this._android) {
                return 0;
            }
            return this._android.getScrollY() / utils.ad.layout.getDisplayDensity();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "scrollableWidth", {
        get: function () {
            if (!this._android || this.orientation !== enums.Orientation.horizontal) {
                return 0;
            }
            return this._scrollableLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "scrollableHeight", {
        get: function () {
            if (!this._android || this.orientation !== enums.Orientation.vertical) {
                return 0;
            }
            return this._scrollableLength;
        },
        enumerable: true,
        configurable: true
    });
    ScrollView.prototype.scrollToVerticalOffset = function (value, animated) {
        if (this._android && this.orientation === enums.Orientation.vertical) {
            value *= utils.ad.layout.getDisplayDensity();
            var scrollView = this._android;
            if (animated) {
                scrollView.smoothScrollTo(0, value);
            }
            else {
                scrollView.scrollTo(0, value);
            }
        }
    };
    ScrollView.prototype.scrollToHorizontalOffset = function (value, animated) {
        if (this._android && this.orientation === enums.Orientation.horizontal) {
            value *= utils.ad.layout.getDisplayDensity();
            var scrollView = this._android;
            if (animated) {
                scrollView.smoothScrollTo(value, 0);
            }
            else {
                scrollView.scrollTo(value, 0);
            }
        }
    };
    ScrollView.prototype._createUI = function () {
        if (this.orientation === enums.Orientation.horizontal) {
            this._android = new NativeHorizontalScrollView(this._context);
        }
        else {
            this._android = new NativeVerticalScrollView(this._context);
        }
        this._android[OWNER] = this;
    };
    ScrollView.prototype._addViewToNativeVisualTree = function (child) {
        _super.prototype._addViewToNativeVisualTree.call(this, child);
        if (this._android && child._nativeView) {
            this._android.addView(child._nativeView);
            return true;
        }
        return false;
    };
    ScrollView.prototype._removeViewFromNativeVisualTree = function (child) {
        _super.prototype._removeViewFromNativeVisualTree.call(this, child);
        if (this._android && child._nativeView) {
            this._android.removeView(child._nativeView);
        }
    };
    ScrollView.prototype._onOrientationChanged = function (oldValue, newValue) {
        if (this._android) {
            var parent = this.parent;
            if (parent) {
                parent._removeView(this);
            }
            if (parent) {
                parent._addView(this);
            }
        }
    };
    ScrollView.prototype._measureOverride = function (availableSize) {
        if (!this.content) {
            this._scrollableLength = 0;
            this._contentDesiredSize = geometry.Size.empty;
            return geometry.Size.zero;
        }
        var contentMeasureSize;
        if (this.orientation === enums.Orientation.vertical) {
            contentMeasureSize = new geometry.Size(availableSize.width, Number.POSITIVE_INFINITY);
        }
        else {
            contentMeasureSize = new geometry.Size(Number.POSITIVE_INFINITY, availableSize.height);
        }
        this._contentDesiredSize = this.content.measure(contentMeasureSize);
        var result = new geometry.Size(Math.min(availableSize.width, this._contentDesiredSize.width), Math.min(availableSize.height, this._contentDesiredSize.height));
        return result;
    };
    ScrollView.prototype._arrangeOverride = function (finalSize) {
        if (this.content) {
            this.content.arrange(new geometry.Rect(0, 0, finalSize.width, finalSize.height));
        }
        if (this.orientation === enums.Orientation.horizontal) {
            this._scrollableLength = this._contentDesiredSize.width - finalSize.width;
        }
        else {
            this._scrollableLength = this._contentDesiredSize.height - finalSize.height;
        }
        this._scrollableLength = Math.max(0, this._scrollableLength);
    };
    return ScrollView;
})(contentView.ContentView);
exports.ScrollView = ScrollView;
