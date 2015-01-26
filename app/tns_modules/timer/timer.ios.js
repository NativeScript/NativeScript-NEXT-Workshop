var timeoutCallbacks = {};
var TimerTargetClass = NSObject.extend({
    tick: function (timer) {
        this["_callback"].call();
    }
}, {
    exposedMethods: { "tick": "v@" }
});
function createTimerAndGetId(callback, milliseconds, shouldRepeat) {
    var id = new Date().getUTCMilliseconds();
    var timerTarget = TimerTargetClass.alloc();
    timerTarget["_callback"] = callback;
    var timer = NSTimer.scheduledTimerWithTimeIntervalTargetSelectorUserInfoRepeats(milliseconds / 1000, timerTarget, "tick", null, shouldRepeat);
    if (!timeoutCallbacks[id]) {
        timeoutCallbacks[id] = timer;
    }
    return id;
}
function setTimeout(callback, milliseconds) {
    if (milliseconds === void 0) { milliseconds = 0; }
    return createTimerAndGetId(callback, milliseconds, false);
}
exports.setTimeout = setTimeout;
function clearTimeout(id) {
    if (timeoutCallbacks[id]) {
        timeoutCallbacks[id].invalidate();
        timeoutCallbacks[id] = null;
    }
}
exports.clearTimeout = clearTimeout;
function setInterval(callback, milliseconds) {
    if (milliseconds === void 0) { milliseconds = 0; }
    return createTimerAndGetId(callback, milliseconds, true);
}
exports.setInterval = setInterval;
exports.clearInterval = clearTimeout;
