var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/list-view/list-view-common");
var geometry = require("utils/geometry");
var utils = require("utils/utils");
var OWNER = "_owner";
var CELLIDENTIFIER = "cell";
var ITEMLOADING = common.knownEvents.itemLoading;
var LOADMOREITEMS = common.knownEvents.loadMoreItems;
var ITEMTAP = common.knownEvents.itemTap;
var DEFAULT_HEIGHT = 80;
require("utils/module-merge").merge(common, exports);
var ListViewCell = UITableViewCell.extend({}, {});
function notifyForItemAtIndex(listView, cell, eventName, indexPath) {
    var args = { eventName: eventName, object: listView, index: indexPath.row, view: cell.view };
    listView.notify(args);
    return args;
}
var DataSourceClass = NSObject.extend({
    get owner() {
        var owner = null;
        var weakRef = this[OWNER];
        if (weakRef) {
            owner = weakRef.get();
        }
        return owner;
    },
    tableViewNumberOfRowsInSection: function (tableView, section) {
        return this.owner ? (this.owner.items ? this.owner.items.length : 0) : 0;
    },
    tableViewCellForRowAtIndexPath: function (tableView, indexPath) {
        var cell = tableView.dequeueReusableCellWithIdentifier(CELLIDENTIFIER) || ListViewCell.new();
        this.owner._prepareCell(cell, indexPath);
        var view = cell.view;
        if (view) {
            var height = view._getDesiredSize().height;
            var rect = new geometry.Rect(0, 0, this.owner._availableSize.width, height);
            view.arrange(rect);
            view._layoutInfo.resumeLayoutDispatching();
        }
        return cell;
    }
}, {
    protocols: [UITableViewDataSource]
});
var UITableViewDelegateClass = NSObject.extend({
    get owner() {
        var owner = null;
        var weakRef = this[OWNER];
        if (weakRef) {
            owner = weakRef.get();
        }
        return owner;
    },
    tableViewWillDisplayCellForRowAtIndexPath: function (tableView, cell, indexPath) {
        if (this.owner) {
            if (indexPath.row === this.owner.items.length - 1) {
                this.owner.notify({ eventName: LOADMOREITEMS, object: this.owner });
            }
        }
    },
    tableViewWillSelectRowAtIndexPath: function (tableView, indexPath) {
        if (this.owner) {
            var cell = tableView.cellForRowAtIndexPath(indexPath);
            notifyForItemAtIndex(this.owner, cell, ITEMTAP, indexPath);
            cell.highlighted = false;
        }
    },
    tableViewHeightForRowAtIndexPath: function (tableView, indexPath) {
        if (this.owner) {
            if (utils.ios.MajorVersion < 8) {
                var cell = this.owner.measureCell || tableView.dequeueReusableCellWithIdentifier(CELLIDENTIFIER) || ListViewCell.new();
                return this.owner._prepareCell(cell, indexPath);
            }
            return this.owner.getHeight(indexPath.row);
        }
        return DEFAULT_HEIGHT;
    },
    tableViewEstimatedHeightForRowAtIndexPath: function (tableView, indexPath) {
        return DEFAULT_HEIGHT;
    }
}, {
    protocols: [UITableViewDelegate]
});
var ListView = (function (_super) {
    __extends(ListView, _super);
    function ListView() {
        _super.call(this);
        this._cellSize = geometry.Size.zero;
        this._availableSize = geometry.Size.empty;
        this._ios = new UITableView();
        this._ios.registerClassForCellReuseIdentifier(ListViewCell.class(), CELLIDENTIFIER);
        this._ios.autoresizesSubviews = false;
        this._ios.autoresizingMask = UIViewAutoresizing.UIViewAutoresizingNone;
        var dataSource = DataSourceClass.new();
        dataSource[OWNER] = new WeakRef(this);
        this._dataSource = dataSource;
        this._ios.dataSource = this._dataSource;
        this._uiTableViewDelegate = UITableViewDelegateClass.new();
        this._uiTableViewDelegate[OWNER] = new WeakRef(this);
        this._ios.delegate = this._uiTableViewDelegate;
        this._heights = new Array();
    }
    Object.defineProperty(ListView.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    ListView.prototype.refresh = function () {
        this._ios.reloadData();
    };
    ListView.prototype._measureOverride = function (availableSize) {
        var sizeChanged = !this._availableSize.equals(availableSize);
        this._availableSize = availableSize;
        this._cellSize = new geometry.Size(availableSize.width, Number.POSITIVE_INFINITY);
        if (sizeChanged) {
            this._ios.reloadData();
        }
        return _super.prototype._measureOverride.call(this, availableSize);
    };
    ListView.prototype._onSubviewDesiredSizeChanged = function () {
    };
    ListView.prototype.getHeight = function (index) {
        return this._heights[index];
    };
    ListView.prototype.setHeight = function (index, value) {
        this._heights[index] = value;
    };
    ListView.prototype._layoutCell = function (cell, indexPath) {
        var view = cell.view;
        if (view) {
            if (utils.ios.MajorVersion < 8) {
                this._invalidateMeasureRecursive(view);
            }
            else {
                view._invalidateMeasure();
            }
            view.measure(this._cellSize);
            var height = view._getDesiredSize().height;
            this.setHeight(indexPath.row, height);
            return height;
        }
        return 0;
    };
    ListView.prototype._invalidateMeasureRecursive = function (view) {
        var _this = this;
        view._invalidateMeasure();
        var forEachChild = function (subView) {
            _this._invalidateMeasureRecursive(subView);
            return true;
        };
        view._eachChildView(forEachChild);
    };
    ListView.prototype._prepareCell = function (tableCell, indexPath) {
        var cell = tableCell;
        if (!cell.view) {
            cell.view = this._getItemTemplateContent(indexPath.row);
        }
        var args = notifyForItemAtIndex(this, cell, ITEMLOADING, indexPath);
        var view = cell.view = args.view || this._getDefaultItemContent(indexPath.row);
        if (view && !view.parent && view.ios) {
            cell.contentView.addSubview(view.ios);
            this._addView(view);
        }
        if (view) {
            view._layoutInfo.suspendLayoutDispatching();
        }
        this._prepareItem(view, indexPath.row);
        return this._layoutCell(cell, indexPath);
    };
    return ListView;
})(common.ListView);
exports.ListView = ListView;
