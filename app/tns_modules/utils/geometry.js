var types = require("utils/types");
var definition = require("utils/geometry");
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Object.defineProperty(Point, "zero", {
        get: function () {
            return new Point(0, 0);
        },
        enumerable: true,
        configurable: true
    });
    Point.prototype.equals = function (value) {
        return this.x === value.x && this.y === value.y;
    };
    Point.equals = function (value1, value2) {
        if (!value1 || !value2) {
            return false;
        }
        return value1.equals(value2);
    };
    Point.prototype.toString = function () {
        return "x: " + this.x + ", y: " + this.y;
    };
    return Point;
})();
exports.Point = Point;
var Size = (function () {
    function Size(width, height) {
        this.width = width;
        this.height = height;
    }
    Object.defineProperty(Size, "empty", {
        get: function () {
            return new Size(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Size, "zero", {
        get: function () {
            return new Size(0, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Size.prototype, "isEmpty", {
        get: function () {
            return this.width < 0;
        },
        enumerable: true,
        configurable: true
    });
    Size.prototype.equals = function (value) {
        return this.width === value.width && this.height === value.height;
    };
    Size.equals = function (value1, value2) {
        if (!value1 || !value2) {
            return false;
        }
        if (value1.isEmpty) {
            return value2.isEmpty;
        }
        return value1.equals(value2);
    };
    Size.prototype.toString = function () {
        return "width: " + this.width + ", height: " + this.height;
    };
    return Size;
})();
exports.Size = Size;
var Rect = (function () {
    function Rect(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Object.defineProperty(Rect, "empty", {
        get: function () {
            return new Rect(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "size", {
        get: function () {
            return new Size(this.width, this.height);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "origin", {
        get: function () {
            return new Point(this.x, this.y);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "isEmpty", {
        get: function () {
            return this.width < 0;
        },
        enumerable: true,
        configurable: true
    });
    Rect.prototype.equals = function (value) {
        return this.origin.equals(value.origin) && this.size.equals(value.size);
    };
    Rect.equals = function (value1, value2) {
        if (!value1 || !value2) {
            return false;
        }
        if (value1.isEmpty) {
            return value2.isEmpty;
        }
        return value1.equals(value2);
    };
    Rect.prototype.toString = function () {
        return this.origin.toString() + ", " + this.size.toString();
    };
    return Rect;
})();
exports.Rect = Rect;
var Thickness = (function () {
    function Thickness(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
    Thickness.prototype.equals = function (value) {
        return this.left === value.left && this.top === value.top && this.right === value.right && this.bottom === value.bottom;
    };
    Thickness.equals = function (value1, value2) {
        if (!value1 || !value2) {
            return false;
        }
        return value1.equals(value2);
    };
    Thickness.prototype.toString = function () {
        return "left: " + this.left + ", top: " + this.top + ", right: " + this.right + ", bottom: " + this.bottom;
    };
    Thickness.convert = function (value) {
        if (types.isString(value)) {
            var arr = value.split(",");
            var left = parseInt(arr[0]) || 0;
            var top = parseInt(arr[1]) || left;
            var right = parseInt(arr[2]) || left;
            var bottom = parseInt(arr[3]) || top;
            return new Thickness(left, top, right, bottom);
        }
        else if (value instanceof definition.Thickness) {
            return value;
        }
        else {
            return new Thickness(0, 0, 0, 0);
        }
    };
    return Thickness;
})();
exports.Thickness = Thickness;
