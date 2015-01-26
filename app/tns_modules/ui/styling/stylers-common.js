var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var types = require("utils/types");
var trace = require("trace");
var containers = require("utils/containers");
var definition = require("ui/styling/stylers");
var application = require("application");
var registeredStylers = new containers.Dictionary(new containers.StringComparer());
function registerStyler(viewType, styler) {
    registeredStylers.set(viewType, styler);
}
exports.registerStyler = registerStyler;
function getStyler(view) {
    var type = view.typeName;
    var result = registeredStylers.get(type);
    if (!result) {
        trace.write("Creating default styler for type: " + type, trace.categories.Style);
        result = new definition.DefaultStyler();
        registerStyler(type, result);
    }
    return result;
}
exports.getStyler = getStyler;
var Styler = (function () {
    function Styler() {
        this._handlers = {};
    }
    Styler.prototype._onPropertyChanged = function (property, view, newValue) {
        if (global.android && !view.android) {
            return;
        }
        try {
            var handler = this._handlers[property.id];
            if (!handler) {
                trace.write("No handler for property: " + property.name + ", view:" + view, trace.categories.Style);
                return;
            }
            trace.write("Found handler for property: " + property.name + ", view:" + view, trace.categories.Style);
            if (types.isUndefined(newValue)) {
                handler.resetProperty(view);
            }
            else {
                handler.applyProperty(view, newValue);
            }
        }
        catch (ex) {
            trace.write("Error setting property: " + property.name + " on " + view + ": " + ex, trace.categories.Style, trace.messageType.error);
        }
    };
    Styler.prototype.getHandler = function (property) {
        return this._handlers[property.id];
    };
    Styler.prototype.setHandler = function (property, handler) {
        this._handlers[property.id] = handler;
    };
    Styler.prototype.hasHandler = function (property) {
        return !!this._handlers[property.id];
    };
    return Styler;
})();
exports.Styler = Styler;
var EmptyStyler = (function (_super) {
    __extends(EmptyStyler, _super);
    function EmptyStyler() {
        _super.apply(this, arguments);
    }
    return EmptyStyler;
})(Styler);
exports.EmptyStyler = EmptyStyler;
var StylePropertyChangedHandler = (function () {
    function StylePropertyChangedHandler(applyCallback, resetCallback, getNativeValue) {
        this._applyProperty = applyCallback;
        this._resetProperty = resetCallback;
        this._getNativeValue = getNativeValue;
    }
    StylePropertyChangedHandler.prototype.applyProperty = function (view, newValue) {
        if (this._getNativeValue && !this._nativeValue) {
            this._nativeValue = this._getNativeValue(view);
        }
        if (application.android) {
            newValue = newValue.android ? newValue.android : newValue;
        }
        else if (application.ios) {
            newValue = newValue.ios ? newValue.ios : newValue;
        }
        this._applyProperty(view, newValue);
    };
    StylePropertyChangedHandler.prototype.resetProperty = function (view) {
        this._resetProperty(view, this._nativeValue);
    };
    return StylePropertyChangedHandler;
})();
exports.StylePropertyChangedHandler = StylePropertyChangedHandler;
