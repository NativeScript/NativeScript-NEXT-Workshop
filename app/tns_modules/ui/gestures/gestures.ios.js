var common = require("ui/gestures/gestures-common");
var definition = require("ui/gestures");
var OWNER = "_owner";
var CALLBACK = "_callback";
var TYPE = "_type";
var TARGET = "_target";
require("utils/module-merge").merge(common, exports);
var GesturesObserver = (function () {
    function GesturesObserver(callback) {
        this._callback = callback;
        this._recognizers = {};
    }
    GesturesObserver.prototype.observe = function (target, type) {
        var _this = this;
        this.disconnect();
        this._target = target;
        if (this._target && this._target.ios && this._target.ios.addGestureRecognizer) {
            var nativeView = this._target.ios;
            if (type & definition.GestureTypes.Tap) {
                nativeView.addGestureRecognizer(this._createRecognizer(definition.GestureTypes.Tap));
            }
            if (type & definition.GestureTypes.DoubleTap) {
                var r = this._createRecognizer(definition.GestureTypes.DoubleTap);
                r.numberOfTapsRequired = 2;
                nativeView.addGestureRecognizer(r);
            }
            if (type & definition.GestureTypes.Pinch) {
                nativeView.addGestureRecognizer(this._createRecognizer(definition.GestureTypes.Pinch, function (args) {
                    _this._executeCallback(_getPinchData(args));
                }));
            }
            if (type & definition.GestureTypes.Pan) {
                nativeView.addGestureRecognizer(this._createRecognizer(definition.GestureTypes.Pan));
            }
            if (type & definition.GestureTypes.Swipe) {
                nativeView.addGestureRecognizer(this._createRecognizer(definition.GestureTypes.Swipe, function (args) {
                    _this._executeCallback(_getSwipeData(args));
                }));
            }
            if (type & definition.GestureTypes.Rotation) {
                nativeView.addGestureRecognizer(this._createRecognizer(definition.GestureTypes.Rotation, function (args) {
                    _this._executeCallback(_getRotationData(args));
                }));
            }
            if (type & definition.GestureTypes.LongPress) {
                nativeView.addGestureRecognizer(this._createRecognizer(definition.GestureTypes.LongPress));
            }
        }
    };
    GesturesObserver.prototype.disconnect = function () {
        if (this._target && this._target.ios) {
            for (var i in this._recognizers) {
                var item = i;
                this._target.ios.removeGestureRecognizer(item.recognizer);
                item.recognizer = null;
                item.target = null;
            }
            this._recognizers = {};
        }
        this._target = null;
    };
    GesturesObserver.prototype._executeCallback = function (args) {
        if (this._callback) {
            this._callback(args);
        }
    };
    GesturesObserver.prototype._createRecognizer = function (type, callback) {
        var recognizer;
        var name = definition.toString(type);
        var target = _createUIGestureRecognizerTarget(this, type, callback);
        var recognizerType = _getUIGestureRecognizerType(type);
        if (recognizerType) {
            recognizer = recognizerType.alloc().initWithTargetAction(target, "recognize");
            if (recognizer) {
                this._recognizers[name] = { recognizer: recognizer, target: target };
            }
        }
        return recognizer;
    };
    return GesturesObserver;
})();
exports.GesturesObserver = GesturesObserver;
function _createUIGestureRecognizerTarget(owner, type, callback) {
    var target = UIGestureRecognizerTargetClass.alloc();
    target[OWNER] = new WeakRef(owner);
    target[TYPE] = type;
    target[CALLBACK] = callback;
    return target;
}
var UIGestureRecognizerTargetClass = NSObject.extend({
    recognize: function (recognizer) {
        var weakRef = this[OWNER];
        if (weakRef) {
            var owner = weakRef.get();
            if (owner) {
                var callback = this[CALLBACK] ? this[CALLBACK] : owner[CALLBACK];
                var type = this[TYPE];
                var target = owner[TARGET];
                var args = {
                    type: type,
                    view: target,
                    ios: recognizer,
                    android: undefined
                };
                if (callback) {
                    callback(args);
                }
            }
        }
    }
}, {
    exposedMethods: { "recognize": "v@" }
});
function _getUIGestureRecognizerType(type) {
    var nativeType = null;
    if (type === definition.GestureTypes.Tap) {
        nativeType = UITapGestureRecognizer;
    }
    else if (type === definition.GestureTypes.DoubleTap) {
        nativeType = UITapGestureRecognizer;
    }
    else if (type === definition.GestureTypes.Pinch) {
        nativeType = UIPinchGestureRecognizer;
    }
    else if (type === definition.GestureTypes.Pan) {
        nativeType = UIPanGestureRecognizer;
    }
    else if (type === definition.GestureTypes.Swipe) {
        nativeType = UISwipeGestureRecognizer;
    }
    else if (type === definition.GestureTypes.Rotation) {
        nativeType = UIRotationGestureRecognizer;
    }
    else if (type === definition.GestureTypes.LongPress) {
        nativeType = UILongPressGestureRecognizer;
    }
    return nativeType;
}
function _getSwipeDirection(direction) {
    if (direction === UISwipeGestureRecognizerDirection.UISwipeGestureRecognizerDirectionDown) {
        return definition.SwipeDirection.Down;
    }
    else if (direction === UISwipeGestureRecognizerDirection.UISwipeGestureRecognizerDirectionLeft) {
        return definition.SwipeDirection.Left;
    }
    else if (direction === UISwipeGestureRecognizerDirection.UISwipeGestureRecognizerDirectionRight) {
        return definition.SwipeDirection.Right;
    }
    else if (direction === UISwipeGestureRecognizerDirection.UISwipeGestureRecognizerDirectionUp) {
        return definition.SwipeDirection.Up;
    }
}
function _getPinchData(args) {
    var recognizer = args.ios;
    return {
        type: args.type,
        view: args.view,
        ios: args.ios,
        android: undefined,
        scale: recognizer.scale,
    };
}
function _getSwipeData(args) {
    var recognizer = args.ios;
    return {
        type: args.type,
        view: args.view,
        ios: args.ios,
        android: undefined,
        direction: _getSwipeDirection(recognizer.direction),
    };
}
function _getRotationData(args) {
    var recognizer = args.ios;
    return {
        type: args.type,
        view: args.view,
        ios: args.ios,
        android: undefined,
        rotation: recognizer.rotation * (180.0 / Math.PI),
    };
}
