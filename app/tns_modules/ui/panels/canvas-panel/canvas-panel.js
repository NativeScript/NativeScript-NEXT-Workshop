var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var panel = require("ui/panels/panel");
var geometry = require("utils/geometry");
var observable = require("ui/core/dependency-observable");
var numberUtils = require("utils/number-utils");
var CanvasPanel = (function (_super) {
    __extends(CanvasPanel, _super);
    function CanvasPanel() {
        _super.apply(this, arguments);
    }
    CanvasPanel.getLeft = function (element) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        return element._getValue(CanvasPanel.LeftProperty);
    };
    CanvasPanel.setLeft = function (element, value) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        element._setValue(CanvasPanel.LeftProperty, value);
    };
    CanvasPanel.getTop = function (element) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        return element._getValue(CanvasPanel.TopProperty);
    };
    CanvasPanel.setTop = function (element, value) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        element._setValue(CanvasPanel.TopProperty, value);
    };
    CanvasPanel.getRight = function (element) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        return element._getValue(CanvasPanel.RightProperty);
    };
    CanvasPanel.setRight = function (element, value) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        element._setValue(CanvasPanel.RightProperty, value);
    };
    CanvasPanel.getBottom = function (element) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        return element._getValue(CanvasPanel.BottomProperty);
    };
    CanvasPanel.setBottom = function (element, value) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        element._setValue(CanvasPanel.BottomProperty, value);
    };
    CanvasPanel.prototype._measureOverride = function (constraint) {
        var childConstraint = new geometry.Size(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
        var i;
        var childrenLength = this._children.length;
        for (i = 0; i < childrenLength; i++) {
            var child = this._children[i];
            if (!(child && child._isVisible)) {
                continue;
            }
            child.measure(childConstraint);
        }
        return geometry.Size.zero;
    };
    CanvasPanel.prototype._arrangeOverride = function (arrangeSize) {
        var i;
        var childrenLength = this._children.length;
        for (i = 0; i < childrenLength; i++) {
            var child = this._children[i];
            if (!(child && child._isVisible)) {
                continue;
            }
            var childDesiredSize = child._getDesiredSize();
            var x = 0.0;
            var y = 0.0;
            var left = CanvasPanel.getLeft(child);
            if (!isNaN(left)) {
                x = left;
            }
            else {
                var right = CanvasPanel.getRight(child);
                if (!isNaN(right)) {
                    x = arrangeSize.width - childDesiredSize.width - right;
                }
            }
            var top = CanvasPanel.getTop(child);
            if (!isNaN(top)) {
                y = top;
            }
            else {
                var bottom = CanvasPanel.getBottom(child);
                if (!isNaN(bottom)) {
                    y = arrangeSize.height - childDesiredSize.height - bottom;
                }
            }
            child.arrange(new geometry.Rect(x, y, childDesiredSize.width, childDesiredSize.height));
        }
    };
    CanvasPanel.LeftProperty = new observable.Property("Left", "CanvasPanel", new observable.PropertyMetadata(Number.NaN, observable.PropertyMetadataOptions.AffectsParentArrange, undefined, numberUtils.isFiniteNumberOrNaN));
    CanvasPanel.TopProperty = new observable.Property("Top", "CanvasPanel", new observable.PropertyMetadata(Number.NaN, observable.PropertyMetadataOptions.AffectsParentArrange, undefined, numberUtils.isFiniteNumberOrNaN));
    CanvasPanel.RightProperty = new observable.Property("Right", "CanvasPanel", new observable.PropertyMetadata(Number.NaN, observable.PropertyMetadataOptions.AffectsParentArrange, undefined, numberUtils.isFiniteNumberOrNaN));
    CanvasPanel.BottomProperty = new observable.Property("Bottom", "CanvasPanel", new observable.PropertyMetadata(Number.NaN, observable.PropertyMetadataOptions.AffectsParentArrange, undefined, numberUtils.isFiniteNumberOrNaN));
    return CanvasPanel;
})(panel.Panel);
exports.CanvasPanel = CanvasPanel;
