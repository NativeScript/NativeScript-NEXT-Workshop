var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/text-view/text-view-common");
var textBase = require("ui/text-base");
var OWNER = "_owner";
function onEditablePropertyChanged(data) {
    var textView = data.object;
    textView.ios.editable = data.newValue;
}
common.editableProperty.metadata.onSetNativeValue = onEditablePropertyChanged;
require("utils/module-merge").merge(common, exports);
var UITextViewDelegateClass = NSObject.extend({
    textViewDidEndEditing: function (textView) {
        var weakRef = this[OWNER];
        if (weakRef) {
            var owner = weakRef.get();
            if (owner) {
                owner._onPropertyChangedFromNative(textBase.textProperty, textView.text);
            }
        }
    }
}, {
    protocols: [UITextViewDelegate]
});
var TextView = (function (_super) {
    __extends(TextView, _super);
    function TextView() {
        _super.call(this);
        this._ios = new UITextView();
        if (!this._ios.font) {
            this._ios.font = UIFont.systemFontOfSize(12);
        }
        this._delegate = UITextViewDelegateClass.alloc();
        this._delegate[OWNER] = new WeakRef(this);
        this._ios.delegate = this._delegate;
    }
    Object.defineProperty(TextView.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    return TextView;
})(common.TextView);
exports.TextView = TextView;
