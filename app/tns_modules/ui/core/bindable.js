var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var observable = require("data/observable");
var dependencyObservable = require("ui/core/dependency-observable");
var weakEventListener = require("ui/core/weakEventListener");
var types = require("utils/types");
var trace = require("trace");
var polymerExpressions = require("js-libs/polymer-expressions");
exports.bindingContextProperty = new dependencyObservable.Property("bindingContext", "Bindable", new dependencyObservable.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataOptions.Inheritable));
var Bindable = (function (_super) {
    __extends(Bindable, _super);
    function Bindable() {
        _super.apply(this, arguments);
        this._bindings = {};
    }
    Object.defineProperty(Bindable.prototype, "bindingContext", {
        get: function () {
            return this._getValue(exports.bindingContextProperty);
        },
        set: function (value) {
            this._setValue(exports.bindingContextProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Bindable.prototype.bind = function (options, source) {
        var binding = this._bindings[options.targetProperty];
        if (binding) {
            binding.unbind();
        }
        binding = new Binding(this, options);
        this._bindings[options.targetProperty] = binding;
        var bindingSource = source;
        if (!bindingSource) {
            bindingSource = this.bindingContext;
        }
        if (bindingSource) {
            binding.bind(bindingSource);
        }
    };
    Bindable.prototype.unbind = function (property) {
        var binding = this._bindings[property];
        if (binding) {
            binding.unbind();
            delete this._bindings[property];
        }
    };
    Bindable.prototype._updateTwoWayBinding = function (propertyName, value) {
        var binding = this._bindings[propertyName];
        if (binding) {
            binding.updateTwoWay(value);
        }
    };
    Bindable.prototype._setCore = function (data) {
        _super.prototype._setCore.call(this, data);
        this._updateTwoWayBinding(data.propertyName, data.value);
    };
    Bindable.prototype._onPropertyChanged = function (property, oldValue, newValue) {
        _super.prototype._onPropertyChanged.call(this, property, oldValue, newValue);
        if (property === exports.bindingContextProperty) {
            this._onBindingContextChanged(oldValue, newValue);
        }
        var binding = this._bindings[property.name];
        if (binding) {
            var shouldRemoveBinding = !binding.updating && !binding.options.twoWay;
            if (shouldRemoveBinding) {
                this.unbind(property.name);
            }
            else {
                this._updateTwoWayBinding(property.name, newValue);
            }
        }
    };
    Bindable.prototype._onBindingContextChanged = function (oldValue, newValue) {
        var binding;
        for (var p in this._bindings) {
            binding = this._bindings[p];
            if (binding.source && binding.source.get() !== oldValue) {
                continue;
            }
            binding.unbind();
            if (newValue) {
                binding.bind(newValue);
            }
        }
    };
    return Bindable;
})(dependencyObservable.DependencyObservable);
exports.Bindable = Bindable;
var Binding = (function () {
    function Binding(target, options) {
        this.updating = false;
        this.weakEL = weakEventListener.WeakEventListener;
        this.target = new WeakRef(target);
        this.options = options;
    }
    Binding.prototype.bind = function (obj) {
        if (!obj) {
            throw new Error("Expected valid object reference as a source in the Binding.bind method.");
        }
        this.source = new WeakRef(obj);
        this.updateTarget(this.getSourceProperty());
        if (!this.sourceOptions) {
            this.sourceOptions = this.resolveOptions(this.source, this.options.sourceProperty);
        }
        var sourceOptionsInstance = this.sourceOptions.instance.get();
        if (sourceOptionsInstance instanceof observable.Observable) {
            this.weakEventListenerOptions = {
                target: this.target,
                source: this.sourceOptions.instance,
                eventName: observable.knownEvents.propertyChange,
                handler: this.onSourcePropertyChanged,
                handlerContext: this,
                key: this.options.targetProperty
            };
            this.weakEL.addWeakEventListener(this.weakEventListenerOptions);
        }
    };
    Binding.prototype.unbind = function () {
        if (!this.source) {
            return;
        }
        this.weakEL.removeWeakEventListener(this.weakEventListenerOptions);
        this.weakEventListenerOptions = undefined;
        this.source.clear();
        this.sourceOptions.instance.clear();
        this.sourceOptions = undefined;
        this.targetOptions = undefined;
    };
    Binding.prototype.updateTwoWay = function (value) {
        if (this.options.twoWay) {
            this.updateSource(value);
        }
    };
    Binding.prototype._isExpression = function (expression) {
        return expression.indexOf(" ") !== -1;
    };
    Binding.prototype._getExpressionValue = function (expression) {
        var exp = polymerExpressions.PolymerExpressions.getExpression(expression);
        if (exp) {
            return exp.getValue(this.source && this.source.get && this.source.get() || global);
        }
        return undefined;
    };
    Binding.prototype.onSourcePropertyChanged = function (data) {
        if (this._isExpression(this.options.sourceProperty)) {
            this.updateTarget(this._getExpressionValue(this.options.sourceProperty));
        }
        else if (data.propertyName === this.options.sourceProperty) {
            this.updateTarget(data.value);
        }
    };
    Binding.prototype.getSourceProperty = function () {
        if (this._isExpression(this.options.sourceProperty)) {
            return this._getExpressionValue(this.options.sourceProperty);
        }
        if (!this.sourceOptions) {
            this.sourceOptions = this.resolveOptions(this.source, this.options.sourceProperty);
        }
        var value;
        var sourceOptionsInstance = this.sourceOptions.instance.get();
        if (sourceOptionsInstance instanceof observable.Observable) {
            value = sourceOptionsInstance.get(this.sourceOptions.property);
        }
        else if (sourceOptionsInstance && this.sourceOptions.property && this.sourceOptions.property in sourceOptionsInstance) {
            value = sourceOptionsInstance[this.sourceOptions.property];
        }
        return value;
    };
    Binding.prototype.updateTarget = function (value) {
        if (this.updating || (!this.target || !this.target.get())) {
            return;
        }
        if (!this.targetOptions) {
            this.targetOptions = this.resolveOptions(this.target, this.options.targetProperty);
        }
        this.updateOptions(this.targetOptions, value);
    };
    Binding.prototype.updateSource = function (value) {
        if (this.updating || (!this.source || !this.source.get())) {
            return;
        }
        if (!this.sourceOptions) {
            this.sourceOptions = this.resolveOptions(this.source, this.options.sourceProperty);
        }
        this.updateOptions(this.sourceOptions, value);
    };
    Binding.prototype.resolveOptions = function (obj, property) {
        var options;
        if (!this._isExpression(property) && types.isString(property) && property.indexOf(".") !== -1) {
            var properties = property.split(".");
            var i;
            var currentObject = obj.get();
            for (i = 0; i < properties.length - 1; i++) {
                currentObject = currentObject[properties[i]];
            }
            options = {
                instance: new WeakRef(currentObject),
                property: properties[properties.length - 1]
            };
        }
        else {
            options = {
                instance: obj,
                property: property
            };
        }
        return options;
    };
    Binding.prototype.updateOptions = function (options, value) {
        this.updating = true;
        var optionsInstance = options.instance.get();
        try {
            if (optionsInstance instanceof observable.Observable) {
                optionsInstance.set(options.property, value);
            }
            else {
                optionsInstance[options.property] = value;
            }
        }
        catch (ex) {
            trace.write("Binding error while setting property " + options.property + " of " + optionsInstance + ": " + ex, trace.categories.Binding, trace.messageType.error);
        }
        this.updating = false;
    };
    return Binding;
})();
exports.Binding = Binding;
