# 2015 TelerikNEXT NativeScript {N} Workshop - Lab #2
Contributors: [Clark Sell](http://csell.net) & [TJ Vantoll](http://tjvantoll.com/) & Sebastian Witalec. You can find us on Twitter at: [@csell5](https://twitter.com/csell5), [@tjvantoll](https://twitter.com/tjvantoll), [@sebawita](https://twitter.com/sebawita)

Tags: TelerikNEXT, NativeScript, {N}, JavaScript, CSS3, iOS, Android

## What are we learning?

In this lab we’re going to build upon the splash screen we built  in the first lab. Our overall goal here is to navigate to our home page, get and load some images, navigate to our next page. In doing so we will explore the following topics:

* Page navigation
* Page layout and structure
* Handling page events
* UI Controls
* Control Events
* Basic Modules
 
## Getting Setup
Create a new application in AppBuilder. [How to create a new application](http://backUpOne.com/backup)

{N} lab projects in Github:
* [Starting Project](http://tbd.com)
* [Finished Project](http://tbd.com)

## The Lab

### Step #1 - Creating the home.xml shell

In an effort to keep our app always running, before we can navigate away from the splash screen we will need something to navigate to. To get started, let’s create the basic shell of home that we will later redirect our splash screen too.

**Creating Home**

1. In our components folder (/app/components) lets create a new folder called *home* that will contain all of our home’s components.
2. Every view can have three components. The layout (xml), the style (css), and the views code (js). When those files all have the same root name, in our case home, the {N} runtime will properly load them.
3. Let’s create those three file that we will need to display our home page:

* /app/components/home/**home.xml**
* /app/components/home/**home.js**
* /app/components/home/**home.css**

With those three files in place, let’s update our *home.xml* to include the worlds simplest {N} page markup. 

	<Page>
		<Label text=“hi from home”/>
	</Page>

### Step #2 - Navigating to home.xml



### Step #3 - Navigate to Home.xml
### Step #4 - Laying out Home.xml
### Step #5 - Adding Controls to Home.xml
### Step #6 - Handle Page Events
### Step #7 - XXX

## Resource List:

* [Page Navigation](http://docs.nativescript.org/navigation#navigation)
* [Page Layout](http://docs.nativescript.org/layouts)


## Step 1: Deploy to companion app

After creating the project you're taken into the AppBuilder environment. AppBuilder offers a lot of functionality—everything from a coding IDE to