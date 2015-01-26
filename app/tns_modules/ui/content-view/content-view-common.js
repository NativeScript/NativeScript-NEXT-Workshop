var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var view = require("ui/core/view");
var geometry = require("utils/geometry");
var ContentView = (function (_super) {
    __extends(ContentView, _super);
    function ContentView() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(ContentView.prototype, "content", {
        get: function () {
            return this._content;
        },
        set: function (value) {
            var oldView = this._content;
            if (this._content) {
                this._removeView(this._content);
            }
            this._content = value;
            if (this._content) {
                this._addView(this._content);
            }
            this._onContentChanged(oldView, value);
        },
        enumerable: true,
        configurable: true
    });
    ContentView.prototype._onContentChanged = function (oldView, newView) {
    };
    ContentView.prototype._addChildFromBuilder = function (name, value) {
        if (value instanceof view.View) {
            this.content = value;
        }
    };
    Object.defineProperty(ContentView.prototype, "_childrenCount", {
        get: function () {
            if (this._content) {
                return 1;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    ContentView.prototype._eachChildView = function (callback) {
        if (this._content) {
            callback(this._content);
        }
    };
    ContentView.prototype._measureOverride = function (availableSize) {
        if (this.content) {
            return this.content.measure(availableSize);
        }
        return geometry.Size.zero;
    };
    ContentView.prototype._arrangeOverride = function (finalSize) {
        if (this.content) {
            this.content.arrange(new geometry.Rect(0, 0, finalSize.width, finalSize.height));
        }
    };
    return ContentView;
})(view.View);
exports.ContentView = ContentView;
