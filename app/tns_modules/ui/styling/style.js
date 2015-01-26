var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var observable = require("ui/core/dependency-observable");
var color = require("color");
var types = require("utils/types");
var trace = require("trace");
var dependencyObservable = require("ui/core/dependency-observable");
var stylers = require("ui/styling/stylers");
var styleProperty = require("ui/styling/style-property");
var converters = require("ui/styling/converters");
var enums = require("ui/enums");
var geometry = require("utils/geometry");
var Style = (function (_super) {
    __extends(Style, _super);
    function Style(parentView) {
        _super.call(this);
        this._view = parentView;
        this._styler = stylers.getStyler(this._view);
    }
    Object.defineProperty(Style.prototype, "color", {
        get: function () {
            return this._getValue(exports.colorProperty);
        },
        set: function (value) {
            this._setValue(exports.colorProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "backgroundColor", {
        get: function () {
            return this._getValue(exports.backgroundColorProperty);
        },
        set: function (value) {
            this._setValue(exports.backgroundColorProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "fontSize", {
        get: function () {
            return this._getValue(exports.fontSizeProperty);
        },
        set: function (value) {
            this._setValue(exports.fontSizeProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "textAlignment", {
        get: function () {
            return this._getValue(exports.textAlignmentProperty);
        },
        set: function (value) {
            this._setValue(exports.textAlignmentProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "verticalAlignment", {
        get: function () {
            return this._getValue(exports.verticalAlignmentProperty);
        },
        set: function (value) {
            this._setValue(exports.verticalAlignmentProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "horizontalAlignment", {
        get: function () {
            return this._getValue(exports.horizontalAlignmentProperty);
        },
        set: function (value) {
            this._setValue(exports.horizontalAlignmentProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "margin", {
        get: function () {
            return this._getValue(exports.marginProperty);
        },
        set: function (value) {
            this._setValue(exports.marginProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "width", {
        get: function () {
            return this._getValue(exports.widthProperty);
        },
        set: function (value) {
            this._setValue(exports.widthProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "height", {
        get: function () {
            return this._getValue(exports.heightProperty);
        },
        set: function (value) {
            this._setValue(exports.heightProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "minWidth", {
        get: function () {
            return this._getValue(exports.minWidthProperty);
        },
        set: function (value) {
            this._setValue(exports.minWidthProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "minHeight", {
        get: function () {
            return this._getValue(exports.minHeightProperty);
        },
        set: function (value) {
            this._setValue(exports.minHeightProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "maxWidth", {
        get: function () {
            return this._getValue(exports.maxWidthProperty);
        },
        set: function (value) {
            this._setValue(exports.maxWidthProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "maxHeight", {
        get: function () {
            return this._getValue(exports.maxHeightProperty);
        },
        set: function (value) {
            this._setValue(exports.maxHeightProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "visibility", {
        get: function () {
            return this._getValue(exports.visibilityProperty);
        },
        set: function (value) {
            this._setValue(exports.visibilityProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "opacity", {
        get: function () {
            return this._getValue(exports.opacityProperty);
        },
        set: function (value) {
            this._setValue(exports.opacityProperty, value, observable.ValueSource.Local);
        },
        enumerable: true,
        configurable: true
    });
    Style.prototype._resetCssValues = function () {
        var that = this;
        this._eachSetProperty(function (property) {
            that._resetValue(property, observable.ValueSource.Css);
            return true;
        });
    };
    Style.prototype._onPropertyChanged = function (property, oldValue, newValue) {
        trace.write("Style._onPropertyChanged view:" + this._view + ", property: " + property.name + ", oldValue: " + oldValue + ", newValue: " + newValue, trace.categories.Style);
        _super.prototype._onPropertyChanged.call(this, property, oldValue, newValue);
        this._view._checkMetadataOnPropertyChanged(property.metadata);
        this._applyProperty(property, newValue);
    };
    Style.prototype._syncNativeProperties = function () {
        var that = this;
        styleProperty.eachProperty(function (p) {
            var value = that._getValue(p);
            if (types.isDefined(value)) {
                that._applyProperty(p, value);
            }
        });
    };
    Style.prototype._applyProperty = function (property, newValue) {
        this._styler._onPropertyChanged(property, this._view, newValue);
        if (this._view._childrenCount === 0 || !property.metadata.inheritable) {
            return;
        }
        var eachChild = function (child) {
            child.style._inheritStyleProperty(property);
            return true;
        };
        this._view._eachChildView(eachChild);
    };
    Style.prototype._inheritStyleProperty = function (property) {
        if (!property.metadata.inheritable) {
            throw new Error("An attempt was made to inherit a style property which is not marked as 'inheritable'.");
        }
        if (!this._styler.hasHandler(property)) {
            return;
        }
        var currentParent = this._view.parent;
        var valueSource;
        while (currentParent) {
            valueSource = currentParent.style._getValueSource(property);
            if (valueSource > dependencyObservable.ValueSource.Default) {
                this._setValue(property, currentParent.style._getValue(property), dependencyObservable.ValueSource.Inherited);
                break;
            }
            currentParent = currentParent.parent;
        }
    };
    Style.prototype._inheritStyleProperties = function () {
        var _this = this;
        styleProperty.eachInheritableProperty(function (p) {
            _this._inheritStyleProperty(p);
        });
    };
    return Style;
})(observable.DependencyObservable);
exports.Style = Style;
exports.colorProperty = new styleProperty.Property("color", "color", new observable.PropertyMetadata(undefined, observable.PropertyMetadataOptions.Inheritable, undefined, undefined, color.Color.equals), converters.colorConverter);
exports.backgroundColorProperty = new styleProperty.Property("backgroundColor", "background-color", new observable.PropertyMetadata(undefined, observable.PropertyMetadataOptions.None, undefined, undefined, color.Color.equals), converters.colorConverter);
exports.fontSizeProperty = new styleProperty.Property("fontSize", "font-size", new observable.PropertyMetadata(undefined, observable.PropertyMetadataOptions.AffectsMeasure | observable.PropertyMetadataOptions.Inheritable), converters.fontSizeConverter);
exports.textAlignmentProperty = new styleProperty.Property("textAlignment", "text-align", new observable.PropertyMetadata(undefined, observable.PropertyMetadataOptions.AffectsMeasure | observable.PropertyMetadataOptions.Inheritable), converters.textAlignConverter);
function createLayoutInfoSetter(property) {
    return function (data) {
        data.object._view._layoutInfo[property] = data.newValue;
    };
}
function isWidthHeightValid(value) {
    return isNaN(value) || (value >= 0.0 && isFinite(value));
}
function isMinWidthHeightValid(value) {
    return !isNaN(value) && value >= 0.0 && isFinite(value);
}
function isMaxWidthHeightValid(value) {
    return !isNaN(value) && value >= 0.0;
}
exports.widthProperty = new styleProperty.Property("width", "width", new observable.PropertyMetadata(Number.NaN, observable.PropertyMetadataOptions.AffectsMeasure, createLayoutInfoSetter("width"), isWidthHeightValid), converters.numberConverter);
exports.heightProperty = new styleProperty.Property("height", "height", new observable.PropertyMetadata(Number.NaN, observable.PropertyMetadataOptions.AffectsMeasure, createLayoutInfoSetter("height"), isWidthHeightValid), converters.numberConverter);
exports.minWidthProperty = new styleProperty.Property("minWidth", "min-width", new observable.PropertyMetadata(0, observable.PropertyMetadataOptions.AffectsMeasure, createLayoutInfoSetter("minWidth"), isMinWidthHeightValid), converters.numberConverter);
exports.minHeightProperty = new styleProperty.Property("minHeight", "min-height", new observable.PropertyMetadata(0, observable.PropertyMetadataOptions.AffectsMeasure, createLayoutInfoSetter("minHeight"), isMinWidthHeightValid), converters.numberConverter);
exports.maxWidthProperty = new styleProperty.Property("maxWidth", "max-width", new observable.PropertyMetadata(Number.POSITIVE_INFINITY, observable.PropertyMetadataOptions.AffectsMeasure, createLayoutInfoSetter("maxWidth"), isMaxWidthHeightValid), converters.numberConverter);
exports.maxHeightProperty = new styleProperty.Property("maxHeight", "max-height", new observable.PropertyMetadata(Number.POSITIVE_INFINITY, observable.PropertyMetadataOptions.AffectsMeasure, createLayoutInfoSetter("maxHeight"), isMaxWidthHeightValid), converters.numberConverter);
exports.verticalAlignmentProperty = new styleProperty.Property("verticalAlignment", "vertical-align", new observable.PropertyMetadata(enums.VerticalAlignment.stretch, observable.PropertyMetadataOptions.AffectsArrange, createLayoutInfoSetter("verticalAlignment")));
exports.horizontalAlignmentProperty = new styleProperty.Property("horizontalAlignment", "horizontal-align", new observable.PropertyMetadata(enums.HorizontalAlignment.stretch, observable.PropertyMetadataOptions.AffectsArrange, createLayoutInfoSetter("horizontalAlignment")));
exports.marginProperty = new styleProperty.Property("margin", "margin", new observable.PropertyMetadata(new geometry.Thickness(0, 0, 0, 0), observable.PropertyMetadataOptions.AffectsMeasure, createLayoutInfoSetter("margin"), undefined, geometry.Thickness.equals), converters.thicknessConverter);
function isVisibilityValid(value) {
    return value === enums.Visibility.visible || value === enums.Visibility.collapsed;
}
function setLayoutInfoVisibility(data) {
    data.object._view._layoutInfo.isVisible = data.newValue !== enums.Visibility.collapsed;
}
exports.visibilityProperty = new styleProperty.Property("visibility", "visibility", new observable.PropertyMetadata(enums.Visibility.visible, observable.PropertyMetadataOptions.AffectsMeasure | observable.PropertyMetadataOptions.AffectsParentMeasure, setLayoutInfoVisibility, isVisibilityValid), converters.visibilityConverter);
function isOpacityValid(value) {
    var parsedValue = parseFloat(value);
    return !isNaN(parsedValue) && 0 <= parsedValue && parsedValue <= 1;
}
exports.opacityProperty = new styleProperty.Property("opacity", "opacity", new observable.PropertyMetadata(1.0, observable.PropertyMetadataOptions.None, undefined, isOpacityValid), converters.opacityConverter);
stylers._registerDefaultStylers();
