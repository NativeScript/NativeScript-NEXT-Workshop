var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/button/button-common");
require("utils/module-merge").merge(common, exports);
var Button = (function (_super) {
    __extends(Button, _super);
    function Button() {
        _super.call(this);
        this._isPressed = false;
    }
    Object.defineProperty(Button.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Button.prototype._createUI = function () {
        var that = new WeakRef(this);
        this._android = new android.widget.Button(this._context);
        this._android.setOnClickListener(new android.view.View.OnClickListener({
            get owner() {
                return that.get();
            },
            onClick: function (v) {
                if (this.owner) {
                    this.owner._emit(common.knownEvents.click);
                }
            }
        }));
    };
    return Button;
})(common.Button);
exports.Button = Button;
