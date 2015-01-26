var FrameHandlerClass = NSObject.extend({
    handleFrame: function (sender) {
        this["_owner"].handleFrame(sender);
    }
}, {
    exposedMethods: {
        "handleFrame": "v@"
    }
});
var FPSCallback = (function () {
    function FPSCallback(onFrame) {
        this.onFrame = onFrame;
        this.impl = FrameHandlerClass.alloc();
        this.impl["_owner"] = this;
        this.displayLink = CADisplayLink.displayLinkWithTargetSelector(this.impl, "handleFrame");
        this.displayLink.paused = true;
        this.displayLink.addToRunLoopForMode(NSRunLoop.currentRunLoop(), NSDefaultRunLoopMode);
    }
    FPSCallback.prototype.start = function () {
        if (this.running) {
            return;
        }
        this.running = true;
        this.displayLink.paused = false;
    };
    FPSCallback.prototype.stop = function () {
        if (!this.running) {
            return;
        }
        this.displayLink.paused = true;
        this.running = false;
    };
    FPSCallback.prototype.handleFrame = function (sender) {
        if (!this.running) {
            return;
        }
        this.onFrame(sender.timestamp * 1000);
    };
    return FPSCallback;
})();
exports.FPSCallback = FPSCallback;
