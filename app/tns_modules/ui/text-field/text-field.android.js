var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/text-field/text-field-common");
var textBase = require("ui/text-base");
function onHintPropertyChanged(data) {
    var textField = data.object;
    if (!textField.android) {
        return;
    }
    textField.android.setHint(data.newValue);
}
common.hintProperty.metadata.onSetNativeValue = onHintPropertyChanged;
function onSecurePropertyChanged(data) {
    var textField = data.object;
    if (!textField.android) {
        return;
    }
    if (data.newValue) {
        textField.android.setInputType(android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD);
    }
    else {
        textField.android.setInputType(android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_NORMAL);
    }
}
common.secureProperty.metadata.onSetNativeValue = onSecurePropertyChanged;
require("utils/module-merge").merge(common, exports);
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(TextField.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    TextField.prototype._createUI = function () {
        this._android = new android.widget.EditText(this._context);
        this._android.setLines(1);
        this._android.setMaxLines(1);
        var that = new WeakRef(this);
        var textWatcher = new android.text.TextWatcher({
            beforeTextChanged: function (text, start, count, after) {
            },
            onTextChanged: function (text, start, before, count) {
            },
            afterTextChanged: function (editable) {
                var owner = that.get();
                if (owner) {
                    owner._onPropertyChangedFromNative(textBase.textProperty, editable.toString());
                }
            }
        });
        this._android.addTextChangedListener(textWatcher);
    };
    TextField.prototype._onTextPropertyChanged = function (data) {
        this.android.setText(data.newValue + "", android.widget.TextView.BufferType.EDITABLE);
    };
    return TextField;
})(common.TextField);
exports.TextField = TextField;
