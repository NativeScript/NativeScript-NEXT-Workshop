var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var observable = require("data/observable");
var observableArray = require("data/observable-array");
var FormattedString = (function (_super) {
    __extends(FormattedString, _super);
    function FormattedString() {
        _super.call(this);
        this._spans = new observableArray.ObservableArray();
        this._spans.addEventListener(observableArray.knownEvents.change, this.onSpansCollectionChanged, this);
        this._isDirty = true;
    }
    Object.defineProperty(FormattedString.prototype, "spans", {
        get: function () {
            if (!this._spans) {
                this._spans = new observableArray.ObservableArray();
            }
            return this._spans;
        },
        enumerable: true,
        configurable: true
    });
    FormattedString.prototype.onSpansCollectionChanged = function (eventData) {
        var i;
        if (eventData.addedCount > 0) {
            for (i = 0; i < eventData.addedCount; i++) {
                var addedSpan = eventData.object.getItem(eventData.index + i);
                addedSpan.addEventListener(observable.knownEvents.propertyChange, this.onSpanChanged, this);
            }
        }
        if (eventData.removed && eventData.removed.length > 0) {
            var p;
            for (p = 0; p < eventData.removed.length; p++) {
                var removedSpan = eventData.removed[p];
                removedSpan.removeEventListener(observable.knownEvents.propertyChange, this.onSpanChanged, this);
            }
        }
        this.updateFormattedText(true);
    };
    FormattedString.prototype.onSpanChanged = function (eventData) {
        this.updateFormattedText(true);
    };
    FormattedString.prototype.updateFormattedText = function (isDirty) {
        var shouldUpdate = isDirty || this._isDirty;
        if (shouldUpdate) {
            this.createFormattedStringCore();
            this._isDirty = false;
            this.notify(this._createPropertyChangeData("", this));
        }
    };
    FormattedString.prototype.createFormattedStringCore = function () {
    };
    FormattedString.prototype.toString = function () {
        var result = "";
        var i;
        for (i = 0; i < this._spans.length; i++) {
            result += this._spans.getItem(i).text;
        }
        return result;
    };
    return FormattedString;
})(observable.Observable);
exports.FormattedString = FormattedString;
