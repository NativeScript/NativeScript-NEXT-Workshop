var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/core/layout-common");
var trace = require("trace");
var enums = require("ui/enums");
var geometry = require("utils/geometry");
require("utils/module-merge").merge(common, exports);
var LayoutInfo = (function (_super) {
    __extends(LayoutInfo, _super);
    function LayoutInfo(view) {
        _super.call(this, view);
        this.availableSize = geometry.Size.zero;
        this.visualOffset = geometry.Point.zero;
        this.needsClipBounds = false;
        this.renderSize = geometry.Size.zero;
        this.desiredSize = geometry.Size.zero;
    }
    Object.defineProperty(LayoutInfo.prototype, "nativeView", {
        get: function () {
            return this.view._nativeView;
        },
        enumerable: true,
        configurable: true
    });
    LayoutInfo.prototype.invalidateMeasure = function () {
        if (this.nativeView) {
            this.nativeView.requestLayout();
        }
    };
    LayoutInfo.prototype.invalidateArrange = function () {
        this.invalidateMeasure();
    };
    LayoutInfo.prototype.measure = function (availableSize, options) {
        trace.write("Measure: " + this.view + " with: " + availableSize, trace.categories.Layout);
        if (isNaN(availableSize.width) || isNaN(availableSize.height)) {
            throw new Error("Layout NaN measure.");
        }
        this.availableSize = new geometry.Size(availableSize.width, availableSize.height);
        var size = this.measureCore(this.availableSize, options);
        var width = size.width;
        var height = size.height;
        if (!isFinite(width) || !isFinite(height) || isNaN(width) || isNaN(height)) {
            throw new Error("Layout Infinity/NaN returned.");
        }
        this.desiredSize = size;
        trace.write(this.view + " - DesiredSize = " + size, trace.categories.Layout);
    };
    LayoutInfo.prototype.measureCore = function (availableSize, options) {
        var margin = this.margin;
        var horizontalMargin = (margin) ? margin.left + margin.right : 0.0;
        var verticalMargin = (margin) ? margin.top + margin.bottom : 0.0;
        var mm = new common.MinMax(this);
        var frameworkAvailableSize = new geometry.Size(Math.max(availableSize.width - horizontalMargin, 0), Math.max(availableSize.height - verticalMargin, 0));
        frameworkAvailableSize.width = Math.max(mm.minWidth, Math.min(frameworkAvailableSize.width, mm.maxWidth));
        frameworkAvailableSize.height = Math.max(mm.minHeight, Math.min(frameworkAvailableSize.height, mm.maxHeight));
        var inNativeMeasure = false;
        if (typeof options === "boolean") {
            inNativeMeasure = options;
        }
        var desiredSize;
        if (inNativeMeasure) {
            desiredSize = this.view._measureOverride(frameworkAvailableSize, options);
        }
        else {
            desiredSize = this.view._measureNativeView(frameworkAvailableSize, options);
        }
        desiredSize.width = Math.max(desiredSize.width, mm.minWidth);
        desiredSize.height = Math.max(desiredSize.height, mm.minHeight);
        var clipped = false;
        if (desiredSize.width > mm.maxWidth) {
            desiredSize.width = mm.maxWidth;
            clipped = true;
        }
        if (desiredSize.height > mm.maxHeight) {
            desiredSize.height = mm.maxHeight;
            clipped = true;
        }
        var desiredWidth = desiredSize.width + horizontalMargin;
        var desiredHeight = desiredSize.height + verticalMargin;
        if (desiredWidth > this.availableSize.width) {
            desiredWidth = this.availableSize.width;
            clipped = true;
        }
        if (desiredHeight > this.availableSize.height) {
            desiredHeight = this.availableSize.height;
            clipped = true;
        }
        if (clipped || desiredWidth < 0 || desiredHeight < 0) {
            this.unclippedDesiredSize = new geometry.Size(desiredSize.width, desiredSize.height);
        }
        else {
            this.unclippedDesiredSize = undefined;
        }
        desiredSize.width = Math.max(0.0, desiredWidth);
        desiredSize.height = Math.max(0.0, desiredHeight);
        return desiredSize;
    };
    LayoutInfo.prototype.arrange = function (finalRect, options) {
        trace.write("Arrange: " + this.view + " with: " + finalRect, trace.categories.Layout);
        var finalSize = finalRect.size;
        if (!isFinite(finalSize.width) || !isFinite(finalSize.height) || isNaN(finalSize.width) || isNaN(finalSize.height)) {
            throw new Error("Layout Infinity/NaN in Arrange is not allowed.");
        }
        this.arrangeCore(finalRect);
        this.finalRect = new geometry.Rect(finalRect.x, finalRect.y, finalRect.width, finalRect.height);
        var inNativeArrange = false;
        if (typeof options === "boolean") {
            inNativeArrange = options;
        }
        if (!inNativeArrange) {
            this.view._setBounds(new geometry.Rect(this.visualOffset.x, this.visualOffset.y, this.renderSize.width, this.renderSize.height));
        }
    };
    LayoutInfo.prototype.arrangeCore = function (finalRect) {
        var needsClipBounds = false;
        var arrangeSize = finalRect.size;
        var margin = this.margin;
        var marginWidth = (margin) ? margin.left + margin.right : 0;
        var marginHeight = (margin) ? margin.top + margin.bottom : 0;
        arrangeSize.width = Math.max(0.0, arrangeSize.width - marginWidth);
        arrangeSize.height = Math.max(0.0, arrangeSize.height - marginHeight);
        var unclippedDS = (this.unclippedDesiredSize) ? this.unclippedDesiredSize : new geometry.Size(Math.max(0.0, this.desiredSize.width - marginWidth), Math.max(0.0, this.desiredSize.height - marginHeight));
        if (arrangeSize.width < unclippedDS.width) {
            needsClipBounds = true;
            arrangeSize.width = unclippedDS.width;
        }
        if (arrangeSize.height < unclippedDS.height) {
            needsClipBounds = true;
            arrangeSize.height = unclippedDS.height;
        }
        if (this.horizontalAlignment !== enums.HorizontalAlignment.stretch) {
            arrangeSize.width = unclippedDS.width;
        }
        if (this.verticalAlignment !== enums.VerticalAlignment.stretch) {
            arrangeSize.height = unclippedDS.height;
        }
        var max = new common.MinMax(this);
        var effectiveMaxWidth = Math.max(unclippedDS.width, max.maxWidth);
        if (effectiveMaxWidth < arrangeSize.width) {
            needsClipBounds = true;
            arrangeSize.width = effectiveMaxWidth;
        }
        var effectiveMaxHeight = Math.max(unclippedDS.height, max.maxHeight);
        if (effectiveMaxHeight < arrangeSize.height) {
            needsClipBounds = true;
            arrangeSize.height = effectiveMaxHeight;
        }
        this.view._arrangeOverride(new geometry.Size(arrangeSize.width, arrangeSize.height));
        this.renderSize = arrangeSize;
        var width = Math.min(arrangeSize.width, max.maxWidth);
        var height = Math.min(arrangeSize.height, max.maxHeight);
        needsClipBounds = needsClipBounds || width < arrangeSize.width || height < arrangeSize.height;
        var finalSize = finalRect.size;
        var constrained = new geometry.Size(Math.max(0.0, finalSize.width - marginWidth), Math.max(0.0, finalSize.height - marginHeight));
        needsClipBounds = needsClipBounds || constrained.width < width || constrained.height < height;
        this.needsClipBounds = needsClipBounds;
        var offset = this.computeAlignmentOffset(constrained, new geometry.Size(width, height));
        offset.x += finalRect.x + margin.left;
        offset.y += finalRect.y + margin.top;
        this.visualOffset = offset;
    };
    LayoutInfo.prototype.computeAlignmentOffset = function (clientSize, renderSize) {
        var point = geometry.Point.zero;
        var horizontalAlignment = this.horizontalAlignment;
        if (horizontalAlignment === enums.HorizontalAlignment.stretch && renderSize.width > clientSize.width) {
            horizontalAlignment = enums.HorizontalAlignment.left;
        }
        var verticalAlignment = this.verticalAlignment;
        if (verticalAlignment === enums.VerticalAlignment.stretch && renderSize.height > clientSize.height) {
            verticalAlignment = enums.VerticalAlignment.top;
        }
        switch (horizontalAlignment) {
            case enums.HorizontalAlignment.center:
            case enums.HorizontalAlignment.stretch:
                point.x = (clientSize.width - renderSize.width) / 2;
                break;
            case enums.HorizontalAlignment.right:
                point.x = clientSize.width - renderSize.width;
                break;
            default:
                break;
        }
        switch (verticalAlignment) {
            case enums.VerticalAlignment.center:
            case enums.VerticalAlignment.stretch:
                point.y = (clientSize.height - renderSize.height) / 2;
                break;
            case enums.VerticalAlignment.bottom:
                point.y = clientSize.height - renderSize.height;
                break;
            default:
                break;
        }
        return point;
    };
    LayoutInfo.prototype.updateLayout = function () {
    };
    LayoutInfo.propagateSuspendLayout = function (layout) {
    };
    LayoutInfo.propagateResumeLayout = function (parent, layout) {
    };
    return LayoutInfo;
})(common.LayoutInfoBase);
exports.LayoutInfo = LayoutInfo;
