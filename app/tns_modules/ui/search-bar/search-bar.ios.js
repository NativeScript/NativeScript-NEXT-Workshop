var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/search-bar/search-bar-common");
function onTextPropertyChanged(data) {
    var bar = data.object;
    bar.ios.text = data.newValue;
}
common.textProperty.metadata.onSetNativeValue = onTextPropertyChanged;
require("utils/module-merge").merge(common, exports);
var OWNER = "_owner";
var EMPTY = "";
var SEARCHTEXT = "searchText";
var SearchBarDelegateClass = NSObject.extend({
    searchBarTextDidChange: function (searchBar, searchText) {
        var owner = this.getOwner();
        if (owner) {
            owner._onPropertyChangedFromNative(common.textProperty, searchText);
            if (searchText === EMPTY && this[SEARCHTEXT] !== searchText) {
                owner._emit(common.knownEvents.clear);
            }
            this[SEARCHTEXT] = searchText;
        }
    },
    searchBarCancelButtonClicked: function (searchBar) {
        searchBar.resignFirstResponder();
        var owner = this.getOwner();
        if (owner) {
            owner._emit(common.knownEvents.clear);
        }
    },
    searchBarSearchButtonClicked: function (searchBar) {
        searchBar.resignFirstResponder();
        var owner = this.getOwner();
        if (owner) {
            owner._emit(common.knownEvents.submit);
        }
    },
    getOwner: function () {
        return this[OWNER].get();
    }
}, {
    protocols: [UISearchBarDelegate]
});
var SearchBar = (function (_super) {
    __extends(SearchBar, _super);
    function SearchBar() {
        _super.call(this);
        this._ios = new UISearchBar();
        this._delegate = SearchBarDelegateClass.alloc();
        this._delegate[OWNER] = new WeakRef(this);
        this._ios.delegate = this._delegate;
    }
    Object.defineProperty(SearchBar.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    return SearchBar;
})(common.SearchBar);
exports.SearchBar = SearchBar;
