var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var pageCommon = require("ui/page/page-common");
var trace = require("trace");
module.exports.knownEvents = pageCommon.knownEvents;
var Page = (function (_super) {
    __extends(Page, _super);
    function Page(options) {
        _super.call(this, options);
    }
    Page.prototype._onDetached = function (force) {
        if (force || !this.frame.android.cachePagesOnNavigate) {
            _super.prototype._onDetached.call(this);
            return;
        }
        else {
            trace.write("Caching Page " + this._domId, trace.categories.NativeLifecycle);
        }
    };
    return Page;
})(pageCommon.Page);
exports.Page = Page;
