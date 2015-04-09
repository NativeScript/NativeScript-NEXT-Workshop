import observable = require("data/observable");
import imageManipulation = require("../image-manipulation/image-manipulation");
import localStorage = require("../local-storage/local-storage");
import socialShare = require("../social-share/social-share");

export class CreateMemeViewModel extends observable.Observable {
	public topText: string = "";
	public bottomText: string = "";
	public fontSize: number = 40;
	public isBlackText: boolean = false;
	private selectedImage: any;
	public memeImage: any;
	private uniqueImageName: string;
	
	public prepareEditor(image: any) {
		this.selectedImage = image;

		this.set("topText", "");
		this.set("bottomText", "");
	    this.set("fontSize", 40);
	    this.set("isBlackText", false);
		this.set("memeImage", image);
		
		this.refreshUniqueName();
	}
	
	public refreshMeme() {
		var image = imageManipulation.addText(
				this.selectedImage, this.topText, this.bottomText, this.fontSize, this.isBlackText);

			this.set("memeImage", image);
	}
	
	public addRefreshOnChange() {
		var viewModel = this;
		
		this.addEventListener(observable.knownEvents.propertyChange, function(changes) {
			//skip if memeImage changes
			if(changes.propertyName === "memeImage")
				return;
			
			viewModel.refreshMeme();
        });
    }

    refreshUniqueName() {
        this.uniqueImageName = this.generateUUID() + ".png";
    }

    generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

	public saveLocally() {
        this.refreshMeme();
        var saved = localStorage.saveLocally(this.uniqueImageName, this.memeImage);

        if (!saved) {
            console.log("Recent meme not saved....");
        } else {
            console.log("Recent template saved.");
        }
    }

    public share() {
        try {
            socialShare.share(this.memeImage);
        }
        catch (e) {
            console.log(e.message);
        }
    }
}

export var createMemeViewModel = new CreateMemeViewModel();