var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/list-picker/list-picker-common");
var types = require("utils/types");
function onSelectedIndexPropertyChanged(data) {
    var picker = data.object;
    if (picker.android && types.isNumber(data.newValue)) {
        if (types.isDefined(picker.items) && types.isNumber(picker.items.length)) {
            picker.android.setMaxValue(picker.items.length - 1);
        }
        picker.android.setValue(data.newValue);
    }
}
common.ListPicker.selectedIndexProperty.metadata.onSetNativeValue = onSelectedIndexPropertyChanged;
function onItemsPropertyChanged(data) {
    var picker = data.object;
    if (picker.android && types.isNumber(data.newValue.length)) {
        picker.android.setMaxValue(data.newValue.length - 1);
        picker.android.setWrapSelectorWheel(false);
    }
}
common.ListPicker.itemsProperty.metadata.onSetNativeValue = onItemsPropertyChanged;
require("utils/module-merge").merge(common, exports);
var ListPicker = (function (_super) {
    __extends(ListPicker, _super);
    function ListPicker() {
        _super.call(this);
    }
    Object.defineProperty(ListPicker.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    ListPicker.prototype._createUI = function () {
        this._android = new android.widget.NumberPicker(this._context);
        this._android.setMinValue(0);
        this._android.setDescendantFocusability(android.widget.NumberPicker.FOCUS_BLOCK_DESCENDANTS);
        var that = new WeakRef(this);
        this._android.setFormatter(new android.widget.NumberPicker.Formatter({
            get owner() {
                return that.get();
            },
            format: function (index) {
                if (this.owner) {
                    return this.owner._getItemAsString(index);
                }
                return index.toString();
            }
        }));
        this._android.setOnValueChangedListener(new android.widget.NumberPicker.OnValueChangeListener({
            get owner() {
                return that.get();
            },
            onValueChange: function (picker, oldVal, newVal) {
                if (this.owner) {
                    this.owner._onPropertyChangedFromNative(common.ListPicker.selectedIndexProperty, newVal);
                }
            }
        }));
    };
    return ListPicker;
})(common.ListPicker);
exports.ListPicker = ListPicker;
