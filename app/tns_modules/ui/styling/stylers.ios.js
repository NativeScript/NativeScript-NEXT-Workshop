var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
        var nativeView = view._nativeView;
        if (nativeView) {
            nativeView.backgroundColor = newValue;
        }
    };
    DefaultStyler.resetBackgroundProperty = function (view, nativeValue) {
        var nativeView = view._nativeView;
        if (nativeView) {
            nativeView.backgroundColor = nativeValue;
        }
    };
    DefaultStyler.getNativeBackgroundValue = function (view) {
        var nativeView = view._nativeView;
        if (nativeView) {
            return nativeView.backgroundColor;
        }
        return undefined;
    };
    DefaultStyler.setVisibilityProperty = function (view, newValue) {
        var nativeView = view._nativeView;
        if (nativeView) {
            return nativeView.hidden = (newValue !== enums.Visibility.visible);
        }
    };
    DefaultStyler.resetVisibilityProperty = function (view, nativeValue) {
        var nativeView = view._nativeView;
        if (nativeView) {
            return nativeView.hidden = false;
        }
    };
    DefaultStyler.setOpacityProperty = function (view, newValue) {
        var nativeView = view._nativeView;
        if (nativeView) {
            return nativeView.alpha = newValue;
        }
    };
    DefaultStyler.resetOpacityProperty = function (view, nativeValue) {
        var nativeView = view._nativeView;
        if (nativeView) {
            return nativeView.alpha = 1.0;
        }
    };
    return DefaultStyler;
})(stylersCommon.Styler);
exports.DefaultStyler = DefaultStyler;
var ButtonStyler = (function (_super) {
    __extends(ButtonStyler, _super);
    function ButtonStyler() {
        _super.call(this);
        this.setHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(ButtonStyler.setColorProperty, ButtonStyler.resetColorProperty, ButtonStyler.getNativeColorValue));
        this.setHandler(style.fontSizeProperty, new stylersCommon.StylePropertyChangedHandler(ButtonStyler.setFontSizeProperty, ButtonStyler.resetFontSizeProperty, ButtonStyler.getNativeFontSizeValue));
        this.setHandler(style.textAlignmentProperty, new stylersCommon.StylePropertyChangedHandler(ButtonStyler.setTextAlignmentProperty, ButtonStyler.resetTextAlignmentProperty, ButtonStyler.getNativeTextAlignmentValue));
    }
    ButtonStyler.setColorProperty = function (view, newValue) {
        var btn = view._nativeView;
        if (btn) {
            btn.setTitleColorForState(newValue, UIControlState.UIControlStateNormal);
        }
    };
    ButtonStyler.resetColorProperty = function (view, nativeValue) {
        var btn = view._nativeView;
        if (btn) {
            btn.setTitleColorForState(nativeValue, UIControlState.UIControlStateNormal);
        }
    };
    ButtonStyler.getNativeColorValue = function (view) {
        var btn = view._nativeView;
        if (btn) {
            return btn.titleColorForState(UIControlState.UIControlStateNormal);
        }
    };
    ButtonStyler.setFontSizeProperty = function (view, newValue) {
        var btn = view._nativeView;
        if (btn) {
            btn.titleLabel.font = btn.titleLabel.font.fontWithSize(newValue);
        }
    };
    ButtonStyler.resetFontSizeProperty = function (view, nativeValue) {
        var btn = view._nativeView;
        if (btn) {
            btn.font = btn.titleLabel.font.fontWithSize(nativeValue);
        }
    };
    ButtonStyler.getNativeFontSizeValue = function (view) {
        var btn = view._nativeView;
        if (btn) {
            return btn.titleLabel.font.pointSize;
        }
    };
    ButtonStyler.setTextAlignmentProperty = function (view, newValue) {
        var ios = view._nativeView;
        if (ios) {
            switch (newValue) {
                case enums.TextAlignment.left:
                    ios.titleLabel.textAlignment = NSTextAlignment.NSTextAlignmentLeft;
                    break;
                case enums.TextAlignment.center:
                    ios.titleLabel.textAlignment = NSTextAlignment.NSTextAlignmentCenter;
                    break;
                case enums.TextAlignment.right:
                    ios.titleLabel.textAlignment = NSTextAlignment.NSTextAlignmentRight;
                    break;
                default:
                    break;
            }
        }
    };
    ButtonStyler.resetTextAlignmentProperty = function (view, nativeValue) {
        var ios = view._nativeView;
        if (ios) {
            ios.titleLabel.textAlignment = nativeValue;
        }
    };
    ButtonStyler.getNativeTextAlignmentValue = function (view) {
        var ios = view._nativeView;
        if (ios) {
            return ios.titleLabel.textAlignment;
        }
    };
    return ButtonStyler;
})(DefaultStyler);
exports.ButtonStyler = ButtonStyler;
var LabelStyler = (function (_super) {
    __extends(LabelStyler, _super);
    function LabelStyler() {
        _super.call(this);
        this.setHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(LabelStyler.setColorProperty, LabelStyler.resetColorProperty, LabelStyler.getNativeColorValue));
        this.setHandler(style.fontSizeProperty, new stylersCommon.StylePropertyChangedHandler(LabelStyler.setFontSizeProperty, LabelStyler.resetFontSizeProperty, LabelStyler.getNativeFontSizeValue));
        this.setHandler(style.textAlignmentProperty, new stylersCommon.StylePropertyChangedHandler(LabelStyler.setTextAlignmentProperty, LabelStyler.resetTextAlignmentProperty, LabelStyler.getNativeTextAlignmentValue));
    }
    LabelStyler.setColorProperty = function (view, newValue) {
        var label = view._nativeView;
        if (label) {
            label.textColor = newValue;
        }
    };
    LabelStyler.resetColorProperty = function (view, nativeValue) {
        var label = view._nativeView;
        if (label) {
            label.textColor = nativeValue;
        }
    };
    LabelStyler.getNativeColorValue = function (view) {
        var label = view._nativeView;
        if (label) {
            return label.textColor;
        }
    };
    LabelStyler.setFontSizeProperty = function (view, newValue) {
        var label = view._nativeView;
        if (label) {
            label.font = label.font.fontWithSize(newValue);
        }
    };
    LabelStyler.resetFontSizeProperty = function (view, nativeValue) {
        var label = view._nativeView;
        if (label) {
            label.font = label.font.fontWithSize(nativeValue);
        }
    };
    LabelStyler.getNativeFontSizeValue = function (view) {
        var label = view._nativeView;
        if (label) {
            return label.font.pointSize;
        }
    };
    LabelStyler.setTextAlignmentProperty = function (view, newValue) {
        var ios = view._nativeView;
        if (ios) {
            switch (newValue) {
                case enums.TextAlignment.left:
                    ios.textAlignment = NSTextAlignment.NSTextAlignmentLeft;
                    break;
                case enums.TextAlignment.center:
                    ios.textAlignment = NSTextAlignment.NSTextAlignmentCenter;
                    break;
                case enums.TextAlignment.right:
                    ios.textAlignment = NSTextAlignment.NSTextAlignmentRight;
                    break;
                default:
                    break;
            }
        }
    };
    LabelStyler.resetTextAlignmentProperty = function (view, nativeValue) {
        var ios = view._nativeView;
        if (ios) {
            ios.textAlignment = nativeValue;
        }
    };
    LabelStyler.getNativeTextAlignmentValue = function (view) {
        var ios = view._nativeView;
        if (ios) {
            return ios.textAlignment;
        }
    };
    return LabelStyler;
})(DefaultStyler);
exports.LabelStyler = LabelStyler;
var TextFieldStyler = (function (_super) {
    __extends(TextFieldStyler, _super);
    function TextFieldStyler() {
        _super.call(this);
        this.setHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(TextFieldStyler.setColorProperty, TextFieldStyler.resetColorProperty, TextFieldStyler.getNativeColorValue));
        this.setHandler(style.fontSizeProperty, new stylersCommon.StylePropertyChangedHandler(TextFieldStyler.setFontSizeProperty, TextFieldStyler.resetFontSizeProperty, TextFieldStyler.getNativeFontSizeValue));
        this.setHandler(style.textAlignmentProperty, new stylersCommon.StylePropertyChangedHandler(TextFieldStyler.setTextAlignmentProperty, TextFieldStyler.resetTextAlignmentProperty, TextFieldStyler.getNativeTextAlignmentValue));
    }
    TextFieldStyler.setColorProperty = function (view, newValue) {
        var textField = view._nativeView;
        if (textField) {
            textField.textColor = newValue;
        }
    };
    TextFieldStyler.resetColorProperty = function (view, nativeValue) {
        var textField = view._nativeView;
        if (textField) {
            textField.textColor = nativeValue;
        }
    };
    TextFieldStyler.getNativeColorValue = function (view) {
        var textField = view._nativeView;
        if (textField) {
            return textField.textColor;
        }
    };
    TextFieldStyler.setFontSizeProperty = function (view, newValue) {
        var textField = view._nativeView;
        if (textField) {
            textField.font = textField.font.fontWithSize(newValue);
        }
    };
    TextFieldStyler.resetFontSizeProperty = function (view, nativeValue) {
        var textField = view._nativeView;
        if (textField) {
            textField.font = textField.font.fontWithSize(nativeValue);
        }
    };
    TextFieldStyler.getNativeFontSizeValue = function (view) {
        var textField = view._nativeView;
        if (textField) {
            return textField.font.pointSize;
        }
    };
    TextFieldStyler.setTextAlignmentProperty = function (view, newValue) {
        var ios = view._nativeView;
        if (ios) {
            switch (newValue) {
                case enums.TextAlignment.left:
                    ios.textAlignment = NSTextAlignment.NSTextAlignmentLeft;
                    break;
                case enums.TextAlignment.center:
                    ios.textAlignment = NSTextAlignment.NSTextAlignmentCenter;
                    break;
                case enums.TextAlignment.right:
                    ios.textAlignment = NSTextAlignment.NSTextAlignmentRight;
                    break;
                default:
                    break;
            }
        }
    };
    TextFieldStyler.resetTextAlignmentProperty = function (view, nativeValue) {
        var ios = view._nativeView;
        if (ios) {
            ios.textAlignment = nativeValue;
        }
    };
    TextFieldStyler.getNativeTextAlignmentValue = function (view) {
        var ios = view._nativeView;
        if (ios) {
            return ios.textAlignment;
        }
    };
    return TextFieldStyler;
})(DefaultStyler);
exports.TextFieldStyler = TextFieldStyler;
var TextViewStyler = (function (_super) {
    __extends(TextViewStyler, _super);
    function TextViewStyler() {
        _super.call(this);
        this.setHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(TextViewStyler.setColorProperty, TextViewStyler.resetColorProperty, TextViewStyler.getNativeColorValue));
        this.setHandler(style.fontSizeProperty, new stylersCommon.StylePropertyChangedHandler(TextViewStyler.setFontSizeProperty, TextViewStyler.resetFontSizeProperty, TextViewStyler.getNativeFontSizeValue));
        this.setHandler(style.textAlignmentProperty, new stylersCommon.StylePropertyChangedHandler(TextViewStyler.setTextAlignmentProperty, TextViewStyler.resetTextAlignmentProperty, TextViewStyler.getNativeTextAlignmentValue));
    }
    TextViewStyler.setColorProperty = function (view, newValue) {
        var textView = view._nativeView;
        if (textView) {
            textView.textColor = newValue;
        }
    };
    TextViewStyler.resetColorProperty = function (view, nativeValue) {
        var textView = view._nativeView;
        if (textView) {
            textView.textColor = nativeValue;
        }
    };
    TextViewStyler.getNativeColorValue = function (view) {
        var textView = view._nativeView;
        if (textView) {
            return textView.textColor;
        }
    };
    TextViewStyler.setFontSizeProperty = function (view, newValue) {
        var textView = view._nativeView;
        if (textView) {
            textView.font = textView.font.fontWithSize(newValue);
        }
    };
    TextViewStyler.resetFontSizeProperty = function (view, nativeValue) {
        var textView = view._nativeView;
        if (textView) {
            textView.font = textView.font.fontWithSize(nativeValue);
        }
    };
    TextViewStyler.getNativeFontSizeValue = function (view) {
        var textView = view._nativeView;
        if (textView) {
            return textView.font.pointSize;
        }
    };
    TextViewStyler.setTextAlignmentProperty = function (view, newValue) {
        var ios = view._nativeView;
        if (ios) {
            switch (newValue) {
                case enums.TextAlignment.left:
                    ios.textAlignment = NSTextAlignment.NSTextAlignmentLeft;
                    break;
                case enums.TextAlignment.center:
                    ios.textAlignment = NSTextAlignment.NSTextAlignmentCenter;
                    break;
                case enums.TextAlignment.right:
                    ios.textAlignment = NSTextAlignment.NSTextAlignmentRight;
                    break;
                default:
                    break;
            }
        }
    };
    TextViewStyler.resetTextAlignmentProperty = function (view, nativeValue) {
        var ios = view._nativeView;
        if (ios) {
            ios.textAlignment = nativeValue;
        }
    };
    TextViewStyler.getNativeTextAlignmentValue = function (view) {
        var ios = view._nativeView;
        if (ios) {
            return ios.textAlignment;
        }
    };
    return TextViewStyler;
})(DefaultStyler);
exports.TextViewStyler = TextViewStyler;
function _registerDefaultStylers() {
    stylersCommon.registerStyler("Frame", new stylersCommon.EmptyStyler());
    stylersCommon.registerStyler("Button", new ButtonStyler());
    stylersCommon.registerStyler("Label", new LabelStyler());
    stylersCommon.registerStyler("TextField", new TextFieldStyler());
    stylersCommon.registerStyler("TextView", new TextViewStyler());
}
exports._registerDefaultStylers = _registerDefaultStylers;
