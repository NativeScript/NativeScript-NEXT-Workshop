var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/text-field/text-field-common");
var textBase = require("ui/text-base");
var OWNER = "_owner";
function onHintPropertyChanged(data) {
    var textField = data.object;
    textField.ios.placeholder = data.newValue;
}
common.hintProperty.metadata.onSetNativeValue = onHintPropertyChanged;
function onSecurePropertyChanged(data) {
    var textField = data.object;
    textField.ios.secureTextEntry = data.newValue;
}
common.secureProperty.metadata.onSetNativeValue = onSecurePropertyChanged;
require("utils/module-merge").merge(common, exports);
var UITextFieldDelegateClass = NSObject.extend({
    textFieldDidEndEditing: function (field) {
        var weakRef = this[OWNER];
        if (weakRef) {
            var owner = weakRef.get();
            if (owner) {
                owner._onPropertyChangedFromNative(textBase.textProperty, field.text);
            }
        }
    }
}, {
    protocols: [UITextFieldDelegate]
});
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.call(this);
        this._ios = new UITextField();
        this._delegate = UITextFieldDelegateClass.alloc();
        this._delegate[OWNER] = new WeakRef(this);
        this._ios.delegate = this._delegate;
    }
    Object.defineProperty(TextField.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    return TextField;
})(common.TextField);
exports.TextField = TextField;
