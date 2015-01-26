var enums = require("ui/enums");
var geometry = require("utils/geometry");
var MinMax = (function () {
    function MinMax(layoutInfo) {
        this.minHeight = layoutInfo.minHeight;
        this.maxHeight = layoutInfo.maxHeight;
        var length = layoutInfo.height;
        var current = isNaN(length) ? Number.POSITIVE_INFINITY : length;
        this.maxHeight = Math.max(Math.min(current, this.maxHeight), this.minHeight);
        current = isNaN(length) ? 0.0 : length;
        this.minHeight = Math.max(Math.min(this.maxHeight, current), this.minHeight);
        this.maxWidth = layoutInfo.maxWidth;
        this.minWidth = layoutInfo.minWidth;
        length = layoutInfo.width;
        current = isNaN(length) ? Number.POSITIVE_INFINITY : length;
        this.maxWidth = Math.max(Math.min(current, this.maxWidth), this.minWidth);
        current = isNaN(length) ? 0.0 : length;
        this.minWidth = Math.max(Math.min(this.maxWidth, current), this.minWidth);
    }
    MinMax.prototype.toString = function () {
        return "minWidth: " + this.minWidth + ", maxWidth: " + this.maxWidth + ", minHeight: " + this.minHeight + ", maxHeight: " + this.maxHeight;
    };
    return MinMax;
})();
exports.MinMax = MinMax;
var LayoutInfoBase = (function () {
    function LayoutInfoBase(view) {
        this._width = Number.NaN;
        this._height = Number.NaN;
        this._minWidth = 0;
        this._minHeight = 0;
        this._maxWidth = Number.POSITIVE_INFINITY;
        this._maxHeight = Number.POSITIVE_INFINITY;
        this._margin = new geometry.Thickness(0, 0, 0, 0);
        this._horizontalAlignment = enums.HorizontalAlignment.stretch;
        this._verticalAlignment = enums.VerticalAlignment.stretch;
        this._isVisible = true;
        this._view = view;
    }
    Object.defineProperty(LayoutInfoBase.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (value) {
            this._width = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutInfoBase.prototype, "height", {
        get: function () {
            return this._height;
        },
        set: function (value) {
            this._height = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutInfoBase.prototype, "maxWidth", {
        get: function () {
            return this._maxWidth;
        },
        set: function (value) {
            this._maxWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutInfoBase.prototype, "maxHeight", {
        get: function () {
            return this._maxHeight;
        },
        set: function (value) {
            this._maxHeight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutInfoBase.prototype, "minHeight", {
        get: function () {
            return this._minHeight;
        },
        set: function (value) {
            this._minHeight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutInfoBase.prototype, "minWidth", {
        get: function () {
            return this._minWidth;
        },
        set: function (value) {
            this._minWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutInfoBase.prototype, "horizontalAlignment", {
        get: function () {
            return this._horizontalAlignment;
        },
        set: function (value) {
            this._horizontalAlignment = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutInfoBase.prototype, "verticalAlignment", {
        get: function () {
            return this._verticalAlignment;
        },
        set: function (value) {
            this._verticalAlignment = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutInfoBase.prototype, "margin", {
        get: function () {
            return this._margin;
        },
        set: function (margin) {
            this._margin = margin;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutInfoBase.prototype, "isVisible", {
        get: function () {
            return this._isVisible;
        },
        set: function (value) {
            this._isVisible = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutInfoBase.prototype, "view", {
        get: function () {
            return this._view;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutInfoBase.prototype, "parent", {
        get: function () {
            return this.view.parent;
        },
        enumerable: true,
        configurable: true
    });
    LayoutInfoBase.prototype.invalidateMeasure = function () {
    };
    LayoutInfoBase.prototype.invalidateArrange = function () {
    };
    LayoutInfoBase.prototype.measure = function (availableSize, options) {
    };
    LayoutInfoBase.prototype.arrange = function (arrangeSize, options) {
    };
    LayoutInfoBase.prototype.updateLayout = function () {
    };
    LayoutInfoBase.prototype.suspendLayoutDispatching = function () {
    };
    LayoutInfoBase.prototype.resumeLayoutDispatching = function () {
    };
    return LayoutInfoBase;
})();
exports.LayoutInfoBase = LayoutInfoBase;
