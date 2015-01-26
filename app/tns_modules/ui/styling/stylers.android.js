var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var types = require("utils/types");
var trace = require("trace");
var constants = require("utils/android_constants");
var style = require("ui/styling/style");
var stylersCommon = require("ui/styling/stylers-common");
var enums = require("ui/enums");
require("utils/module-merge").merge(stylersCommon, exports);
var DefaultStyler = (function (_super) {
    __extends(DefaultStyler, _super);
    function DefaultStyler() {
        _super.call(this);
        this.setHandler(style.backgroundColorProperty, new stylersCommon.StylePropertyChangedHandler(DefaultStyler.setBackgroundProperty, DefaultStyler.resetBackgroundProperty, DefaultStyler.getNativeBackgroundValue));
        this.setHandler(style.visibilityProperty, new stylersCommon.StylePropertyChangedHandler(DefaultStyler.setVisibilityProperty, DefaultStyler.resetVisibilityProperty));
        this.setHandler(style.opacityProperty, new stylersCommon.StylePropertyChangedHandler(DefaultStyler.setOpacityProperty, DefaultStyler.resetOpacityProperty));
    }
    DefaultStyler.setBackgroundProperty = function (view, newValue) {
        view.android.setBackgroundColor(newValue);
    };
    DefaultStyler.resetBackgroundProperty = function (view, nativeValue) {
        if (types.isDefined(nativeValue)) {
            view.android.setBackground(nativeValue);
        }
    };
    DefaultStyler.getNativeBackgroundValue = function (view) {
        var drawable = view.android.getBackground();
        if (drawable instanceof android.graphics.drawable.StateListDrawable) {
            trace.write("Native value of view: " + view + " is StateListDrawable. It will not be cached.", trace.categories.Style);
            return undefined;
        }
        return drawable;
    };
    DefaultStyler.setVisibilityProperty = function (view, newValue) {
        var androidValue = (newValue === enums.Visibility.visible) ? android.view.View.VISIBLE : android.view.View.GONE;
        view.android.setVisibility(androidValue);
    };
    DefaultStyler.resetVisibilityProperty = function (view, nativeValue) {
        view.android.setVisibility(android.view.View.VISIBLE);
    };
    DefaultStyler.setOpacityProperty = function (view, newValue) {
        view.android.setAlpha(float(newValue));
    };
    DefaultStyler.resetOpacityProperty = function (view, nativeValue) {
        view.android.setAlpha(float(1.0));
    };
    return DefaultStyler;
})(stylersCommon.Styler);
exports.DefaultStyler = DefaultStyler;
var TextViewStyler = (function (_super) {
    __extends(TextViewStyler, _super);
    function TextViewStyler() {
        _super.call(this);
        this.setHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(TextViewStyler.setColorProperty, TextViewStyler.resetColorProperty, TextViewStyler.getNativeColorValue));
        this.setHandler(style.fontSizeProperty, new stylersCommon.StylePropertyChangedHandler(TextViewStyler.setFontSizeProperty, TextViewStyler.resetFontSizeProperty, TextViewStyler.getNativeFontSizeValue));
        this.setHandler(style.textAlignmentProperty, new stylersCommon.StylePropertyChangedHandler(TextViewStyler.setTextAlignmentProperty, TextViewStyler.resetTextAlignmentProperty, TextViewStyler.getNativeTextAlignmentValue));
    }
    TextViewStyler.setColorProperty = function (view, newValue) {
        view.android.setTextColor(newValue);
    };
    TextViewStyler.resetColorProperty = function (view, nativeValue) {
        view.android.setTextColor(nativeValue);
    };
    TextViewStyler.getNativeColorValue = function (view) {
        return view.android.getTextColors().getDefaultColor();
    };
    TextViewStyler.setFontSizeProperty = function (view, newValue) {
        view.android.setTextSize(newValue);
    };
    TextViewStyler.resetFontSizeProperty = function (view, nativeValue) {
        view.android.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, nativeValue);
    };
    TextViewStyler.getNativeFontSizeValue = function (view) {
        return view.android.getTextSize();
    };
    TextViewStyler.setTextAlignmentProperty = function (view, newValue) {
        var verticalGravity = view.android.getGravity() & android.view.Gravity.VERTICAL_GRAVITY_MASK;
        switch (newValue) {
            case enums.TextAlignment.left:
                view.android.setGravity(android.view.Gravity.LEFT | verticalGravity);
                break;
            case enums.TextAlignment.center:
                view.android.setGravity(android.view.Gravity.CENTER_HORIZONTAL | verticalGravity);
                break;
            case enums.TextAlignment.right:
                view.android.setGravity(android.view.Gravity.RIGHT | verticalGravity);
                break;
            default:
                break;
        }
    };
    TextViewStyler.resetTextAlignmentProperty = function (view, nativeValue) {
        view.android.setGravity(nativeValue);
    };
    TextViewStyler.getNativeTextAlignmentValue = function (view) {
        return view.android.getGravity();
    };
    return TextViewStyler;
})(DefaultStyler);
exports.TextViewStyler = TextViewStyler;
var ButtonStyler = (function (_super) {
    __extends(ButtonStyler, _super);
    function ButtonStyler() {
        _super.call(this);
        this.setHandler(style.backgroundColorProperty, new stylersCommon.StylePropertyChangedHandler(ButtonStyler.setButtonBackgroundProperty, ButtonStyler.resetButtonBackgroundProperty));
    }
    ButtonStyler.setButtonBackgroundProperty = function (view, newValue) {
        view.android.setBackgroundColor(newValue);
    };
    ButtonStyler.resetButtonBackgroundProperty = function (view, nativeValue) {
        view.android.setBackgroundResource(constants.btn_default);
    };
    return ButtonStyler;
})(TextViewStyler);
exports.ButtonStyler = ButtonStyler;
var ActivityIndicatorStyler = (function (_super) {
    __extends(ActivityIndicatorStyler, _super);
    function ActivityIndicatorStyler() {
        _super.call(this);
        this.setHandler(style.visibilityProperty, new stylersCommon.StylePropertyChangedHandler(ActivityIndicatorStyler.setActivityIndicatorVisibilityProperty, ActivityIndicatorStyler.resetActivityIndicatorVisibilityProperty));
    }
    ActivityIndicatorStyler.setActivityIndicatorVisibilityProperty = function (view, newValue) {
        ActivityIndicatorStyler.setIndicatorVisibility(view.busy, newValue, view.android);
    };
    ActivityIndicatorStyler.resetActivityIndicatorVisibilityProperty = function (view, nativeValue) {
        ActivityIndicatorStyler.setIndicatorVisibility(view.busy, enums.Visibility.visible, view.android);
    };
    ActivityIndicatorStyler.setIndicatorVisibility = function (isBusy, visibility, nativView) {
        if (visibility === enums.Visibility.collapsed) {
            nativView.setVisibility(android.view.View.GONE);
        }
        else {
            nativView.setVisibility(isBusy ? android.view.View.VISIBLE : android.view.View.INVISIBLE);
        }
    };
    return ActivityIndicatorStyler;
})(DefaultStyler);
exports.ActivityIndicatorStyler = ActivityIndicatorStyler;
function _registerDefaultStylers() {
    stylersCommon.registerStyler("Frame", new stylersCommon.EmptyStyler());
    stylersCommon.registerStyler("Button", new ButtonStyler());
    stylersCommon.registerStyler("Label", new TextViewStyler());
    stylersCommon.registerStyler("TextField", new TextViewStyler());
    stylersCommon.registerStyler("TextView", new TextViewStyler());
    stylersCommon.registerStyler("ActivityIndicator", new ActivityIndicatorStyler());
}
exports._registerDefaultStylers = _registerDefaultStylers;
