var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");
var textBase = require("ui/text-base");
exports.editableProperty = new dependencyObservable.Property("editable", "TextView", new proxy.PropertyMetadata(true, dependencyObservable.PropertyMetadataOptions.None));
require("utils/module-merge").merge(textBase, exports);
var TextView = (function (_super) {
    __extends(TextView, _super);
    function TextView(options) {
        _super.call(this, options);
    }
    Object.defineProperty(TextView.prototype, "editable", {
        get: function () {
            return this._getValue(exports.editableProperty);
        },
        set: function (value) {
            this._setValue(exports.editableProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    return TextView;
})(textBase.TextBase);
exports.TextView = TextView;
