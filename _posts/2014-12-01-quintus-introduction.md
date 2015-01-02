---
layout: post
title:  "Quintus, a JavaScript Game Engine: Introduction"
date:   2014-12-01 00:00:00
authors: "Paul Hendry"
---

![Quintus, a JavaScript HTML5 game engine]({{ site.baseurl }}/assets/content/quintus/quintus_logo.png)

## What is Quintus?

[Quintus](http://www.html5quintus.com/) is a JavaScript HTML5 game engine. What
sets it apart from the ridiculous amount of other JavaScript game engine
offerings?

 - It's free to use and open-source;
 - It's actively developed;
 - It's lightweight (a simple JS library, no dev environment to install);
 - There's plenty of documentation and examples;
 - There is actual evidence of it being used to produce full games.

I had a hell of a time trying to settle on a engine to pick for this month; it's
surprisingly hard to find something that meets those criteria! I'm sure Quintus
isn't the only one that would work (have a look at [http://html5gameengine.com/](http://html5gameengine.com/)
if you're looking to compare some of the other offerings), but I've been quite
enjoying it.

## Why learn Quintus?

JavaScript isn't my favourite language for writing games, but it's by far the
most accessible. It's awesome to be able to write some code, push it to a GitHub
Pages site, and instantly have a hosted game that can be demoed to others. If
you're looking to learn some programming, Quintus is an ideal engine for sinking
your teeth into; you get the instant gratification from how quickly you can get
things going, but it's not holding your hand through the process. And if you
already know your stuff, it's still a lot of fun to see how easy it is to get a
simple game going.

## Background

The only thing you need going in is a decent understanding of JavaScript. If you
haven't done any significant JavaScript programming before, you might consider
something like the [codecademy JavaScript
track](http://www.codecademy.com/en/tracks/javascript) to get you started. If
all you need is a refresher, then [Mozilla has a nice "Re-introduction" to
JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript).

## Getting started

Let's start with the shell of a Quintus game: a JavaScript file that
initializes Quintus, and an HTML file that contains the `<canvas>` element
that Quintus will use.

`game.html`:

{% highlight html %}
<!DOCTYPE HTML>
<html>
  <head>
    <!-- (use quintus-all.min.js for production) -->
    <script src='http://cdn.html5quintus.com/v0.2.0/quintus-all.js'></script>
    <!-- (remember to change this if you rename game.js) -->
    <script src='game.js'></script>
  </head>
  <body>
    <canvas id='quintusContainer' width='800' height='600' style='margin: auto;'></canvas>
  </body>
</html>
{% endhighlight %}

`game.js`:

{% highlight javascript %}
window.addEventListener('load',function() {
  var Q = Quintus({                      // Create a new engine instance
    development: true                    // Forces assets to not be cached, turn
                                         // this off for production
  })
  .include("Sprites, Scenes, Input, 2D, Touch, UI") // Load any needed modules
  .setup("quintusContainer")             // Use an existing canvas element
  .controls()                            // Add in default controls (keyboard, buttons)
  .touch();                              // Add in touch support (for the UI)

  /*
  Your game's code goes here
  */
});
{% endhighlight %}

The quickest way to get started is to just save both files locally and open the
HTML file in your browser (I would advise using Firefox or Chrome since they
have the debugging facilities that will be very handy).

If you want to host the game online, [GitHub Pages](https://pages.github.com/)
makes it super easy (that's what this site is hosted on). Setting that up is
beyond the scope of this post, but it's quite easy to do. If you go that route,
you'll want to stick your game files in your GitHub repo and then visit it in
your browser (e.g. `http://yourusername.github.io/yourgame/game.html`).

If you open up that page, you'll find that it's blank, because there's no code
in there that draws something to the screen. Let's drop in some sample code
(modified from an example in the Quintus documentation) to see something
in action. You'll need to do two things:

 1. Copy this sprite, [enemy.png]({{ site.baseurl }}/assets/content/quintus/enemy.png),
    to a new `images` directory in the root of your project;
 2. Replace the "Your game's code goes here" comment with the JavaScript below:

{% highlight javascript %}
  // Create a simple scene that adds two shapes on the page
  Q.scene("start",function(stage) {

    // A basic sprite shape a asset as the image
    var sprite1 = new Q.Sprite({ x: 400, y: 100, asset: 'enemy.png', 
                                 angle: 0, collisionMask: 1, scale: 1});
    sprite1.p.points = [
      [ -150, -120 ],
      [  150, -120 ],
      [  150,   60 ],
      [   90,  120 ],
      [  -90,  120 ],
      [ -150,   60 ]
      ];
    stage.insert(sprite1);
    // Add the 2D component for collision detection and gravity.
    sprite1.add('2d')

    sprite1.on('step',function() {
    });

    // A red platform for the other sprite to land on
    var sprite2 = new Q.Sprite({ x: 400, y: 600, w: 300, h: 200 });
    sprite2.draw= function(ctx) {
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(-this.p.cx,-this.p.cy,this.p.w,this.p.h);
    };
    stage.insert(sprite2);

    // Bind the basic inputs to different behaviors of sprite1
    Q.input.on('up',stage,function(e) { 
      sprite1.p.scale -= 0.1;
    });

    Q.input.on('down',stage,function(e) { 
      sprite1.p.scale += 0.1;
    });

    Q.input.on('left',stage,function(e) {
      sprite1.p.angle -= 5;
    });

    Q.input.on('right',stage,function(e) {
      sprite1.p.angle += 5;
    });

    Q.input.on('fire',stage,function(e) {
      sprite1.p.vy = -600;
    });

    Q.input.on('action',stage,function(e) {
      sprite1.p.x = 400;
      sprite1.p.y = 100;
    });
  });

  Q.load('enemy.png',function() {

    // Start the show
    Q.stageScene("start");

    // Turn visual debugging on to see the 
    // bounding boxes and collision shapes
    Q.debug = true;

    // Turn on default keyboard controls
    Q.input.keyboardControls();
  });
{% endhighlight %}

Refresh `game.html` in your browser and you should see something like this:

![The Quintus sprite demo in action]({{ site.baseurl }}/assets/content/quintus/sprite_demo.png)

If you hadn't guessed it based on the code, the demo is
interactive: the up and down arrow keys scale the sprite smaller/bigger, the
left and right arrow keys rotate it, and the space key makes it hop up into the
air. There's a lot more about that code that still needs explaining, but I'm
going to leave that until next week.

## Next week

 - Some Quintus "theory": scenes, sprites, classes, events, components, and
   more;
 - Making a basic platformer game.

## Further reading

If you're eager to learn more about how you can write games with Quintus, here
are a bunch of pages worth visiting:

 - [The official guide](http://www.html5quintus.com/guide/intro.md), which is a
   good reference for the core functionality of the engine (how to build
   scenes, handle input, draw sprites, etc);
 - [The main documentation page](http://www.html5quintus.com/documentation),
   which has a big list of examples and another big list of links to various
   tutorials.

Part 2: [Quintus, a JavaScript Game Engine: Part 2]({{ site.baseurl }}/quintus-part-2)

Part 3: [Quintus, a JavaScript Game Engine: Part 3]({{ site.baseurl }}/quintus-part-3)
