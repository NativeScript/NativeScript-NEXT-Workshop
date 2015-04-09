var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var observable = require("data/observable");
var imageManipulation = require("../image-manipulation/image-manipulation");
var localStorage = require("../local-storage/local-storage");
var socialShare = require("../social-share/social-share");

var CreateMemeViewModel = (function (_super) {
    __extends(CreateMemeViewModel, _super);
    function CreateMemeViewModel() {
        _super.apply(this, arguments);
        this.topText = "";
        this.bottomText = "";
        this.fontSize = 40;
        this.isBlackText = false;
    }
    CreateMemeViewModel.prototype.prepareEditor = function (image) {
        this.selectedImage = image;

        this.set("topText", "");
        this.set("bottomText", "");
        this.set("fontSize", 40);
        this.set("isBlackText", false);
        this.set("memeImage", image);

        this.refreshUniqueName();
    };

    CreateMemeViewModel.prototype.refreshMeme = function () {
        var image = imageManipulation.addText(this.selectedImage, this.topText, this.bottomText, this.fontSize, this.isBlackText);

        this.set("memeImage", image);
    };

    CreateMemeViewModel.prototype.addRefreshOnChange = function () {
        var viewModel = this;

        this.addEventListener(observable.knownEvents.propertyChange, function (changes) {
            //skip if memeImage changes
            if (changes.propertyName === "memeImage")
                return;

            viewModel.refreshMeme();
        });
    };

    CreateMemeViewModel.prototype.refreshUniqueName = function () {
        this.uniqueImageName = this.generateUUID() + ".png";
    };

    CreateMemeViewModel.prototype.generateUUID = function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

    CreateMemeViewModel.prototype.saveLocally = function () {
        this.refreshMeme();
        var saved = localStorage.saveLocally(this.uniqueImageName, this.memeImage);

        if (!saved) {
            console.log("Recent meme not saved....");
        } else {
            console.log("Recent template saved.");
        }
    };

    CreateMemeViewModel.prototype.share = function () {
        try  {
            socialShare.share(this.memeImage);
        } catch (e) {
            console.log(e.message);
        }
    };
    return CreateMemeViewModel;
})(observable.Observable);
exports.CreateMemeViewModel = CreateMemeViewModel;

exports.createMemeViewModel = new CreateMemeViewModel();
//# sourceMappingURL=view-model.js.map
