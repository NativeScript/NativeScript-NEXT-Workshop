var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var spanCommon = require("text/span-common");
var enums = require("ui/enums");
require("utils/module-merge").merge(spanCommon, exports);
var Span = (function (_super) {
    __extends(Span, _super);
    function Span() {
        _super.apply(this, arguments);
    }
    Span.prototype.updateSpanModifiers = function () {
        _super.prototype.updateSpanModifiers.call(this);
        if (this.fontFamily) {
            this.spanModifiers.push(new android.text.style.TypefaceSpan(this.fontFamily));
        }
        if (this.fontSize) {
            this.spanModifiers.push(new android.text.style.AbsoluteSizeSpan(this.fontSize * android.util.TypedValue.COMPLEX_UNIT_PT));
        }
        if (this.foregroundColor) {
            this.spanModifiers.push(new android.text.style.ForegroundColorSpan(this.foregroundColor.android));
        }
        if (this.backgroundColor) {
            this.spanModifiers.push(new android.text.style.BackgroundColorSpan(this.backgroundColor.android));
        }
        if (this.fontAttributes) {
            if ((this.fontAttributes & enums.FontAttributes.Bold) && (this.fontAttributes & enums.FontAttributes.Italic)) {
                this.spanModifiers.push(new android.text.style.StyleSpan(android.graphics.Typeface.BOLD_ITALIC));
            }
            else if (this.fontAttributes & enums.FontAttributes.Bold) {
                this.spanModifiers.push(new android.text.style.StyleSpan(android.graphics.Typeface.BOLD));
            }
            else if (this.fontAttributes & enums.FontAttributes.Italic) {
                this.spanModifiers.push(new android.text.style.StyleSpan(android.graphics.Typeface.ITALIC));
            }
        }
        if (this.underline) {
            this.spanModifiers.push(new android.text.style.UnderlineSpan());
        }
        if (this.strikethrough) {
            this.spanModifiers.push(new android.text.style.StrikethroughSpan());
        }
    };
    return Span;
})(spanCommon.Span);
exports.Span = Span;
