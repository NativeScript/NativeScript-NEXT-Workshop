var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/text-view/text-view-common");
var textBase = require("ui/text-base");
function onEditablePropertyChanged(data) {
    var textView = data.object;
    if (!textView.android) {
        return;
    }
    textView._setNativeEditable(data.newValue);
}
common.editableProperty.metadata.onSetNativeValue = onEditablePropertyChanged;
require("utils/module-merge").merge(common, exports);
var TextView = (function (_super) {
    __extends(TextView, _super);
    function TextView() {
        _super.call(this);
    }
    Object.defineProperty(TextView.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    TextView.prototype._setNativeEditable = function (editable) {
        if (editable) {
            this._android.setKeyListener(this._android.getTag());
        }
        else {
            this._android.setKeyListener(null);
        }
    };
    TextView.prototype._createUI = function () {
        this._android = new android.widget.EditText(this._context);
        this._android.setGravity(android.view.Gravity.TOP | android.view.Gravity.LEFT);
        this._android.setInputType(android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_FLAG_MULTI_LINE);
        this._android.setTag(this._android.getKeyListener());
        this._setNativeEditable(this.editable);
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
    TextView.prototype._onTextPropertyChanged = function (data) {
        this.android.setText(data.newValue + "", android.widget.TextView.BufferType.EDITABLE);
    };
    return TextView;
})(common.TextView);
exports.TextView = TextView;
