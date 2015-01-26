var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/button/button-common");
var stateChanged = require("ui/core/control-state-change");
var OWNER = "_owner";
var ClickHandlerClass = NSObject.extend({
    click: function (args) {
        var weakRef = this[OWNER];
        if (weakRef) {
            var owner = weakRef.get();
            if (owner) {
                owner._emit(common.knownEvents.click);
            }
        }
    }
}, {
    exposedMethods: { "click": "v@" }
});
require("utils/module-merge").merge(common, exports);
var Button = (function (_super) {
    __extends(Button, _super);
    function Button() {
        var _this = this;
        _super.call(this);
        this._ios = UIButton.buttonWithType(UIButtonType.UIButtonTypeSystem);
        this._clickHandler = ClickHandlerClass.alloc();
        this._clickHandler[OWNER] = new WeakRef(this);
        this._ios.addTargetActionForControlEvents(this._clickHandler, "click", UIControlEvents.UIControlEventTouchUpInside);
        this._stateChangedHandler = new stateChanged.ControlStateChangeListener(this._ios, function (s) {
            _this._goToVisualState(s);
        });
    }
    Object.defineProperty(Button.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    return Button;
})(common.Button);
exports.Button = Button;
