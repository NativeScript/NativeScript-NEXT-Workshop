var view = require("ui/core/view");
var gridPanelDef = require("ui/panels/grid-panel");
var types = require("utils/types");
var fs = require("file-system");
var KNOWNEVENTS = "knownEvents";
var UI_PATH = "ui/";
var MODULES = {
    "ActivityIndicator": "activity-indicator",
    "ListView": "list-view",
    "GridPanel": "panels/grid-panel",
    "ColumnDefinition": "panels/grid-panel",
    "RowDefinition": "panels/grid-panel",
    "StackPanel": "panels/stack-panel",
    "ScrollView": "scroll-view",
    "SearchBar": "search-bar",
    "SlideOut": "slide-out",
    "TabView": "tab-view",
    "TabEntry": "tab-view",
    "TextField": "text-field",
};
var ROW = "row";
var COL = "col";
var COL_SPAN = "colSpan";
var ROW_SPAN = "rowSpan";
function getComponentModule(elementName, namespace, attributes, exports) {
    var instance;
    var instanceModule;
    var componentModule;
    var moduleId = MODULES[elementName] || elementName.toLowerCase();
    try {
        instanceModule = require(types.isString(namespace) && fs.path.join(fs.knownFolders.currentApp().path, namespace) || (UI_PATH + moduleId));
        var instanceType = instanceModule[elementName] || Object;
        instance = new instanceType();
    }
    catch (ex) {
    }
    if (instance && instanceModule) {
        var bindings = new Array();
        for (var attr in attributes) {
            if (attr in instance) {
                var attrValue = attributes[attr];
                if (isBinding(attrValue)) {
                    instance.bind(getBinding(instance, attr, attrValue));
                }
                else {
                    instance[attr] = attrValue;
                }
            }
            else if (isKnownEvent(attr, instanceModule)) {
                var handlerName = attributes[attr];
                var handler = exports[handlerName];
                if (types.isFunction(handler)) {
                    instance.on(attr, handler);
                }
            }
            else if (attr === ROW) {
                gridPanelDef.GridPanel.setRow(instance, attributes[attr]);
            }
            else if (attr === COL) {
                gridPanelDef.GridPanel.setColumn(instance, attributes[attr]);
            }
            else if (attr === COL_SPAN) {
                gridPanelDef.GridPanel.setColumnSpan(instance, attributes[attr]);
            }
            else if (attr === ROW_SPAN) {
                gridPanelDef.GridPanel.setRowSpan(instance, attributes[attr]);
            }
            else {
                instance[attr] = attributes[attr];
            }
        }
        componentModule = { component: instance, exports: instanceModule, bindings: bindings };
    }
    return componentModule;
}
exports.getComponentModule = getComponentModule;
function isKnownEvent(name, exports) {
    return (KNOWNEVENTS in exports && name in exports[KNOWNEVENTS]) || (KNOWNEVENTS in view && name in view[KNOWNEVENTS]);
}
function getBinding(instance, name, value) {
    var source = value.replace("{{", "").replace("}}", "").trim();
    return { targetProperty: name, sourceProperty: source, twoWay: true };
}
function isBinding(value) {
    var isBinding;
    if (types.isString(value)) {
        var str = value.trim();
        isBinding = str.indexOf("{{") === 0 && str.lastIndexOf("}}") === str.length - 2;
    }
    return isBinding;
}
