var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");
var view = require("ui/core/view");
var types = require("utils/types");
var ListPicker = (function (_super) {
    __extends(ListPicker, _super);
    function ListPicker() {
        _super.call(this);
    }
    Object.defineProperty(ListPicker.prototype, "selectedIndex", {
        get: function () {
            return this._getValue(ListPicker.selectedIndexProperty);
        },
        set: function (value) {
            this._setValue(ListPicker.selectedIndexProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListPicker.prototype, "items", {
        get: function () {
            return this._getValue(ListPicker.itemsProperty);
        },
        set: function (value) {
            this._setValue(ListPicker.itemsProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    ListPicker.prototype._getItemAsString = function (index) {
        if (types.isDefined(this.items)) {
            var item = this.items.getItem ? this.items.getItem(index) : this.items[index];
            return types.isString(item) ? item : (types.isDefined(item) ? item.toString() : index.toString());
        }
        return index.toString();
    };
    ListPicker.selectedIndexProperty = new dependencyObservable.Property("selectedIndex", "ListPicker", new proxy.PropertyMetadata(0));
    ListPicker.itemsProperty = new dependencyObservable.Property("items", "ListPicker", new proxy.PropertyMetadata(undefined));
    return ListPicker;
})(view.View);
exports.ListPicker = ListPicker;
