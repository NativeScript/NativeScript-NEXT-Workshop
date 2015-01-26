exports.fromResource = function (name) {
    return UIImage.imageNamed(name);
};
exports.fromFile = function (path) {
    return UIImage.imageWithContentsOfFile(path);
};
exports.fromData = function (data) {
    return UIImage.imageWithData(data);
};
exports.saveToFile = function (instance, path, format, quality) {
    if (!instance) {
        return false;
    }
    var res = false;
    var data = null;
    switch (format) {
        case 0:
            data = UIImagePNGRepresentation(instance);
            break;
        case 1:
            data = UIImageJPEGRepresentation(instance, ('undefined' === typeof quality) ? 1.0 : quality);
            break;
    }
    if (data) {
        res = data.writeToFileAtomically(path, true);
    }
    return res;
};
