var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/list-view/list-view-common");
var ITEMLOADING = common.knownEvents.itemLoading;
var LOADMOREITEMS = common.knownEvents.loadMoreItems;
var ITEMTAP = common.knownEvents.itemTap;
var REALIZED_INDEX = "realizedIndex";
require("utils/module-merge").merge(common, exports);
var ListView = (function (_super) {
    __extends(ListView, _super);
    function ListView() {
        _super.apply(this, arguments);
        this._realizedItems = {};
    }
    ListView.prototype._createUI = function () {
        this._android = new android.widget.ListView(this._context);
        var that = new WeakRef(this);
        var adapter = new android.widget.BaseAdapter.extend({
            getCount: function () {
                var owner = this.owner;
                return owner && owner.items ? owner.items.length : 0;
            },
            getItem: function (i) {
                var owner = this.owner;
                if (owner && owner.items && i < owner.items.length) {
                    return owner.items.getItem ? owner.items.getItem(i) : owner.items[i];
                }
                return null;
            },
            getItemId: function (i) {
                return long(i);
            },
            hasStableIds: function () {
                return true;
            },
            getView: function (index, convertView, parent) {
                var owner = this.owner;
                if (!owner) {
                    return null;
                }
                var view = owner._getRealizedView(convertView, index);
                var args = { eventName: ITEMLOADING, object: owner, index: index, view: view };
                owner.notify(args);
                if (!args.view) {
                    args.view = this._getDefaultItemContent(index);
                }
                if (args.view) {
                    if (!args.view.parent) {
                        owner._addView(args.view);
                    }
                    convertView = args.view.android;
                    owner._realizedItems[convertView.hashCode()] = args.view;
                    args.view[REALIZED_INDEX] = index;
                    owner._prepareItem(args.view, index);
                }
                return convertView;
            },
            get owner() {
                return that.get();
            }
        })();
        this.android.setAdapter(adapter);
        this.android.setOnScrollListener(new android.widget.AbsListView.OnScrollListener({
            onScrollStateChanged: function (view, scrollState) {
                var owner = this.owner;
                if (!owner) {
                    return;
                }
                if (scrollState === android.widget.AbsListView.OnScrollListener.SCROLL_STATE_IDLE) {
                    owner._setValue(common.isScrollingProperty, false);
                    owner._notifyScrollIdle();
                }
                else {
                    owner._setValue(common.isScrollingProperty, true);
                }
            },
            onScroll: function (view, firstVisibleItem, visibleItemCount, totalItemCount) {
                var owner = this.owner;
                if (!owner) {
                    return;
                }
                if (totalItemCount > 0 && firstVisibleItem + visibleItemCount === totalItemCount) {
                    owner.notify({ eventName: LOADMOREITEMS, object: owner });
                }
            },
            get owner() {
                return that.get();
            }
        }));
        this.android.setOnItemClickListener(new android.widget.AdapterView.OnItemClickListener({
            onItemClick: function (parent, convertView, index, id) {
                var owner = that.get();
                if (owner) {
                    owner.notify({ eventName: ITEMTAP, object: owner, index: index, view: owner._getRealizedView(convertView, index) });
                }
            }
        }));
    };
    Object.defineProperty(ListView.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    ListView.prototype.refresh = function () {
        if (!this._android || !this._android.Adapter) {
            return;
        }
        this.android.Adapter.notifyDataSetChanged();
    };
    ListView.prototype._onDetached = function (force) {
        _super.prototype._onDetached.call(this, force);
        var keys = Object.keys(this._realizedItems);
        var i;
        var length = keys.length;
        var view;
        var key;
        for (i = 0; i < length; i++) {
            key = keys[i];
            view = this._realizedItems[key];
            this._removeView(view);
            delete this._realizedItems[key];
        }
    };
    ListView.prototype._getRealizedView = function (convertView, index) {
        if (!convertView) {
            return this._getItemTemplateContent(index);
        }
        return this._realizedItems[convertView.hashCode()];
    };
    ListView.prototype._notifyScrollIdle = function () {
        var keys = Object.keys(this._realizedItems);
        var i;
        var length = keys.length;
        var view;
        var key;
        for (i = 0; i < length; i++) {
            key = keys[i];
            view = this._realizedItems[key];
            this.notify({
                eventName: ITEMLOADING,
                object: this,
                index: view[REALIZED_INDEX],
                view: view
            });
        }
    };
    return ListView;
})(common.ListView);
exports.ListView = ListView;
