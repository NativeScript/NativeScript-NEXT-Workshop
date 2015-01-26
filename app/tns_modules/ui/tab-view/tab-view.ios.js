var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/tab-view/tab-view-common");
var geometry = require("utils/geometry");
var utilsModule = require("utils/utils");
var trace = require("trace");
require("utils/module-merge").merge(common, exports);
var OWNER = "_owner";
var UITabBarControllerClass = UITabBarController.extend({
    viewDidAppear: function (animated) {
        trace.write("TabView.UITabBarControllerClass.viewDidAppear();", trace.categories.Debug);
        this.super.viewDidAppear(animated);
        this[OWNER].onLoaded();
    },
    viewDidLayoutSubviews: function () {
        trace.write("TabView.UITabBarControllerClass.viewDidLayoutSubviews();", trace.categories.Debug);
        if (this[OWNER].isLoaded) {
            this[OWNER]._updateLayout();
        }
    }
});
var UITabBarControllerDelegateClass = NSObject.extend({
    tabBarControllerDidSelectViewController: function (tabBarController, viewController) {
        trace.write("TabView.UITabBarControllerDelegateClass.tabBarControllerDidSelectViewController(" + tabBarController + ", " + viewController + ");", trace.categories.Debug);
        this[OWNER]._onViewControllerShown(viewController);
    }
}, {
    name: "UITabBarControllerDelegate",
    protocols: [UITabBarControllerDelegate]
});
var UINavigationControllerDelegateClass = NSObject.extend({
    navigationControllerDidShowViewControllerAnimated: function (navigationController, viewController, animated) {
        trace.write("TabView.UINavigationControllerDelegateClass.navigationControllerDidShowViewControllerAnimated(" + navigationController + ", " + viewController + ", " + animated + ");", trace.categories.Debug);
        navigationController.navigationBar.topItem.rightBarButtonItem = null;
        this[OWNER]._onViewControllerShown(viewController);
    }
}, {
    name: "UINavigationControllerDelegate",
    protocols: [UINavigationControllerDelegate]
});
var TabView = (function (_super) {
    __extends(TabView, _super);
    function TabView() {
        _super.call(this);
        this._ios = UITabBarControllerClass.new();
        this._ios[OWNER] = this;
        this._tabBarControllerDelegate = UITabBarControllerDelegateClass.new();
        this._tabBarControllerDelegate[OWNER] = this;
        this._ios.delegate = this._tabBarControllerDelegate;
        this._moreNavigationControllerDelegate = UINavigationControllerDelegateClass.new();
        this._moreNavigationControllerDelegate[OWNER] = this;
    }
    Object.defineProperty(TabView.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabView.prototype, "_nativeView", {
        get: function () {
            return this._ios.view;
        },
        enumerable: true,
        configurable: true
    });
    TabView.prototype._onViewControllerShown = function (viewController) {
        trace.write("TabView._onViewControllerShown(" + viewController + ");", trace.categories.Debug);
        if (this._ios.viewControllers.containsObject(viewController)) {
            this.selectedIndex = this._ios.viewControllers.indexOfObject(viewController);
            ;
        }
        else {
            trace.write("TabView._onViewControllerShown: viewController is not one of our viewControllers", trace.categories.Debug);
        }
    };
    TabView.prototype._removeTabs = function (oldItems) {
        trace.write("TabView._removeTabs(" + oldItems + ");", trace.categories.Debug);
        _super.prototype._removeTabs.call(this, oldItems);
        var i;
        var length = oldItems.length;
        var oldItem;
        for (i = 0; i < length; i++) {
            oldItem = oldItems[i];
            this._removeView(oldItem.view);
        }
        this._ios.viewControllers = null;
    };
    TabView.prototype._addTabs = function (newItems) {
        trace.write("TabView._addTabs(" + newItems + ");", trace.categories.Debug);
        _super.prototype._addTabs.call(this, newItems);
        var i;
        var length = newItems.length;
        var newItem;
        var newControllers = NSMutableArray.alloc().initWithCapacity(length);
        var newController;
        for (i = 0; i < length; i++) {
            newItem = newItems[i];
            this._addView(newItem.view);
            if (newItem.view.ios instanceof UIViewController) {
                newController = newItem.view.ios;
            }
            else {
                newController = new UIViewController();
                newController.view.addSubview(newItem.view.ios);
            }
            newController.tabBarItem = UITabBarItem.alloc().initWithTitleImageTag(newItem.title, null, -1);
            newController.tabBarItem.setTitlePositionAdjustment({ horizontal: 0, vertical: -20 });
            newControllers.addObject(newController);
        }
        this._ios.viewControllers = newControllers;
        this._ios.customizableViewControllers = null;
        this._ios.moreNavigationController.delegate = this._moreNavigationControllerDelegate;
    };
    TabView.prototype._onSelectedIndexPropertyChangedSetNativeValue = function (data) {
        _super.prototype._onSelectedIndexPropertyChangedSetNativeValue.call(this, data);
        var newIndex = data.newValue;
        trace.write("TabView._onSelectedIndexPropertyChangedSetNativeValue(" + newIndex + ")", trace.categories.Debug);
        if (newIndex === undefined || newIndex === null) {
            return;
        }
        this._ios.selectedIndex = data.newValue;
        this._invalidateMeasure();
    };
    TabView.prototype._measureOverride = function (availableSize) {
        if (this._selectedView) {
            var moreNavigationBarHeight = utilsModule.ios.getActualHeight(this._ios.moreNavigationController.navigationBar);
            var tabBarHeight = utilsModule.ios.getActualHeight(this._ios.tabBar);
            var originalSize = new geometry.Size(availableSize.width, availableSize.height - (moreNavigationBarHeight + tabBarHeight));
            return this._selectedView.measure(originalSize);
        }
        return geometry.Size.zero;
    };
    TabView.prototype._arrangeOverride = function (finalSize) {
        if (this._selectedView) {
            var moreNavigationBarHeight = utilsModule.ios.getActualHeight(this._ios.moreNavigationController.navigationBar);
            var tabBarHeight = utilsModule.ios.getActualHeight(this._ios.tabBar);
            this._selectedView.arrange(new geometry.Rect(0, moreNavigationBarHeight, finalSize.width, finalSize.height - (moreNavigationBarHeight + tabBarHeight)));
        }
    };
    return TabView;
})(common.TabView);
exports.TabView = TabView;
