var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var frameCommon = require("ui/frame/frame-common");
var geometry = require("utils/geometry");
var trace = require("trace");
var observable = require("data/observable");
var panel = require("ui/panels/panel");
require("utils/module-merge").merge(frameCommon, exports);
var FRAGMENT = "_fragment";
var PAGE = "_page";
var OWNER = "_owner";
var ENTRY = "_entry";
var FRAME = "_frame";
var HIDDEN = "_hidden";
var navDepth = 0;
var PageFragmentBody = android.app.Fragment.extend({
    onAttach: function (activity) {
        this.super.onAttach(activity);
        trace.write(this.getTag() + ".onAttach();", trace.categories.NativeLifecycle);
    },
    onCreate: function (savedInstanceState) {
        this.super.onCreate(savedInstanceState);
        trace.write(this.getTag() + ".onCreate(); savedInstanceState: " + savedInstanceState, trace.categories.NativeLifecycle);
    },
    onCreateView: function (inflater, container, savedInstanceState) {
        trace.write(this.getTag() + ".onCreateView(); container: " + container + "; savedInstanceState: " + savedInstanceState, trace.categories.NativeLifecycle);
        var page = this[PAGE];
        if (savedInstanceState && savedInstanceState.getBoolean(HIDDEN, false)) {
            this.super.getFragmentManager().beginTransaction().hide(this).commit();
            page._onAttached(this.getActivity());
        }
        else {
            onFragmentShown(this);
        }
        trace.write(this.getTag() + ".onCreateView(); nativeView: " + this[PAGE]._nativeView, trace.categories.NativeLifecycle);
        return this[PAGE]._nativeView;
    },
    onHiddenChanged: function (hidden) {
        this.super.onHiddenChanged(hidden);
        trace.write(this.getTag() + ".onHiddenChanged(); hidden: " + hidden, trace.categories.NativeLifecycle);
        if (hidden) {
            onFragmentHidden(this);
        }
        else {
            onFragmentShown(this);
        }
    },
    onActivityCreated: function (savedInstanceState) {
        this.super.onActivityCreated(savedInstanceState);
        trace.write(this.getTag() + ".onActivityCreated(); savedInstanceState: " + savedInstanceState, trace.categories.NativeLifecycle);
    },
    onSaveInstanceState: function (outState) {
        this.super.onSaveInstanceState(outState);
        trace.write(this.getTag() + ".onSaveInstanceState();", trace.categories.NativeLifecycle);
        if (this.isHidden()) {
            outState.putBoolean(HIDDEN, true);
        }
    },
    onViewStateRestored: function (savedInstanceState) {
        this.super.onViewStateRestored(savedInstanceState);
        trace.write(this.getTag() + ".onViewStateRestored(); savedInstanceState: " + savedInstanceState, trace.categories.NativeLifecycle);
    },
    onStart: function () {
        this.super.onStart();
        trace.write(this.getTag() + ".onStart();", trace.categories.NativeLifecycle);
    },
    onResume: function () {
        this.super.onResume();
        trace.write(this.getTag() + ".onResume();", trace.categories.NativeLifecycle);
    },
    onPause: function () {
        this.super.onPause();
        trace.write(this.getTag() + ".onPause();", trace.categories.NativeLifecycle);
    },
    onStop: function () {
        this.super.onStop();
        trace.write(this.getTag() + ".onStop();", trace.categories.NativeLifecycle);
    },
    onDestroyView: function () {
        this.super.onDestroyView();
        trace.write(this.getTag() + ".onDestroyView();", trace.categories.NativeLifecycle);
        onFragmentHidden(this);
    },
    onDestroy: function () {
        delete this[FRAME];
        delete this[PAGE];
        delete this[ENTRY];
        this.super.onDestroy();
        trace.write(this.getTag() + ".onDestroy();", trace.categories.NativeLifecycle);
    },
    onDetach: function () {
        this.super.onDetach();
        trace.write(this.getTag() + ".onDetach();", trace.categories.NativeLifecycle);
    }
});
function onFragmentShown(fragment) {
    var frame = fragment[FRAME];
    var newPage = fragment[PAGE];
    var newEntry = fragment[ENTRY];
    newPage.frame = frame;
    frame._currentPage = newPage;
    frame._currentEntry = newEntry;
    newPage.onNavigatedTo(newEntry.context);
    frame._addView(newPage);
    frame._processNavigationStack(newPage);
}
function onFragmentHidden(fragment) {
    var page = fragment[PAGE];
    if (page && page.frame) {
        var frame = page.frame;
        frame._removeView(page);
        page.frame = undefined;
    }
}
var Frame = (function (_super) {
    __extends(Frame, _super);
    function Frame() {
        _super.call(this);
        this._isFirstNavigation = false;
        this._containerViewId = android.view.View.generateViewId();
        this._android = new AndroidFrame(this);
    }
    Object.defineProperty(Frame.prototype, "containerViewId", {
        get: function () {
            return this._containerViewId;
        },
        enumerable: true,
        configurable: true
    });
    Frame.prototype._navigateCore = function (context) {
        var activity = this._android.activity;
        if (!activity) {
            var currentActivity = this._android.currentActivity;
            if (currentActivity) {
                startActivity(currentActivity, context.entry);
            }
            this._delayedContext = context;
            return;
        }
        var manager = activity.getFragmentManager();
        var fragmentTransaction = manager.beginTransaction();
        var newFragment = new PageFragmentBody();
        var newFragmentTag = FRAGMENT + this.backStack.length;
        newFragment[FRAME] = this;
        newFragment[PAGE] = context.newPage;
        newFragment[ENTRY] = context.entry;
        context.newPage[FRAGMENT] = newFragmentTag;
        navDepth++;
        trace.write("Frame<" + this._domId + ">.fragmentTransaction PUSH depth = " + navDepth, trace.categories.Navigation);
        context.entry.tag = newFragmentTag;
        if (this._isFirstNavigation) {
            fragmentTransaction.add(this.containerViewId, newFragment, newFragmentTag);
            trace.write("fragmentTransaction.add(" + this.containerViewId + ", " + newFragment + ", " + newFragmentTag + ");", trace.categories.NativeLifecycle);
        }
        else {
            if (this.android.cachePagesOnNavigate) {
                var currentFragmentTag = context.oldPage[FRAGMENT];
                var currentFragment = manager.findFragmentByTag(currentFragmentTag);
                if (currentFragment) {
                    fragmentTransaction.hide(currentFragment);
                    trace.write("fragmentTransaction.hide(" + currentFragment + ");", trace.categories.NativeLifecycle);
                }
                else {
                    trace.write("Could not find " + currentFragmentTag + " to hide", trace.categories.NativeLifecycle);
                }
                fragmentTransaction.add(this.containerViewId, newFragment, newFragmentTag);
                trace.write("fragmentTransaction.add(" + this.containerViewId + ", " + newFragment + ", " + newFragmentTag + ");", trace.categories.NativeLifecycle);
            }
            else {
                fragmentTransaction.replace(this.containerViewId, newFragment, newFragmentTag);
                trace.write("fragmentTransaction.replace(" + this.containerViewId + ", " + newFragment + ", " + newFragmentTag + ");", trace.categories.NativeLifecycle);
            }
            if (this.backStack.length > 0) {
                fragmentTransaction.addToBackStack(newFragmentTag);
                trace.write("fragmentTransaction.addToBackStack(" + newFragmentTag + ");", trace.categories.NativeLifecycle);
            }
        }
        if (!this._isFirstNavigation) {
            var animated = this._getIsAnimatedNavigation(context.entry);
            if (this.android.cachePagesOnNavigate) {
                fragmentTransaction.setTransition(android.app.FragmentTransaction.TRANSIT_NONE);
            }
            else {
                var transition = animated ? android.app.FragmentTransaction.TRANSIT_FRAGMENT_OPEN : android.app.FragmentTransaction.TRANSIT_NONE;
                fragmentTransaction.setTransition(transition);
            }
        }
        fragmentTransaction.commit();
        trace.write("fragmentTransaction.commit();", trace.categories.NativeLifecycle);
    };
    Frame.prototype._goBackCore = function (entry) {
        navDepth--;
        trace.write("Frame<" + this._domId + ">.fragmentTransaction POP depth = " + navDepth, trace.categories.Navigation);
        var manager = this._android.activity.getFragmentManager();
        if (manager.getBackStackEntryCount() > 0) {
            manager.popBackStack();
        }
    };
    Object.defineProperty(Frame.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Frame.prototype._createUI = function () {
    };
    Frame.prototype._onActivityCreated = function (isRestart) {
        this._onAttached(this._android.activity);
        var delayedContext = this._delayedContext;
        var entry = delayedContext ? delayedContext.entry : null;
        if (!entry) {
            entry = this.currentEntry;
        }
        if (!entry) {
            throw new Error("No NavigationEntry found when starting Activity.");
        }
        var context = { entry: entry, oldPage: undefined, newPage: this.currentPage || delayedContext.newPage };
        if (isRestart) {
            this._onNavigatingTo(context);
            this._onNavigatedTo(context);
        }
        else {
            this._isFirstNavigation = true;
            this._navigateCore(context);
            this._isFirstNavigation = false;
        }
        this._delayedContext = undefined;
    };
    Frame.prototype._popFromFrameStack = function () {
        if (!this._isInFrameStack) {
            return;
        }
        _super.prototype._popFromFrameStack.call(this);
        if (this._android.hasOwnActivity) {
            this._android.activity.finish();
        }
    };
    Frame.prototype._measureOverride = function (availableSize) {
        if (this.currentPage) {
            return this.currentPage.measure(availableSize);
        }
        return geometry.Size.zero;
    };
    Frame.prototype._arrangeOverride = function (finalSize) {
        if (this.currentPage) {
            this.currentPage.arrange(new geometry.Rect(0, 0, finalSize.width, finalSize.height));
        }
    };
    Frame.prototype._setBounds = function (rect) {
    };
    Object.defineProperty(Frame.prototype, "_nativeView", {
        get: function () {
            return this._android.rootViewGroup;
        },
        enumerable: true,
        configurable: true
    });
    Frame.prototype._clearAndroidReference = function () {
    };
    Object.defineProperty(Frame, "defaultAnimatedNavigation", {
        get: function () {
            return frameCommon.Frame.defaultAnimatedNavigation;
        },
        set: function (value) {
            frameCommon.Frame.defaultAnimatedNavigation = value;
        },
        enumerable: true,
        configurable: true
    });
    return Frame;
})(frameCommon.Frame);
exports.Frame = Frame;
var AndroidFrame = (function (_super) {
    __extends(AndroidFrame, _super);
    function AndroidFrame(owner) {
        _super.call(this);
        this.hasOwnActivity = false;
        this.showActionBar = false;
        this._owner = owner;
    }
    Object.defineProperty(AndroidFrame.prototype, "activity", {
        get: function () {
            if (this._activity) {
                return this._activity;
            }
            var currView = this._owner.parent;
            while (currView) {
                if (currView instanceof Frame) {
                    return currView.android.activity;
                }
                currView = currView.parent;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AndroidFrame.prototype, "actionBar", {
        get: function () {
            var activity = this.currentActivity;
            if (!activity) {
                return undefined;
            }
            var bar = activity.getActionBar();
            if (!bar) {
                return undefined;
            }
            return bar;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AndroidFrame.prototype, "currentActivity", {
        get: function () {
            var activity = this.activity;
            if (activity) {
                return activity;
            }
            var stack = frameCommon.stack(), length = stack.length, i = length - 1, frame;
            for (i; i >= 0; i--) {
                frame = stack[i];
                activity = frame.android.activity;
                if (activity) {
                    return activity;
                }
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AndroidFrame.prototype, "cachePagesOnNavigate", {
        get: function () {
            return this._cachePagesOnNavigate;
        },
        set: function (value) {
            if (this._cachePagesOnNavigate !== value) {
                if (this._owner.backStack.length > 0) {
                    throw new Error("Cannot set cachePagesOnNavigate if there are items in the back stack.");
                }
                this._cachePagesOnNavigate = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    AndroidFrame.prototype.onActivityRequested = function (intent) {
        if (this.activity) {
            throw new Error("Frame already attached to an Activity");
        }
        this.hasOwnActivity = true;
        return this.createActivity(intent);
    };
    AndroidFrame.prototype.canGoBack = function () {
        if (!this._activity) {
            return false;
        }
        return this._activity.getIntent().Action !== android.content.Intent.ACTION_MAIN;
    };
    AndroidFrame.prototype.reset = function () {
        delete this.rootViewGroup[OWNER];
        this._activity = undefined;
        this.rootViewGroup = undefined;
    };
    AndroidFrame.prototype.createActivity = function (intent) {
        var that = this;
        var body = {
            onCreate: function (savedInstanceState) {
                trace.write("NativeScriptActivity.onCreate(); savedInstanceState: " + savedInstanceState, trace.categories.NativeLifecycle);
                this.super.onCreate(savedInstanceState);
                if (this.hasActionBar) {
                    this.getWindow().requestFeature(android.view.Window.FEATURE_ACTION_BAR);
                }
                that._activity = this;
                var root = new panel.NativePanel(this);
                root[OWNER] = that._owner;
                that.rootViewGroup = root;
                that.rootViewGroup.setId(that._owner.containerViewId);
                this.setContentView(that.rootViewGroup);
                var isRestart = !!savedInstanceState;
                that._owner._onActivityCreated(isRestart);
            },
            onAttachFragment: function (fragment) {
                trace.write("NativeScriptActivity.onAttachFragment() : " + fragment.getTag(), trace.categories.NativeLifecycle);
                this.super.onAttachFragment(fragment);
                if (!fragment[PAGE]) {
                    findPageForFragment(fragment, that._owner);
                }
            },
            onSaveInstanceState: function (outState) {
                this.super.onSaveInstanceState(outState);
                trace.write("NativeScriptActivity.onSaveInstanceState();", trace.categories.NativeLifecycle);
            },
            onRestoreInstanceState: function (savedInstanceState) {
                this.super.onRestoreInstanceState(savedInstanceState);
                trace.write("NativeScriptActivity.onRestoreInstanceState(); savedInstanceState: " + savedInstanceState, trace.categories.NativeLifecycle);
            },
            onRestart: function () {
                this.super.onRestart();
                trace.write("NativeScriptActivity.onRestart();", trace.categories.NativeLifecycle);
            },
            onStart: function () {
                this.super.onStart();
                trace.write("NativeScriptActivity.onStart();", trace.categories.NativeLifecycle);
            },
            onResume: function () {
                this.super.onResume();
                trace.write("NativeScriptActivity.onResume();", trace.categories.NativeLifecycle);
                that._owner.onLoaded();
            },
            onPause: function () {
                this.super.onPause();
                trace.write("NativeScriptActivity.onPause();", trace.categories.NativeLifecycle);
                that._owner.onUnloaded();
            },
            onStop: function () {
                this.super.onStop();
                trace.write("NativeScriptActivity.onStop();", trace.categories.NativeLifecycle);
            },
            onDestroy: function () {
                var frame = that._owner;
                frame._onDetached(true);
                for (var i = 0; i < frame.backStack.length; i++) {
                    frame.backStack[i].resolvedPage._onDetached(true);
                }
                that.reset();
                this.super.onDestroy();
                trace.write("NativeScriptActivity.onDestroy();", trace.categories.NativeLifecycle);
            },
            onOptionsItemSelected: function (menuItem) {
                if (!that.hasListeners(frameCommon.knownEvents.android.optionSelected)) {
                    return false;
                }
                var data = {
                    handled: false,
                    eventName: frameCommon.knownEvents.android.optionSelected,
                    item: menuItem,
                    object: that
                };
                that.notify(data);
                return data.handled;
            },
            onBackPressed: function () {
                trace.write("NativeScriptActivity.onBackPressed;", trace.categories.NativeLifecycle);
                if (!frameCommon.goBack()) {
                    this.super.onBackPressed();
                }
            },
            onLowMemory: function () {
                gc();
                java.lang.System.gc();
                this.super.onLowMemory();
            },
            onTrimMemory: function (level) {
                gc();
                java.lang.System.gc();
                this.super.onTrimMemory(level);
            }
        };
        return com.tns.NativeScriptActivity.extend(body);
    };
    return AndroidFrame;
})(observable.Observable);
function findPageForFragment(fragment, frame) {
    var fragmentTag = fragment.getTag();
    var page;
    var entry;
    trace.write("Attached fragment with no page: " + fragmentTag, trace.categories.NativeLifecycle);
    if (frame.currentPage && frame.currentPage[FRAGMENT] === fragmentTag) {
        page = frame.currentPage;
        entry = frame.currentEntry;
        trace.write("Current page matches fragment: " + fragmentTag, trace.categories.NativeLifecycle);
    }
    else {
        for (var i = 0; i < frame.backStack.length; i++) {
            entry = frame.backStack[i];
            if (frame.backStack[i].tag === fragmentTag) {
                entry = frame.backStack[i];
                break;
            }
        }
        if (entry) {
            trace.write("Found entry:" + entry + " for fragment: " + fragmentTag, trace.categories.NativeLifecycle);
            page = entry.resolvedPage;
        }
    }
    if (page) {
        fragment[PAGE] = page;
        fragment[FRAME] = frame;
        fragment[ENTRY] = entry;
        page[FRAGMENT] = fragmentTag;
    }
    else {
        throw new Error("Could not find Page for Fragment.");
    }
}
function startActivity(activity, entry) {
    var intent = new android.content.Intent(activity, com.tns.NativeScriptActivity.class);
    intent.Action = android.content.Intent.ACTION_DEFAULT;
    activity.startActivity(intent);
}
