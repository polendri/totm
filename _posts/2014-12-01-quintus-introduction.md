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
isn't the only one that would work (have a look at http://html5gameengine.com/
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

Let's start with the shell of a Quintus game, the details of which we'll expand
on shortly:

`game_template.html`:

{% highlight html %}
<!DOCTYPE HTML>
<html>
  <head>
    <!-- (use quintus-all.min.js for production) -->
    <script src='http://cdn.html5quintus.com/v0.2.0/quintus-all.js'></script>
    <script src='game_template.js'></script>
  </head>
  <body>
    <canvas id='quintusContainer' width='800' height='600'></canvas>
  </body>
</html>
{% endhighlight %}

`game_template.js`:

{% highlight javascript %}
window.addEventListener('load',function() {
  var Q = Quintus({                          // Create a new engine instance
    development: true                // Forces assets to not be cached, turn
                                         // this off for production
  })
  .include("Sprites, Scenes, Input, 2D, Touch, UI") // Load any needed modules
  .setup("quintusContainer")// {        // Use an existing canvas element
    //width: 800,                      // Set the width of the game window
    //height: 600                      // Set the height of the game window
    //maximize: true                 // Alternatively you could make the game take
                                     // up as much space as possible
  //})
  .controls()                        // Add in default controls (keyboard, buttons)
  .touch();                          // Add in touch support (for the UI)

  /*
  Your game's code goes here, what follows is just some placeholder stuff
  */

  Q.MovingSprite.extend("Ball",{
    draw: function(ctx) {
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(-this.p.cx,
              -this.p.cy,
              this.p.w/2,0,Math.PI*2); 
      ctx.fill();

    }
  });

  var ball = window.ball = new Q.Ball({ w:  20,  h:   20, 
                                        x:  30,  y:  300, 
                                       vx:  30, vy: -100, 
                                       ax:   0, ay:   30 });

  Q.gameLoop(function(dt) {
      Q.clear();
      ball.update(dt);
      ball.render(Q.ctx);
  });

  /*
  End of the placeholder code
  */
});
{% endhighlight %}
