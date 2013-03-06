Marrow.js
========================

because without it, backbone it's as useful as confetti to clean your ass.

What's Marrow?
------------------------

Marrow objective is to provide _a single drop-in dependency_ for backbone,
using the latest MooTools technology, especially the new moofx effects library.

In order to do this, it shim jQuery methods used by backbone, right now it still require underscore, but most of what underscore provide is already backed in the new mootools prime, so eventually it will be substituted with
https://github.com/GCheung55/underprime, so that when built using MooTools wrapup, the size of the download will drastically be reduced.

TL;DR: Marrow = Backbone + moofx

In order to provide the best compatibility Marrow should pass the jQuery core test,
in this first version it pass just few of them, but this is intended, it will eventually improve.

What works right now?

this fiddle work perfectly, without changing anything in the code.

http://jsfiddle.net/tBS4X/1/

TODO:
* Add support for event namespacing, since BB use that, Add HTTP 1.1 emulation for webserver without the WebDav plugin
* Moar tests need to pass, especially the jQ events tests
* remove underscore in favor of underprime when it's ready.

Inspiration:
Marrow take inspiration from https://github.com/inkling/backbone-mootools, 
after removing Request in favor of agent I though it was better to start a new project to reduce the size of the dependencies


