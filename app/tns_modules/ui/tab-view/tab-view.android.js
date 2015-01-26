var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/tab-view/tab-view-common");
var trace = require("trace");
var OWNER = "_owner";
var ITEMS = "_items";
require("utils/module-merge").merge(common, exports);
var ViewPagerClass = android.support.v4.view.ViewPager.extend({
    get owner() {
        return this[OWNER];
    },
    onVisibilityChanged: function (changedView, visibility) {
        this.super.onVisibilityChanged(changedView, visibility);
        this.owner._onVisibilityChanged(changedView, visibility);
    }
});
var PagerAdapterClass = android.support.v4.view.PagerAdapter.extend({
    get owner() {
        return this[OWNER];
    },
    get items() {
        return this[ITEMS];
    },
    getCount: function () {
        return this.items ? this.items.length : 0;
    },
    getPageTitle: function (index) {
        if (index < 0 || index >= this.items.length) {
            return "";
        }
        return this.items[index].title;
    },
    instantiateItem: function (container, index) {
        trace.write("TabView.PagerAdapter.instantiateItem; container: " + container + "; index: " + index, trace.categories.Debug);
        var item = this.items[index];
        if (item.view.parent !== this.owner) {
            this.owner._addView(item.view);
        }
        container.addView(item.view.android);
        return item.view.android;
    },
    destroyItem: function (container, index, _object) {
        trace.write("TabView.PagerAdapter.destroyItem; container: " + container + "; index: " + index + "; _object: " + _object, trace.categories.Debug);
        var item = this.items[index];
        if (item.view.android !== _object) {
            throw new Error("Expected " + item.view.android + " to equal " + _object);
        }
        container.removeView(item.view.android);
        if (item.view.parent === this.owner) {
            this.owner._removeView(item.view);
        }
    },
    isViewFromObject: function (view, _object) {
        return view === _object;
    }
});
var TabView = (function (_super) {
    __extends(TabView, _super);
    function TabView() {
        _super.call(this);
        this._listenersSuspended = false;
        this._tabsAddedByMe = new Array();
        this._tabsCache = {};
        var that = new WeakRef(this);
        this._tabListener = new android.app.ActionBar.TabListener({
            get owner() {
                return that.get();
            },
            onTabSelected: function (tab, transaction) {
                var owner = this.owner;
                if (!owner) {
                    return;
                }
                if (owner._listenersSuspended || !owner.isLoaded) {
                    return;
                }
                var index = owner._tabsCache[tab.hashCode()];
                trace.write("TabView.TabListener.onTabSelected(" + index + ");", trace.categories.Debug);
                owner.selectedIndex = index;
            },
            onTabUnselected: function (tab, transaction) {
            },
            onTabReselected: function (tab, transaction) {
            }
        });
        this._pageChangeListener = new android.support.v4.view.ViewPager.OnPageChangeListener({
            get owner() {
                return that.get();
            },
            onPageSelected: function (index) {
                var owner = this.owner;
                if (!owner) {
                    return;
                }
                if (owner._listenersSuspended || !owner.isLoaded) {
                    return;
                }
                trace.write("TabView.OnPageChangeListener.onPageSelected(" + index + ");", trace.categories.Debug);
                owner.selectedIndex = index;
            },
            onPageScrollStateChanged: function (state) {
            },
            onPageScrolled: function (index, offset, offsetPixels) {
            }
        });
    }
    Object.defineProperty(TabView.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    TabView.prototype._createUI = function () {
        trace.write("TabView._createUI(" + this._android + ");", trace.categories.Debug);
        this._android = new ViewPagerClass(this._context);
        this._android[OWNER] = this;
        this._android.setId(android.view.View.generateViewId());
        this._android.setOnPageChangeListener(this._pageChangeListener);
    };
    TabView.prototype._onVisibilityChanged = function (changedView, visibility) {
        trace.write("TabView._onVisibilityChanged:" + this.android + " isShown():" + this.android.isShown(), trace.categories.Debug);
        if (this.isLoaded && this.android && this.android.isShown()) {
            this._addTabsIfNeeded();
        }
        else {
            if (TabView._isProxyOfOrDescendantOfNativeView(this, changedView)) {
                this._removeTabsIfNeeded();
            }
        }
    };
    TabView._isProxyOfOrDescendantOfNativeView = function (view, nativeView) {
        if (view.android === nativeView) {
            return true;
        }
        if (!view.parent) {
            return false;
        }
        return TabView._isProxyOfOrDescendantOfNativeView(view.parent, nativeView);
    };
    TabView.prototype._onAttached = function (context) {
        trace.write("TabView._onAttached(" + context + ");", trace.categories.Debug);
        _super.prototype._onAttached.call(this, context);
    };
    TabView.prototype._onDetached = function (force) {
        trace.write("TabView._onDetached(" + force + ");", trace.categories.Debug);
        _super.prototype._onDetached.call(this, force);
    };
    TabView.prototype.onLoaded = function () {
        trace.write("TabView.onLoaded();", trace.categories.Debug);
        _super.prototype.onLoaded.call(this);
        if (this.android && this.android.isShown()) {
            this._addTabsIfNeeded();
        }
    };
    TabView.prototype.onUnloaded = function () {
        trace.write("TabView.onUnloaded();", trace.categories.Debug);
        this._removeTabsIfNeeded();
        _super.prototype.onUnloaded.call(this);
    };
    TabView.prototype._addTabsIfNeeded = function () {
        if (this.items && this.items.length > 0 && this._tabsAddedByMe.length === 0) {
            this._listenersSuspended = true;
            this._addTabs(this.items);
            this._listenersSuspended = false;
        }
    };
    TabView.prototype._removeTabsIfNeeded = function () {
        if (this._tabsAddedByMe.length > 0) {
            this._listenersSuspended = true;
            this._removeTabs(this.items);
            this._listenersSuspended = false;
        }
    };
    TabView.prototype._onItemsPropertyChangedSetNativeValue = function (data) {
        trace.write("TabView._onItemsPropertyChangedSetNativeValue(" + data.oldValue + " ---> " + data.newValue + ");", trace.categories.Debug);
        this._listenersSuspended = true;
        if (data.oldValue) {
            this._removeTabs(data.oldValue);
            this._unsetAdapter();
        }
        if (data.newValue) {
            this._addTabs(data.newValue);
            this._setAdapter(data.newValue);
        }
        this._updateSelectedIndexOnItemsPropertyChanged(data.newValue);
        this._listenersSuspended = false;
    };
    TabView.prototype._setAdapter = function (items) {
        this._pagerAdapter = new PagerAdapterClass();
        this._pagerAdapter[OWNER] = this;
        this._pagerAdapter[ITEMS] = items;
        this._android.setAdapter(this._pagerAdapter);
    };
    TabView.prototype._unsetAdapter = function () {
        if (this._pagerAdapter) {
            this._android.setAdapter(null);
            delete this._pagerAdapter[OWNER];
            delete this._pagerAdapter[ITEMS];
            this._pagerAdapter = null;
        }
    };
    TabView.prototype._addTabs = function (newItems) {
        trace.write("TabView._addTabs(" + newItems + ");", trace.categories.Debug);
        _super.prototype._addTabs.call(this, newItems);
        var actionBar = this._getActionBar();
        if (!actionBar) {
            return;
        }
        if (this._tabsAddedByMe.length > 0) {
            throw new Error("TabView has already added its tabs to the ActionBar.");
        }
        this._originalActionBarNavigationMode = actionBar.getNavigationMode();
        actionBar.setNavigationMode(android.app.ActionBar.NAVIGATION_MODE_TABS);
        this._originalActionBarIsShowing = actionBar.isShowing();
        actionBar.show();
        var i = 0;
        var length = newItems.length;
        var item;
        var tab;
        for (i; i < length; i++) {
            item = newItems[i];
            tab = actionBar.newTab();
            tab.setText(item.title);
            tab.setTabListener(this._tabListener);
            actionBar.addTab(tab);
            this._tabsCache[tab.hashCode()] = i;
            this._tabsAddedByMe.push(tab);
        }
    };
    TabView.prototype._removeTabs = function (oldItems) {
        trace.write("TabView._removeTabs(" + oldItems + ");", trace.categories.Debug);
        _super.prototype._removeTabs.call(this, oldItems);
        var actionBar = this._getActionBar();
        if (!actionBar) {
            return;
        }
        var i = actionBar.getTabCount() - 1;
        var tab;
        var index;
        for (i; i >= 0; i--) {
            tab = actionBar.getTabAt(i);
            index = this._tabsAddedByMe.indexOf(tab);
            if (index > -1) {
                actionBar.removeTabAt(i);
                tab.setTabListener(null);
                delete this._tabsCache[tab.hashCode()];
                this._tabsAddedByMe.splice(index, 1);
            }
        }
        if (this._tabsAddedByMe.length > 0) {
            throw new Error("TabView did not remove all of its tabs from the ActionBar.");
        }
        if (this._originalActionBarNavigationMode !== undefined) {
            actionBar.setNavigationMode(this._originalActionBarNavigationMode);
        }
        if (!this._originalActionBarIsShowing) {
            actionBar.hide();
        }
    };
    TabView.prototype._onSelectedIndexPropertyChangedSetNativeValue = function (data) {
        trace.write("TabView._onSelectedIndexPropertyChangedSetNativeValue(" + data.oldValue + " ---> " + data.newValue + ");", trace.categories.Debug);
        _super.prototype._onSelectedIndexPropertyChangedSetNativeValue.call(this, data);
        var newIndex = data.newValue;
        if (newIndex === undefined || newIndex === null) {
            return;
        }
        var actionBar = this._getActionBar();
        if (actionBar) {
            var actionBarSelectedIndex = actionBar.getSelectedNavigationIndex();
            if (actionBarSelectedIndex !== newIndex) {
                actionBar.setSelectedNavigationItem(newIndex);
            }
        }
        var viewPagerSelectedIndex = this._android.getCurrentItem();
        if (viewPagerSelectedIndex !== newIndex) {
            this._android.setCurrentItem(newIndex, true);
        }
    };
    TabView.prototype._loadEachChildView = function () {
    };
    TabView.prototype._unloadEachChildView = function () {
    };
    TabView.prototype._getActionBar = function () {
        if (!this._android) {
            return undefined;
        }
        var activity = this._android.getContext();
        return activity.getActionBar();
    };
    return TabView;
})(common.TabView);
exports.TabView = TabView;
