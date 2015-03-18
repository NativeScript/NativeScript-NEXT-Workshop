var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/date-picker/date-picker-common");
function onYearPropertyChanged(data) {
    var picker = data.object;
    if (picker.android) {
        picker.android.init(data.newValue, picker.month, picker.day, picker._listener);
    }
}
common.DatePicker.yearProperty.metadata.onSetNativeValue = onYearPropertyChanged;
function onMonthPropertyChanged(data) {
    var picker = data.object;
    if (picker.android) {
        picker.android.init(picker.year, data.newValue, picker.day, picker._listener);
    }
}
common.DatePicker.monthProperty.metadata.onSetNativeValue = onMonthPropertyChanged;
function onDayPropertyChanged(data) {
    var picker = data.object;
    if (picker.android) {
        picker.android.init(picker.year, picker.month, data.newValue, picker._listener);
    }
}
common.DatePicker.dayProperty.metadata.onSetNativeValue = onDayPropertyChanged;
require("utils/module-merge").merge(common, exports);
var DatePicker = (function (_super) {
    __extends(DatePicker, _super);
    function DatePicker() {
        _super.call(this);
        var that = new WeakRef(this);
        this._listener = new android.widget.DatePicker.OnDateChangedListener({
            get owner() {
                return that.get();
            },
            onDateChanged: function (picker, monthOfYear, dayOfMonth) {
                if (this.owner) {
                    this.owner._onPropertyChangedFromNative(common.DatePicker.yearProperty, picker.getYear());
                    this.owner._onPropertyChangedFromNative(common.DatePicker.monthProperty, monthOfYear);
                    this.owner._onPropertyChangedFromNative(common.DatePicker.dayProperty, dayOfMonth);
                }
            }
        });
    }
    Object.defineProperty(DatePicker.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    DatePicker.prototype._createUI = function () {
        this._android = new android.widget.DatePicker(this._context);
        this._android.setCalendarViewShown(false);
    };
    return DatePicker;
})(common.DatePicker);
exports.DatePicker = DatePicker;
