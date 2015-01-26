var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var view = require("ui/core/view");
var observable = require("data/observable");
var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");
var weakEventListener = require("ui/core/weakEventListener");
exports.textProperty = new dependencyObservable.Property("text", "TextBase", new proxy.PropertyMetadata("", dependencyObservable.PropertyMetadataOptions.AffectsMeasure));
exports.formattedTextProperty = new dependencyObservable.Property("formattedText", "TextBase", new proxy.PropertyMetadata("", dependencyObservable.PropertyMetadataOptions.AffectsMeasure));
function onTextPropertyChanged(data) {
    var textBase = data.object;
    textBase._onTextPropertyChanged(data);
}
exports.textProperty.metadata.onSetNativeValue = onTextPropertyChanged;
function onFormattedTextPropertyChanged(data) {
    var textBase = data.object;
    textBase._onFormattedTextPropertyChanged(data);
}
exports.formattedTextProperty.metadata.onSetNativeValue = onFormattedTextPropertyChanged;
var TextBase = (function (_super) {
    __extends(TextBase, _super);
    function TextBase(options) {
        _super.call(this, options);
    }
    Object.defineProperty(TextBase.prototype, "text", {
        get: function () {
            return this._getValue(exports.textProperty);
        },
        set: function (value) {
            this._setValue(exports.textProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, "formattedText", {
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
    TextBase.prototype.onFormattedTextChanged = function (eventData) {
        this.setFormattedTextPropertyToNative(eventData.value);
    };
    TextBase.prototype._onTextPropertyChanged = function (data) {
        if (this.android) {
            this.android.setText(data.newValue + "");
        }
        else if (this.ios) {
            this.ios.text = data.newValue + "";
        }
    };
    TextBase.prototype.setFormattedTextPropertyToNative = function (value) {
        if (this.android) {
            this.android.setText(value._formattedText);
        }
        else if (this.ios) {
            this.ios.attributedText = value._formattedText;
        }
    };
    TextBase.prototype._onFormattedTextPropertyChanged = function (data) {
        this.setFormattedTextPropertyToNative(data.newValue);
    };
    return TextBase;
})(view.View);
exports.TextBase = TextBase;
