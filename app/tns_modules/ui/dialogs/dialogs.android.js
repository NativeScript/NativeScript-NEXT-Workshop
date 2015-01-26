var dialogs = require("ui/dialogs");
var dialogs_common = require("ui/dialogs/dialogs-common");
var appmodule = require("application");
require("utils/module-merge").merge(dialogs_common, exports);
function createAlertDialog(message, options) {
    var alert = new android.app.AlertDialog.Builder(appmodule.android.foregroundActivity);
    alert.setTitle(options && options.title ? options.title : "");
    alert.setMessage(message);
    return alert;
}
function addButtonsToAlertDialog(alert, options, callback) {
    if (!options) {
        return;
    }
    if (options.okButtonText) {
        alert.setPositiveButton(options.okButtonText, new android.content.DialogInterface.OnClickListener({
            onClick: function (dialog, id) {
                dialog.cancel();
                callback(true);
            }
        }));
    }
    if (options.cancelButtonText) {
        alert.setNegativeButton(options.cancelButtonText, new android.content.DialogInterface.OnClickListener({
            onClick: function (dialog, id) {
                dialog.cancel();
                callback(false);
            }
        }));
    }
    if (options.neutralButtonText) {
        alert.setNeutralButton(options.neutralButtonText, new android.content.DialogInterface.OnClickListener({
            onClick: function (dialog, id) {
                dialog.cancel();
                callback(undefined);
            }
        }));
    }
}
function alert(message, options) {
    if (options === void 0) { options = { title: dialogs_common.ALERT, okButtonText: dialogs_common.OK }; }
    return new Promise(function (resolve, reject) {
        try {
            var alert = createAlertDialog(message, options);
            alert.setPositiveButton(options.okButtonText, new android.content.DialogInterface.OnClickListener({
                onClick: function (dialog, id) {
                    dialog.cancel();
                    resolve();
                }
            }));
            alert.show();
        }
        catch (ex) {
            reject(ex);
        }
    });
}
exports.alert = alert;
function confirm(message, options) {
    if (options === void 0) { options = { title: dialogs_common.CONFIRM, okButtonText: dialogs_common.OK, cancelButtonText: dialogs_common.CANCEL }; }
    return new Promise(function (resolve, reject) {
        try {
            var alert = createAlertDialog(message, options);
            addButtonsToAlertDialog(alert, options, function (result) {
                resolve(result);
            });
            alert.show();
        }
        catch (ex) {
            reject(ex);
        }
    });
}
exports.confirm = confirm;
function prompt(message, defaultText, options) {
    if (options === void 0) { options = { title: dialogs_common.PROMPT, okButtonText: dialogs_common.OK, cancelButtonText: dialogs_common.CANCEL, inputType: dialogs.inputType.password }; }
    return new Promise(function (resolve, reject) {
        try {
            var alert = createAlertDialog(message, options);
            var input = new android.widget.EditText(appmodule.android.context);
            if (options.inputType === dialogs.inputType.password) {
                input.setInputType(android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD);
            }
            input.setText(defaultText ? defaultText : "");
            alert.setView(input);
            var getText = function () {
                return input.getText().toString();
            };
            addButtonsToAlertDialog(alert, options, function (r) {
                resolve({ result: r, text: getText() });
            });
            alert.show();
        }
        catch (ex) {
            reject(ex);
        }
    });
}
exports.prompt = prompt;
function login(message, userName, password, options) {
    if (options === void 0) { options = { title: dialogs_common.LOGIN, okButtonText: dialogs_common.OK, cancelButtonText: dialogs_common.CANCEL }; }
    return new Promise(function (resolve, reject) {
        try {
            var context = appmodule.android.context;
            var alert = createAlertDialog(message, options);
            var userNameInput = new android.widget.EditText(context);
            userNameInput.setText(userName ? userName : "");
            var passwordInput = new android.widget.EditText(appmodule.android.context);
            passwordInput.setInputType(android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD);
            passwordInput.setText(password ? password : "");
            var layout = new android.widget.LinearLayout(context);
            layout.setOrientation(1);
            layout.addView(userNameInput);
            layout.addView(passwordInput);
            alert.setView(layout);
            addButtonsToAlertDialog(alert, options, function (r) {
                resolve({
                    result: r,
                    userName: userNameInput.getText().toString(),
                    password: passwordInput.getText().toString()
                });
            });
            alert.show();
        }
        catch (ex) {
            reject(ex);
        }
    });
}
exports.login = login;
var Dialog = (function () {
    function Dialog(message, callback, options) {
        this._android = createAlertDialog(message, options);
        addButtonsToAlertDialog(this.android, options, function (r) {
            if (callback) {
                callback(r);
            }
        });
    }
    Object.defineProperty(Dialog.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Dialog.prototype.show = function () {
        this._dialog = this.android.show();
    };
    Dialog.prototype.hide = function () {
        if (this._dialog) {
            this._dialog.hide();
        }
    };
    return Dialog;
})();
exports.Dialog = Dialog;
