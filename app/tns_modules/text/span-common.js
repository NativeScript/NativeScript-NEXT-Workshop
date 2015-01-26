var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var bindable = require("ui/core/bindable");
var Span = (function (_super) {
    __extends(Span, _super);
    function Span() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(Span.prototype, "fontFamily", {
        get: function () {
            return this._fontFamily;
        },
        set: function (value) {
            if (this._fontFamily !== value) {
                this._fontFamily = value;
                this.updateAndNotify();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Span.prototype, "fontSize", {
        get: function () {
            return this._fontSize;
        },
        set: function (value) {
            if (this._fontSize !== value) {
                this._fontSize = value;
                this.updateAndNotify();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Span.prototype, "foregroundColor", {
        get: function () {
            return this._foregroundColor;
        },
        set: function (value) {
            if (this._foregroundColor !== value) {
                this._foregroundColor = value;
                this.updateAndNotify();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Span.prototype, "backgroundColor", {
        get: function () {
            return this._backgroundColor;
        },
        set: function (value) {
            if (this._backgroundColor !== value) {
                this._backgroundColor = value;
                this.updateAndNotify();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Span.prototype, "underline", {
        get: function () {
            return this._underline;
        },
        set: function (value) {
            if (this._underline !== value) {
                this._underline = value;
                this.updateAndNotify();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Span.prototype, "strikethrough", {
        get: function () {
            return this._strikethrough;
        },
        set: function (value) {
            if (this._strikethrough !== value) {
                this._strikethrough = value;
                this.updateAndNotify();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Span.prototype, "fontAttributes", {
        get: function () {
            return this._fontAttributes;
        },
        set: function (value) {
            if (this._fontAttributes !== value) {
                this._fontAttributes = value;
                this.updateAndNotify();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Span.prototype, "spanModifiers", {
        get: function () {
            if (!this._spanModifiers) {
                this._spanModifiers = new Array();
            }
            return this._spanModifiers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Span.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (value) {
            if (this._text !== value) {
                this._text = value;
                this.updateAndNotify();
            }
        },
        enumerable: true,
        configurable: true
    });
    Span.prototype.updateSpanModifiers = function () {
        if (this._isInEditMode) {
            throw new Error("Cannot update span modifiers during update!");
        }
        this._spanModifiers = new Array();
    };
    Span.prototype.beginEdit = function () {
        this._isInEditMode = true;
    };
    Span.prototype.updateAndNotify = function () {
        if (!this._isInEditMode) {
            this.updateSpanModifiers();
            this.notify(this._createPropertyChangeData(".", this));
        }
    };
    Span.prototype.endEdit = function () {
        this._isInEditMode = false;
        this.updateAndNotify();
    };
    return Span;
})(bindable.Bindable);
exports.Span = Span;
