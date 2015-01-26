var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var view = require("ui/core/view");
var geometry = require("utils/geometry");
var Panel = (function (_super) {
    __extends(Panel, _super);
    function Panel() {
        _super.call(this);
        this._subViews = new Array();
    }
    Panel.prototype._addChildFromBuilder = function (name, value) {
        if (value instanceof view.View) {
            this.addChild(value);
        }
    };
    Object.defineProperty(Panel.prototype, "_children", {
        get: function () {
            return this._subViews;
        },
        enumerable: true,
        configurable: true
    });
    Panel.prototype.getChildById = function (id) {
        return view.getViewById(this, id);
    };
    Panel.prototype.addChild = function (child) {
        this._addView(child);
        this._subViews.push(child);
    };
    Panel.prototype.removeChild = function (child) {
        this._removeView(child);
        var index = this._subViews.indexOf(child);
        this._subViews.splice(index, 1);
    };
    Object.defineProperty(Panel.prototype, "_childrenCount", {
        get: function () {
            return this._subViews.length;
        },
        enumerable: true,
        configurable: true
    });
    Panel.prototype._eachChildView = function (callback) {
        var i;
        var length = this._subViews.length;
        var retVal;
        for (i = 0; i < length; i++) {
            retVal = callback(this._subViews[i]);
            if (retVal === false) {
                break;
            }
        }
    };
    Panel.prototype._measureChildren = function (availableSize) {
        return geometry.Size.zero;
    };
    Panel.prototype._arrangeChildren = function (finalSize) {
    };
    return Panel;
})(view.View);
exports.Panel = Panel;
