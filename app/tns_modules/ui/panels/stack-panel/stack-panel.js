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
var enums = require("ui/enums");
function isValidOrientation(value) {
    return value === enums.Orientation.vertical || value === enums.Orientation.horizontal;
}
exports.orientationProperty = new dependencyObservable.Property("orientation", "StackPanel", new proxy.PropertyMetadata(enums.Orientation.vertical, dependencyObservable.PropertyMetadataOptions.AffectsMeasure, undefined, isValidOrientation));
var StackPanel = (function (_super) {
    __extends(StackPanel, _super);
    function StackPanel() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(StackPanel.prototype, "orientation", {
        get: function () {
            return this._getValue(exports.orientationProperty);
        },
        set: function (value) {
            this._setValue(exports.orientationProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    StackPanel.prototype._measureOverride = function (availableSize) {
        var isHorizontal = this.orientation === enums.Orientation.horizontal;
        var desiredSize = new geometry.Size(0, 0);
        var measureSize = isHorizontal ? new geometry.Size(Number.POSITIVE_INFINITY, availableSize.height) : new geometry.Size(availableSize.width, Number.POSITIVE_INFINITY);
        for (var i = 0; i < this._children.length; i++) {
            var child = this._children[i];
            if (child && child._isVisible) {
                var childDesiredSize = child.measure(measureSize);
                if (isHorizontal) {
                    desiredSize.width += childDesiredSize.width;
                    desiredSize.height = Math.max(desiredSize.height, childDesiredSize.height);
                }
                else {
                    desiredSize.height += childDesiredSize.height;
                    desiredSize.width = Math.max(desiredSize.width, childDesiredSize.width);
                }
            }
        }
        return desiredSize;
    };
    StackPanel.prototype._arrangeOverride = function (finalSize) {
        var isHorizontal = this.orientation === enums.Orientation.horizontal;
        var arrangeRect = new geometry.Rect(0, 0, 0, 0);
        for (var i = 0; i < this._children.length; i++) {
            var child = this._children[i];
            if (child && child._isVisible) {
                var childDesiredSize = child._layoutInfo.desiredSize;
                if (isHorizontal) {
                    arrangeRect.width = childDesiredSize.width;
                    arrangeRect.height = Math.max(finalSize.height, childDesiredSize.height);
                    child.arrange(arrangeRect);
                    arrangeRect.x += arrangeRect.width;
                }
                else {
                    arrangeRect.height = childDesiredSize.height;
                    arrangeRect.width = Math.max(finalSize.width, childDesiredSize.width);
                    child.arrange(arrangeRect);
                    arrangeRect.y += arrangeRect.height;
                }
            }
        }
    };
    return StackPanel;
})(panel.Panel);
exports.StackPanel = StackPanel;
