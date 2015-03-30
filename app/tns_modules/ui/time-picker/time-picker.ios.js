var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/time-picker/time-picker-common");
function onHourPropertyChanged(data) {
    var picker = data.object;
    if (picker.ios) {
        setHourAndMinute(picker.ios, data.newValue, picker.minute);
    }
}
common.TimePicker.hourProperty.metadata.onSetNativeValue = onHourPropertyChanged;
function onMinutePropertyChanged(data) {
    var picker = data.object;
    if (picker.ios) {
        setHourAndMinute(picker.ios, picker.hour, data.newValue);
    }
}
common.TimePicker.minuteProperty.metadata.onSetNativeValue = onMinutePropertyChanged;
require("utils/module-merge").merge(common, exports);
var TimePicker = (function (_super) {
    __extends(TimePicker, _super);
    function TimePicker() {
        _super.call(this);
        this._ios = new UIDatePicker();
        this._ios.datePickerMode = UIDatePickerMode.UIDatePickerModeTime;
        this._changeHandler = UITimePickerChangeHandlerImpl.new().initWithOwner(this);
        this._ios.addTargetActionForControlEvents(this._changeHandler, "valueChanged", UIControlEvents.UIControlEventValueChanged);
    }
    Object.defineProperty(TimePicker.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    return TimePicker;
})(common.TimePicker);
exports.TimePicker = TimePicker;
var UITimePickerChangeHandlerImpl = (function (_super) {
    __extends(UITimePickerChangeHandlerImpl, _super);
    function UITimePickerChangeHandlerImpl() {
        _super.apply(this, arguments);
    }
    UITimePickerChangeHandlerImpl.new = function () {
        return _super.new.call(this);
    };
    UITimePickerChangeHandlerImpl.prototype.initWithOwner = function (owner) {
        this._owner = owner;
        return this;
    };
    UITimePickerChangeHandlerImpl.prototype.valueChanged = function (sender) {
        var calendar = NSCalendar.currentCalendar();
        var comp = calendar.componentsFromDate(NSCalendarUnit.NSHourCalendarUnit | NSCalendarUnit.NSMinuteCalendarUnit, sender.date);
        this._owner._onPropertyChangedFromNative(common.TimePicker.hourProperty, comp.hour);
        this._owner._onPropertyChangedFromNative(common.TimePicker.minuteProperty, comp.minute);
    };
    UITimePickerChangeHandlerImpl.ObjCExposedMethods = {
        'valueChanged': { returns: interop.types.void, params: [UIDatePicker] }
    };
    return UITimePickerChangeHandlerImpl;
})(NSObject);
function setHourAndMinute(picker, hour, minute) {
    var calendar = NSCalendar.currentCalendar();
    var comps = new NSDateComponents();
    comps.hour = hour;
    comps.minute = minute;
    picker.setDateAnimated(calendar.dateFromComponents(comps), false);
}
