var applicationModule = require("application");
var frameModule = require("ui/frame");
var fs = require("file-system");

var navigation = require( "../../shared/navigation");
var marked = require( "../../node_modules/marked/marked.min");

var _page;

exports.loaded = function(args) {
  _page = args.object;

  if (applicationModule.ios) {
    frameModule.topmost().ios.navBarVisibility = "never";
  }

  var webView = _page.getViewById("releaseNotesView");

  var releaseNotesFolder = "./components/releases/versionInfo";
  var fullPath = fs.path.join(fs.knownFolders.currentApp().path, releaseNotesFolder);

  var releaseFolder = fs.Folder.fromPath(fullPath);
  var releaseNotes = releaseFolder.getFile(global.appVersion + ".md");

  releaseNotes.readText().then(function(content){
    var convertedReleaseNotes = marked(content);

    if (applicationModule.ios) {
      webView.ios.loadHTMLStringBaseURL(convertedReleaseNotes, null);
    }

    if (applicationModule.android) {
      webview.android.loadData(convertedReleaseNotes, "text/html", null);
    }

  });
};

exports.okGotIt = function(args) {
  //set the app flag that says they saw it
  navigation.goHome();
};
