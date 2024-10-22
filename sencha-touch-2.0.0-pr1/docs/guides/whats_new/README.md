# What's new in Sencha Touch 2.0

This guide is a work in progress and does not contain everything that is currently present in Sencha Touch 2. It will be updated as the 2.0 release matures.

Sencha Touch 2 is currently in Developer Preview. Expect there to be bugs, missing features and incomplete documentation.

## Welcome to Sencha Touch 2

Sencha Touch was the first HTML5 mobile framework and 2.0 is the biggest upgrade it has ever received. We've focussed foremost on performance, getting apps running fast on as many devices as possible. Apps boot much faster, with much snappier initial render and layout, and lay out again immediately when you rotate the device.

There is a brand new scroller, optimized for each platform and faster than ever - especially on Android devices. We've optimized the rendering process and have even applied some innovative techniques to reuse existing components without having to instantiate new ones.

We've brought across many of the innovations from Ext JS 4, including the advanced new class system, reconfigurable components, and improvements to application architecture.

We looked at how we can increase support for a wider range of devices, reducing the emphasis on WebKit and building a more robust platform that we can role more devices onto over time. 

## Smaller, faster layout engine

Sencha Touch offers a very flexible layout system that makes it easy to lay apps out on a variety of device shapes and sizes. Version 2 brings a layout engine that runs much closer to the browser's optimized CSS engine, and the result is enormously improved performance in several key areas:

* Apps render and layout faster on bootup
* Updating the screen after rotating the device is much faster than 1.x
* Layout engine is much smaller, resulting in a faster download

All of the layout configuration options from Sencha Touch 1 continue to work with the new layout engine so you haven't got to change a line of code.

The result is massively improved layout performance across the board. Screens pop onto the page much faster when navigating through the app, giving a much more fluid experience, but the most dramatic improvement is when changing a device’s orientation. The new layout engine is so fast we had to use a high speed camera to measure it. Here’s the Kitchen Sink buttons example running on 1.x and 2.x, slowed down to one quarter speed:

<a style="text-align: center" href="http://vimeo.com/30296006"><img src="http://img1.sencha.com/files/misc/20111010-video-full.jpg" /></a>

## Stronger, smarter core

Sencha Touch is young but benefits from a shared development environment with Ext JS. Ext JS 4 brought a range of new innovations that we're very happy to be building into Sencha Touch, including:

* Upgraded class system with support for dynamic loading and dependencies
* Support for class configurations as a core construct - gives you getters and setters for free and a clean, consistent API

### Faster startup time

We weren’t happy with app startup time in 1.x so we’re optimizing everything we can with startup. So far we’re seeing between 10% to 25% improvement in startup time on a range of devices, when testing our Kitchen Sink example. This app is sizable—it demonstrates almost every component in the framework and on many devices loads almost a second faster in 2.x:

<img src="http://img1.sencha.com/files/misc/20111010-sencha-touch-startup-times.png" />

## Class System and Apps

Sencha Touch 2 uses the powerful new class system from Ext JS 4. This gives us all of the benefits of dynamic loading, intelligent builds that only include the classes you use, mixins, configurations and all the other features of the new engine. We have a full guide to the new class system on the documentation site.

We’ve also brought across Ext JS 4’s improved application architecture, that includes ComponentQuery and production build support. We’re not quite done with MVC in this preview release and will be adding features like deep linking/history support in upcoming previews and betas.

### Config-driven components

One of the benefits of the new class system is the ability to set up 'configs' - simple properties that are automatically given getter and setter functions, defaults and more.

Sencha Touch 2 makes use of the config system throughout the framework so whenever you see a config on a class you already know that you can reconfigure it at any time (even after it is rendered). Even better, because the config's setter name always follows the same pattern you already know what function to call.

For example, we can give a {@link Ext.form.Text Text Field} a label when we instantiate it and then know we can easily change it later:

	var text = Ext.create('Ext.form.Text', {
		label: 'My Field'
	});
	
	//anything we can configure also has a setter function
	//its name always follows the setConfigName pattern
	text.setLabel('Another Field');

Configs are great because they give classes a very clean API. Everything you see under the 'Config options' in the API docs for each class is a true config complete with standardized getter and setter functions.

## Much better Android support

Sencha Touch 2 brings a big improvement in Android performance, particularly when it comes to scrolling and animation. In Sencha Touch 1.x Android devices were noticeably slower when scrolling through large lists, and that animations could be choppy and exhibit weird visual artifacts.

Touch 2 gives Android its own optimized mechanism for achieving both smooth scrolling and fast, fluid animations. We’ll go further into the technology behind these advances at SenchaCon later this month, but for now here’s the Motorola Atrix again, showing just how much faster 2.x feels on Android devices:

<a style="text-align: center" href="http://vimeo.com/30324079"><img src="http://img1.sencha.com/files/misc/20111010-video-sm.jpg" /></a>

## Native Packaging

One of the most common questions developers ask when building Sencha Touch apps is “how do I get my app in front of customers?” In many scenarios, building and deploying apps to the web is exactly what developers want and customers expect. In other cases, getting apps in to app stores is the fastest way to reach customers.

In Sencha Touch 2, we’ve made it incredibly easy to build and deploy your apps to both the Android Marketplace and the iOS App Store. Today, along with Sencha Touch 2 preview, we’re shipping a developer preview of our SDK Tools 2.0. The new SDK Tools include a new sencha package command that enables you to take your Sencha Touch app and package it up as an APP for iOS or an APK for Android. It’s that easy. One command, and your app is ready to be submitted to Apple or Google for distribution.

To make a developer’s life easier, on iOS the packager doesn’t require the native SDK so you can package without having to download Apple’s SDK. Just download the SDK Tools and you’re ready to build. If you’re deploying to Android, you’ll need to download the Android SDK from Google. For developers who do have the the native SDKs, you can use the SDK Tools to directly push your app to the iOS and Android emulators so you can see how your app will run on device.

Today we’re making the SDK Tools Developer Preview available on Mac OS X and we’ll be adding Windows and Linux soon. We’ll also be adding device APIs that will make it easy to use native features like camera and contacts among others. If you’re interested in getting started, embedded in the documentation is a new guide that has all the details on how to use the new packaging capabilities. We think you’ll be as excited as we are with how easy it is now to build and package your web app for native distribution.

## Overhauled docs

All of the most widely used classes in Sencha Touch 2 feature excellent documentation right in the API reference. Interspersed into the class docs are dozens of live examples that run right in your browser and let you see (and even modify) the example code on the fly. We’ve also brought all of the SASS variables for each Component into the API docs, making it much easier to see what you can customize.

We’re shipping 11 brand new guides out of the box. We have guides that explain core concepts like Layouts, Components and Classes, and others that cover how to use components like tab panels, forms and carousels. For Sencha Touch veterans there’s a What’s New in 2 guide, and the new Getting Started guide takes you through building your first app from scratch.