var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var panel = require("ui/panels/panel");
var geometry = require("utils/geometry");
var proxy = require("ui/core/proxy");
var dependencyObservable = require("ui/core/dependency-observable");
var numberUtils = require("utils/number-utils");
var enums = require("ui/enums");
function isValidOrientation(value) {
    return value === enums.Orientation.vertical || value === enums.Orientation.horizontal;
}
exports.orientationProperty = new dependencyObservable.Property("orientation", "WrapPanel", new proxy.PropertyMetadata(enums.Orientation.horizontal, dependencyObservable.PropertyMetadataOptions.AffectsMeasure, undefined, isValidOrientation));
function isWidthHeightValid(value) {
    return isNaN(value) || (value >= 0.0 && value !== Number.POSITIVE_INFINITY);
}
exports.itemWidthProperty = new dependencyObservable.Property("itemWidth", "WrapPanel", new proxy.PropertyMetadata(Number.NaN, dependencyObservable.PropertyMetadataOptions.AffectsMeasure, undefined, isWidthHeightValid));
exports.itemHeightProperty = new dependencyObservable.Property("itemHeight", "WrapPanel", new proxy.PropertyMetadata(Number.NaN, dependencyObservable.PropertyMetadataOptions.AffectsMeasure, undefined, isWidthHeightValid));
var WrapPanel = (function (_super) {
    __extends(WrapPanel, _super);
    function WrapPanel() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(WrapPanel.prototype, "orientation", {
        get: function () {
            return this._getValue(exports.orientationProperty);
        },
        set: function (value) {
            this._setValue(exports.orientationProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WrapPanel.prototype, "itemWidth", {
        get: function () {
            return this._getValue(exports.itemWidthProperty);
        },
        set: function (value) {
            this._setValue(exports.itemWidthProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WrapPanel.prototype, "itemHeight", {
        get: function () {
            return this._getValue(exports.itemHeightProperty);
        },
        set: function (value) {
            this._setValue(exports.itemHeightProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    WrapPanel.prototype._measureOverride = function (constraint) {
        var currentLineSize = new UVSize(this.orientation);
        var panelSize = new UVSize(this.orientation);
        var uvConstraint = new UVSize(this.orientation, constraint.width, constraint.height);
        var itemWidth = this.itemWidth;
        var itemHeight = this.itemHeight;
        var itemWidthSet = !isNaN(itemWidth);
        var itemHeightSet = !isNaN(itemHeight);
        var childConstraint = new geometry.Size((itemWidthSet ? itemWidth : constraint.width), (itemHeightSet ? itemHeight : constraint.height));
        var i;
        var childrenLength = this._children.length;
        for (i = 0; i < childrenLength; i++) {
            var child = this._children[i];
            if (!(child && child._isVisible)) {
                continue;
            }
            var childDesiredSize = child.measure(childConstraint);
            var childUVSize = new UVSize(this.orientation, (itemWidthSet ? itemWidth : childDesiredSize.width), (itemHeightSet ? itemHeight : childDesiredSize.height));
            if (numberUtils.greaterThan(currentLineSize.U + childUVSize.U, uvConstraint.U)) {
                panelSize.U = Math.max(currentLineSize.U, panelSize.U);
                panelSize.V += currentLineSize.V;
                currentLineSize = childUVSize;
                if (numberUtils.greaterThan(childUVSize.U, uvConstraint.U)) {
                    panelSize.U = Math.max(childUVSize.U, panelSize.U);
                    panelSize.V += childUVSize.V;
                    currentLineSize = new UVSize(this.orientation);
                }
            }
            else {
                currentLineSize.U += childUVSize.U;
                currentLineSize.V = Math.max(childUVSize.V, currentLineSize.V);
            }
        }
        panelSize.U = Math.max(currentLineSize.U, panelSize.U);
        panelSize.V += currentLineSize.V;
        return new geometry.Size(panelSize.width, panelSize.height);
    };
    WrapPanel.prototype._arrangeOverride = function (finalSize) {
        var firstInLine = 0;
        var itemWidth = this.itemWidth;
        var itemHeight = this.itemHeight;
        var accumulatedV = 0.0;
        var itemU = (this.orientation === enums.Orientation.horizontal ? itemWidth : itemHeight);
        var curLineSize = new UVSize(this.orientation);
        var uvFinalSize = new UVSize(this.orientation, finalSize.width, finalSize.height);
        var itemWidthSet = !isNaN(itemWidth);
        var itemHeightSet = !isNaN(itemHeight);
        var useItemU = (this.orientation === enums.Orientation.horizontal ? itemWidthSet : itemHeightSet);
        var children = this._children;
        for (var i = 0, count = children.length; i < count; i++) {
            var child = children[i];
            if (!(child && child._isVisible)) {
                continue;
            }
            var childDesiredSize = child._getDesiredSize();
            var sz = new UVSize(this.orientation, (itemWidthSet ? itemWidth : childDesiredSize.width), (itemHeightSet ? itemHeight : childDesiredSize.height));
            if (numberUtils.greaterThan(curLineSize.U + sz.U, uvFinalSize.U)) {
                this._arrangeLine(accumulatedV, curLineSize.V, firstInLine, i, useItemU, itemU);
                accumulatedV += curLineSize.V;
                curLineSize = sz;
                if (numberUtils.greaterThan(sz.U, uvFinalSize.U)) {
                    this._arrangeLine(accumulatedV, sz.V, i, ++i, useItemU, itemU);
                    accumulatedV += sz.V;
                    curLineSize = new UVSize(this.orientation);
                }
                firstInLine = i;
            }
            else {
                curLineSize.U += sz.U;
                curLineSize.V = Math.max(sz.V, curLineSize.V);
            }
        }
        if (firstInLine < children.length) {
            this._arrangeLine(accumulatedV, curLineSize.V, firstInLine, children.length, useItemU, itemU);
        }
    };
    WrapPanel.prototype._arrangeLine = function (v, lineV, start, end, useItemU, itemU) {
        var u = 0;
        var isHorizontal = (this.orientation === enums.Orientation.horizontal);
        var i;
        for (i = start; i < end; i++) {
            var child = this._children[i];
            if (!(child && child._isVisible)) {
                continue;
            }
            var childDesiredSize = child._layoutInfo.desiredSize;
            var childSize = new UVSize(this.orientation, childDesiredSize.width, childDesiredSize.height);
            var layoutSlotU = (useItemU ? itemU : childSize.U);
            child.arrange(new geometry.Rect((isHorizontal ? u : v), (isHorizontal ? v : u), (isHorizontal ? layoutSlotU : lineV), (isHorizontal ? lineV : layoutSlotU)));
            u += layoutSlotU;
        }
    };
    return WrapPanel;
})(panel.Panel);
exports.WrapPanel = WrapPanel;
var UVSize = (function () {
    function UVSize(orientation, width, height) {
        this.U = 0.0;
        this.V = 0.0;
        this._orientation = orientation;
        if (width) {
            this.width = width;
        }
        if (height) {
            this.height = height;
        }
    }
    Object.defineProperty(UVSize.prototype, "width", {
        get: function () {
            return this._orientation === enums.Orientation.horizontal ? this.U : this.V;
        },
        set: function (value) {
            if (this._orientation === enums.Orientation.horizontal) {
                this.U = value;
            }
            else {
                this.V = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UVSize.prototype, "height", {
        get: function () {
            return this._orientation === enums.Orientation.horizontal ? this.V : this.U;
        },
        set: function (value) {
            if (this._orientation === enums.Orientation.horizontal) {
                this.V = value;
            }
            else {
                this.U = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    return UVSize;
})();
