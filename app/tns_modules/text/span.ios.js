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
        if (this.fontAttributes || this.fontFamily || this.fontSize) {
            var font;
            if (!this.fontSize) {
                this.fontSize = UIFont.systemFontSize();
            }
            if (this.fontFamily) {
                font = UIFont.fontWithNameSize(this.fontFamily, this.fontSize);
            }
            else {
                var fontDescriptor = UIFontDescriptor.new();
                var symbolicTraits;
                if (this.fontAttributes & enums.FontAttributes.Bold) {
                    symbolicTraits |= UIFontDescriptorSymbolicTraits.UIFontDescriptorTraitBold;
                }
                if (this.fontAttributes & enums.FontAttributes.Italic) {
                    symbolicTraits |= UIFontDescriptorSymbolicTraits.UIFontDescriptorTraitItalic;
                }
                font = UIFont.fontWithDescriptorSize(fontDescriptor.fontDescriptorWithSymbolicTraits(symbolicTraits), this.fontSize);
            }
            if (font) {
                this.spanModifiers.push({
                    key: NSFontAttributeName,
                    value: font
                });
            }
        }
        if (this.foregroundColor) {
            this.spanModifiers.push({
                key: NSForegroundColorAttributeName,
                value: this.foregroundColor.ios
            });
        }
        if (this.backgroundColor) {
            this.spanModifiers.push({
                key: NSBackgroundColorAttributeName,
                value: this.backgroundColor.ios
            });
        }
        if (this.underline) {
            this.spanModifiers.push({
                key: NSUnderlineStyleAttributeName,
                value: this.underline
            });
        }
        if (this.strikethrough) {
            this.spanModifiers.push({
                key: NSStrikethroughStyleAttributeName,
                value: this.strikethrough
            });
        }
    };
    return Span;
})(spanCommon.Span);
exports.Span = Span;
