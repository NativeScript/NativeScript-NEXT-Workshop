var NativeScriptMonitor = require('./NativeScriptMonitor').Monitor;
var monitor = new NativeScriptMonitor({
    productId: '8a1b9cc4a8f149c88237028e773b8b9d',
    version: '0.9'
});

monitor.start();
module.exports = monitor;