var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/label/label-common");
function onTextWrapPropertyChanged(data) {
    var label = data.object;
    if (data.newValue) {
        label.ios.lineBreakMode = NSLineBreakMode.NSLineBreakByWordWrapping;
        label.ios.numberOfLines = 0;
    }
    else {
        label.ios.lineBreakMode = NSLineBreakMode.NSLineBreakByTruncatingTail;
        label.ios.numberOfLines = 1;
    }
}
common.textWrapProperty.metadata.onSetNativeValue = onTextWrapPropertyChanged;
require("utils/module-merge").merge(common, exports);
var Label = (function (_super) {
    __extends(Label, _super);
    function Label(options) {
        _super.call(this, options);
        this._ios = new UILabel();
    }
    Object.defineProperty(Label.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Label.prototype._measureOverride = function (availableSize) {
        var desiredSize = _super.prototype._measureOverride.call(this, availableSize);
        if (!this.textWrap) {
            desiredSize.width = Math.min(desiredSize.width, availableSize.width);
        }
        return desiredSize;
    };
    return Label;
})(common.Label);
exports.Label = Label;
