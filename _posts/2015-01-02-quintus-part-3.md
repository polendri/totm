---
layout: post
title:  "Quintus, a JavaScript Game Engine: Part 3"
date:   2015-01-02 00:00:00
authors: "Paul Hendry"
scripts:
 - "http://cdn.html5quintus.com/v0.2.0/quintus-all.min.js"
---


Part 1: [Quintus, a JavaScript Game Engine: Introduction]({{ site.baseurl }}/quintus-introduction)

Part 2: [Quintus, a JavaScript Game Engine: Part 2]({{ site.baseurl }}/quintus-part-2)

Pretend that it's still December and that I didn't get distracted by the
holidays: there's one last Quintus post.

Okay, it's actually kind of a cop-out, because there isn't any tutorial
content. Instead, I've written a little game of my own and I'm
pointing to that source code as a more full-featured example of what can be
done in Quintus. It's called Peasants vs Sires and it looks something like
this:

![Peasants vs Sires, coming to stores near you]({{ site.baseurl }}/assets/content/quintus/part3/peasants-vs-sires.png)

[Here it is, if you'd like to give it a go](http://pshendry.github.io/peasants-vs-sires/).
It's a two-player game though, so it would go better if you can convince someone
nearby to join in.

In terms of Quintus features, it includes:

* Multiple game stages (main menu, gameplay, endgame);
* Global game state;
* Keyboard and on-screen button input;
* Pausing and unpausing the game;
* Creation of new component types for entities;
* Audio (including muting the audio);
* Animations;
* Interactions between entities using events;
* Custom hitboxes for entities;
* Staging multiple scenes simultaneously;

The code is heavily commented to (hopefully!) make it readable to those
unfamiliar with Quintus. As a disclaimer though, I'm no expert on Quintus or
even on Javascript in general, so by no means is it exemplary code.

[The source code can be found on GitHub here](https://github.com/pshendry/peasants-vs-sires/blob/master/src/peasants-vs-sires.js).

That's it for the Quintus tutorials; thanks for reading!
