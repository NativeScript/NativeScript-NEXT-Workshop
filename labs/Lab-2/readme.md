# 2015 TelerikNEXT NativeScript {N} Workshop - Lab #2
Contributors: [Clark Sell](http://csell.net) & [TJ Vantoll](http://tjvantoll.com/) & Sebastian Witalec. You can find us on Twitter at: [@csell5](https://twitter.com/csell5), [@tjvantoll](https://twitter.com/tjvantoll), [@sebawita](https://twitter.com/sebawita)

Tags: TelerikNEXT, NativeScript, {N}, JavaScript, CSS3, iOS, Android

## Abstract

In this lab we’re going to work through building and using the new XMLHttpRequest JavaScript api’s. There are four steps in this lab each building upon concepts from the previous step.

## What will you learn?

In this lab you will learn the basics for using XMLHttpRequest Level2 or XHR L2.

* Navigation
* Page Events
* 
 
## Prerequisites

### Step 0: [Clone the repo]() - pointer back up


## Running the labs.
TBD… put a pointer back to the main labs directions. we just need one item here. 

## The Lab

### Step #1

In this step we’re going to learn how to create a basic XHR object and use it.

Lets start by creating the basic XMLHttpRequest object. 
	
		var xhr = new XMLHttpRequest();

Most modern browsers have already implemented some part of the XMLHTTPRequest L2 specification but some older versions still haven’t. In the case of IE we can check the browser and if it doesn’t support it create the ActiveX version of it. 

		var xhr; 

		if (window.XMLHttpRequest) {        
			xhr = new XMLHttpRequest();
	    } else if (window.ActiveXObject) {
		    xhr = new ActiveXObject(“Microsoft.XMLHTTP”);
	    }

In this lab we have created the XHR object for you. See that implementation at top of each `step_.js` file.

**Open**

With the object now created we now need to set it up. 

		xhr.open(‘GET’, ‘http://developerSmackdown.com')’

Spec: http://dvcs.w3.org/hg/xhr/raw-file/tip/Overview.html#the-open-method

Important to note the open method is part of a larger request namespace contating many methods to support your call: http://dvcs.w3.org/hg/xhr/raw-file/tip/Overview.html#request

**Supported Events**

For purposes of this lab we’re going to implement two XHR event, `onerror` and `onload`. You can find all of the supported events here: http://dvcs.w3.org/hg/xhr/raw-file/tip/Overview.html#event-handlers

		xhr.onload = onLoaded;
		xhr.onerror = onError;

Of course doing that assumes we have a function called `onLoaded` and another `onError` already defined. Lets create them now.

**function onError**

onError is the function that will do our error handling. Given this is just a lab we’re going to just take the error message and place it in our empty div called `#errors`. 

		function onerror(e){
			$(‘#errors’).text(e.message);
		};

**function onLoaded**

In our callback `onLoaded` we can first check the status code from the response. If the status is a `200`, we can take the results `this.responseText` and append that to an empty div `#results` we have placed on the page.

		if (this.status == 200) {
			var results = this.responseText;
			$(‘#results’).append(results);
		}

It’s important to note that we are just grabbing the responseText already knowing a great deal about our endpoint. There is a number of methods focused purely on the response.

Spec: http://dvcs.w3.org/hg/xhr/raw-file/tip/Overview.html#response

**Execution**

At this point our object is configured and waiting to make the call. We do that by calling `send()` and passing along any relevant information if there is any. 

		xhr.send();

Spec: http://dvcs.w3.org/hg/xhr/raw-file/tip/Overview.html#the-send-method

### Step #2

In this step we are going to expand upon what we did in step 1. Like before the XHR object has already been created for you.

**Open**

Like last time we are going to perform a `get` on an endpoint but this time rather than being a web page it will be an API which returns either XML or JSON.

		xhr.open(‘GET’, ‘http://developersmackdown.com/services/odata/Shows(PodcastId=1,ShowId=54)', true);

**Response Type**

By default this endpoint will just return XML and what we really want is JSON. To do so, we need to tell DeveloperSmackdown.com that we accept JSON rather than it’s default ( xml ). We do this by setting a requestHeader.

		xhr.setRequestHeader(‘accept’, ‘application/json’);

Spec: http://dvcs.w3.org/hg/xhr/raw-file/tip/Overview.html#the-setrequestheader-method

**Events**

Like step 1 we need to registered our functions with the correct events. This time our `onload` event we will want to parse the `responseText` as JSON since that is what we asked for.

		function onloaded(e){

			if (this.status == 200) {
				var results = JSON.parse(this.responseText);
				$(‘#results’).text(results.d.Title);
			}
		};


### Step #3

**At time time of writing this, this step only correctly worked in Firefox.**

CORS is more than just sharing text. One great thing you can do is work with blobs directly. In this step we’re going to grab an avatar from gravatar.

**Open**

		xhr.open(‘GET’, ‘http://0.gravatar.com/avatar/592fd4bb2692c7d9fbe8f5ef3af52309?size=420', true);
	
**Response Type**

We need to set our `responseType` to blob as we just want the image returned.

		xhr.responseType = ‘blob’;

**Events**

Our response is a picture blob. What we want to do is create a new IMG element and url for our new blob every time we get a response. To do this we use the createObjectURL passing our blob which will return and URL of which we can set the `src` of our IMG to.

		function onloaded(e){
			if (this.status == 200) {
				var blob = this.response;
			
				var img = document.createElement(‘img’);
					img.onload = function(e) {
					window.URL.revokeObjectURL(img.src);
				};
			
				img.src = window.URL.createObjectURL(blob);
				$(‘#results’).append(img);
			}; 
		};

### Step #4

Up until now each of our steps has been consuming information from a server. In this step we’re going to post form data to an api. 

**Form Data**

FormData is a new object introduced with HTML5.

		var formData = new FormData();
		        
		formData.append( “Name”, “Clark Sell” );
		formData.append( “Url”, “http://csell.net” );
		formData.append( “Description”, “Clark Sell’s Blog” );

**Open**

As seen in all the previous steps with the only different being we would like to `POST`.

		xhr.open(‘POST’, ‘http://lightsout.co/links/create', true);

**Events** 

After we setup the events we care about our `onload` is really just going to just check for a `200` and pop a modal box.

		function onloaded(e){
			
			if (this.status == 200) {
				alert(‘posted!!!’);
			}
		};

**Send**

Unlike the previous steps we want to `send` our form. we do that by 

		xhr.send(formData);

- - -
## Resources

* [tbd](http://tbd.com)











## Step 1: Deploy to companion app

After creating the project you're taken into the AppBuilder environment. AppBuilder offers a lot of functionality—everything from a coding IDE to