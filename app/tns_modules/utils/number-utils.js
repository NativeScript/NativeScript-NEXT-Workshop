var epsilon = 1E-05;
function areClose(value1, value2) {
    return (Math.abs(value1 - value2) < epsilon);
}
exports.areClose = areClose;
function greaterThanOrClose(value1, value2) {
    return (value1 > value2) || areClose(value1, value2);
}
exports.greaterThanOrClose = greaterThanOrClose;
function greaterThan(value1, value2) {
    return (value1 > value2) && !areClose(value1, value2);
}
exports.greaterThan = greaterThan;
function isZero(value) {
    return (Math.abs(value) < epsilon);
}
exports.isZero = isZero;
function greaterThanZero(value) {
    return value > 0;
}
exports.greaterThanZero = greaterThanZero;
function notNegative(value) {
    return value >= 0;
}
exports.notNegative = notNegative;
function isFiniteNumberOrNaN(value) {
    var num = value;
    return isFinite(num) || isNaN(num);
}
exports.isFiniteNumberOrNaN = isFiniteNumberOrNaN;
