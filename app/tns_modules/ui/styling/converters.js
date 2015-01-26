var color = require("color");
var enums = require("ui/enums");
var geometry = require("utils/geometry");
var types = require("utils/types");
function colorConverter(cssValue) {
    return new color.Color(cssValue);
}
exports.colorConverter = colorConverter;
function fontSizeConverter(cssValue) {
    var result = parseFloat(cssValue);
    return result;
}
exports.fontSizeConverter = fontSizeConverter;
function textAlignConverter(cssValue) {
    switch (cssValue) {
        case enums.TextAlignment.left:
        case enums.TextAlignment.center:
        case enums.TextAlignment.right:
            return cssValue;
            break;
        default:
            throw new Error("CSS text-align \"" + cssValue + "\" is not supported.");
            break;
    }
}
exports.textAlignConverter = textAlignConverter;
function thicknessConverter(cssValue) {
    return geometry.Thickness.convert(cssValue);
}
exports.thicknessConverter = thicknessConverter;
exports.numberConverter = parseFloat;
function visibilityConverter(cssValue) {
    if (types.isString(cssValue) && cssValue.toLowerCase() === enums.Visibility.collapsed) {
        return enums.Visibility.collapsed;
    }
    return enums.Visibility.visible;
}
exports.visibilityConverter = visibilityConverter;
function opacityConverter(cssValue) {
    var result = parseFloat(cssValue);
    result = Math.max(0.0, result);
    result = Math.min(1.0, result);
    return result;
}
exports.opacityConverter = opacityConverter;
