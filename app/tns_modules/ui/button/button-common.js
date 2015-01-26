var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var dependencyObservable = require("ui/core/dependency-observable");
var view = require("ui/core/view");
var proxy = require("ui/core/proxy");
var observable = require("data/observable");
var weakEventListener = require("ui/core/weakEventListener");
var knownEvents;
(function (knownEvents) {
    knownEvents.click = "click";
})(knownEvents = exports.knownEvents || (exports.knownEvents = {}));
exports.textProperty = new dependencyObservable.Property("text", "Button", new proxy.PropertyMetadata("", dependencyObservable.PropertyMetadataOptions.AffectsMeasure));
exports.formattedTextProperty = new dependencyObservable.Property("formattedText", "Button", new proxy.PropertyMetadata("", dependencyObservable.PropertyMetadataOptions.AffectsMeasure));
function onTextPropertyChanged(data) {
    var button = data.object;
    button._onTextPropertyChanged(data);
}
function onFormattedTextPropertyChanged(data) {
    var button = data.object;
    button._onFormattedTextPropertyChanged(data);
}
exports.textProperty.metadata.onSetNativeValue = onTextPropertyChanged;
exports.formattedTextProperty.metadata.onSetNativeValue = onFormattedTextPropertyChanged;
var Button = (function (_super) {
    __extends(Button, _super);
    function Button() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(Button.prototype, "text", {
        get: function () {
            return this._getValue(exports.textProperty);
        },
        set: function (value) {
            this._setValue(exports.textProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "formattedText", {
        get: function () {
            return this._getValue(exports.formattedTextProperty);
        },
        set: function (value) {
            if (this.formattedText !== value) {
                var weakEventOptions = {
                    target: new WeakRef(this),
                    eventName: observable.knownEvents.propertyChange,
                    source: new WeakRef(value),
                    handler: this.onFormattedTextChanged,
                    handlerContext: this,
                    key: "formattedText"
                };
                if (this.formattedText) {
                    weakEventListener.WeakEventListener.removeWeakEventListener(weakEventOptions);
                }
                this._setValue(exports.formattedTextProperty, value);
                if (value) {
                    weakEventListener.WeakEventListener.addWeakEventListener(weakEventOptions);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Button.prototype.onFormattedTextChanged = function (eventData) {
        this.setFormattedTextPropertyToNative(eventData.value);
    };
    Button.prototype._onTextPropertyChanged = function (data) {
        if (this.android) {
            this.android.setText(data.newValue);
        }
        if (this.ios) {
            this.ios.setTitleForState(data.newValue, UIControlState.UIControlStateNormal);
        }
    };
    Button.prototype.setFormattedTextPropertyToNative = function (value) {
        if (this.android) {
            this.android.setText(value._formattedText);
        }
        if (this.ios) {
            this.ios.setAttributedTitleForState(value._formattedText, UIControlState.UIControlStateNormal);
        }
    };
    Button.prototype._onFormattedTextPropertyChanged = function (data) {
        this.setFormattedTextPropertyToNative(data.newValue);
    };
    return Button;
})(view.View);
exports.Button = Button;
