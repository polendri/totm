---
layout: post
title:  "Quintus, a JavaScript Game Engine: Part 2"
date:   2014-12-08 00:00:00
authors: "Paul Hendry"
---

<script src='http://cdn.html5quintus.com/v0.2.0/quintus-all.min.js'></script>

Part 1: [Quintus, a JavaScript Game Engine: Introduction]({{ site.baseurl }}/quintus-introduction)

In this post, we'll build a simple platformer and learn about scenes, sprites,
animation, and tiles. Here's the end product (click it and use the arrow keys to play):

<canvas id='quintusContainer2' width='400' height='300' style='margin: auto;'></canvas>
<script>
window.addEventListener('load',function() {
  var Q = Quintus({                  // Create a new engine instance
    imagePath: "{{ site.baseurl }}/assets/content/quintus/part2/game2/images/",
    dataPath:  "{{ site.baseurl }}/assets/content/quintus/part2/game2/data/",
  })
  .include("Sprites, Scenes, Input, Anim, 2D, Touch, UI, TMX") // Load all kiiinds of modules
  .setup("quintusContainer2")
  .controls()                        // Add in default controls (keyboard, buttons)
  .touch();                          // Add in touch support (for the UI)

  Q.Sprite.extend("Player",{
    init: function(p) {
      this._super(p, {
        sprite: "mario",
        sheet: "mario",
        jumpSpeed: -400,
        speed: 300,
        inMidair: false
      });
      this.add('2d, animation, platformerControls');
    },
    step: function(dt) {
      if(this.p.jumping) {
        this.inMidair = true;
      }
      if(this.p.landed > 0) {
        this.inMidair = false;
      }

      if(this.inMidair) {
        this.play('jump');
      }
      else if (this.p.vx != 0) {
        this.play('run');
      }
      else {
          this.play('stand');
      }

      if(Q.inputs['left'] && this.p.direction == 'right') {
        this.p.flip = 'x';
      } 
      else if(Q.inputs['right']  && this.p.direction == 'left') {
        this.p.flip = false;                    
      }
    }                    
  });

  Q.scene("level1", function(stage) {          
    Q.stageTMX("map.tmx", stage);
    var player = stage.insert(new Q.Player({ x: 3*16 + 8, y: 24*16 + 8}));
    stage.add("viewport").follow(player, {x: true, y: true}, {minX: 0, maxX: 256*16, minY: 0, maxY: 32*16});
  });

  Q.loadTMX("map.tmx, sprites.png, sprites.json", function() {
    Q.compileSheets("sprites.png","sprites.json");
    Q.animations('mario', {
      stand: { frames: [1] },
      run: { frames: [2,3,4,3], rate: 1/4 },
      jump: { frames: [6] }
    });

    Q.stageScene("level1");
  });

  // Scroll back to the top to undo the canvas stealing focus
  // and moving the viewport down the page
  document.body.scrollTop = document.documentElement.scrollTop = 0;
});
</script>

## Quintus Basics

I highly recommend reading through the [Core Quintus Basics](http://www.html5quintus.com/guide/core.md)
documentation page, to get a feel for how to use Quintus at a high level.
It goes over modules, classes, events, components, asset loading, and a whole
bunch of other stuff.

## Using Tiled Map Editor to build a level

If we're going to make a platformer, we'll need to create a level for the
player to explore. Quintus supports manually providing a tilesheet and a chunk
of JSON that defines each tile in the level, but unless you're procedurally
generating a map, you really want to be using something more user-friendly.

Fortunately Quintus also supports the TMX format, which can be created by tools
like [Tiled Map Editor](http://www.mapeditor.org/). Install that (in Ubuntu:
`sudo apt-get install tiled`) and you can get started building a map.

Once you've got Tiled open, hit File > New... to start a new map. Make it as
big or small as you'd like; I went with 256 x 32 tiles at 16px x 16px each. **NOTE:**
Quintus currently only supports the uncompressed XML TMX format, so make sure
you select a layer format of "XML" when creating a new map in Tiled. From
there, you need a tileset (one large image which contains a bunch of tiles in a grid).

If you like, you can find or create your own. If you're lazy, you might enjoy
using this Super Mario Bros. tileset:

![A Super Mario Bros. tileset]({{ site.baseurl }}/assets/content/quintus/mario_tileset.png)

**NOTE:** For whatever reason, Quintus cannot use the top-left tile in a
tilesheet, so if you're making a tilesheet yourself, don't put anything there!
I had to modify that mario sheet above because the top-left tile used to be the
"ground" block.

With a tileset loaded, you can paint your map using the stamp, fill, eraser,
and rectangle select tools available on the top toolbar; just select the tile
on the tilesheet that you'd like to stamp/fill/etc. With the stamp tool you can
also select a rectangular multiselection of tiles and lay them all down at
once, which is super useful for multi-tile things like clouds and pipes in the
tilesheet above.

![Creating a Super Mario Bros. level using Tiled]({{ site.baseurl }}/assets/content/quintus/tiled_editor.png)

Once you're satisfied with the look of your map, there's one thing left:
specifying the collision data for your map. There are two ways of doing this:

 - **Using a separate collision layer:** Create a new tile layer, give it a
`collision = true` property (by right-clicking the layer and selecting
`Properties...`), and paint tiles over anything that the player should not be
able to pass through (it doesn't matter which tile you paint with). The
advantage of this is that it's flexible, since your collision info doesn't have
to be tied to your visuals.
 - **Using properties on the tiles:** Alternatively, you can set the `collision=true`
property on your existing tile layer, and then specify individual tiles that
the player can pass through. This is done by setting the `sensor=true` property
on individual tiles (again by right-clicking and opening the properties). The
advantage of this is that, once you've gone through and annotated all your
tiles appropriately, you can draw your map without ever thinking about
collisions.

In my example, I've opted for the latter solution.

## A Note About Serving Your Game

In the first post, I suggested you could run your game locally by opening up
the HTML file in your browser. It turns out that doesn't work so well in
general, because web browsers' cross-site scripting protection tends to block
the loading of additional content.

If you're running your game locally, you'll need some kind of webserver to
host your game. If you've got Python installed, this can be as simple as
running `python -m SimpleHTTPServer` in the root directory of your project
(pretty neat actually!). Otherwise, you might consider [Mongoose](http://cesanta.com/mongoose.shtml)
or [Apache](http://httpd.apache.org/).

## Putting Mario on the Map

Let's load that TMX file into Quintus and add a player-controlled character.
We'll want to start off pretty much the exact same way as before by creating an
instance of the Quintus object; this time though, we're using the TMX module
so we've got to indicate that.

{% highlight javascript %}
window.addEventListener('load',function() {
  var Q = Quintus({                  // Create a new engine instance
    development: true,               // Forces assets to not be cached, turn
                                     // this off for production
  })
  .include("Sprites, Scenes, Input, Anim, 2D, Touch, UI, TMX") // Load all kiiinds of modules
  .setup("quintusContainer")
  .controls()                        // Add in default controls (keyboard, buttons)
  .touch();                          // Add in touch support (for the UI)
{% endhighlight %}

Next, we'll create a player sprite.

{% highlight javascript %}
  Q.Sprite.extend("Player",{
    init: function(p) {
      this._super(p, { asset: "mario.png", jumpSpeed: -400, speed: 300 });
      this.add('2d, platformerControls');
    },
    step: function(dt) {
      if(Q.inputs['left'] && this.p.direction == 'right') {
        this.p.flip = 'x';
      } 
      else if(Q.inputs['right']  && this.p.direction == 'left') {
        this.p.flip = false;                    
      }
    }                    
  });
{% endhighlight %}

Here we're loading our `mario.png` asset
(which has to be in an `images` directory at the root of your project unless
you change the `imagePath` property to something else when starting Quintus).
We're also opting in to a whole bunch of magic: Quintus has built-in support
for collision detection (in the `2d` module) and for full platformer controls.
The controls probably won't behave in exactly the way you like, but you'll be able to
change that later.

We're also getting fancy and flipping the sprite around to face the direction
it's moving in. This is done in the `step` function, which gets called each
frame.

Next, we create a scene for the game. Scenes are a good way to split a game
up into distinct sections; for we just have the one though.

{% highlight javascript %}
  Q.scene("level1", function(stage) {          
    Q.stageTMX("map.tmx", stage);
    var player = stage.insert(new Q.Player({ x: 13*16 + 8, y: 24*16 + 8}));
    stage.add("viewport").follow(player);
  });
{% endhighlight %}

We're creating a scene called `level`, filling it with the information from the
TMX file (which is expected to be in a `data` directory similarly to how images
are handled), we're adding a new player sprite at specific coordinates, and
we're adding a viewport that follows a player. That's an awful lot of stuff
happening in just a few lines of code!

Lastly, we need to actually load the assets we've been referencing. We provide
a callback for what to do when the loading is done, which is simply to stage
the scene we defined previously.

{% highlight javascript %}
  Q.loadTMX("map.tmx, mario.png", function() {
    Q.stageScene("level1");
  });
{% endhighlight %}

The end result looks like this (click it and use the arrow keys to play):

<canvas id='quintusContainer1' width='400' height='300' style='margin: auto;'></canvas>
<script>
window.addEventListener('load',function() {
  var Q = Quintus({                  // Create a new engine instance
    imagePath: "{{ site.baseurl }}/assets/content/quintus/part2/game1/images/",
    dataPath:  "{{ site.baseurl }}/assets/content/quintus/part2/game1/data/",
  })
  .include("Sprites, Scenes, Input, Anim, 2D, Touch, UI, TMX") // Load all kiiinds of modules
  .setup("quintusContainer1")
  .controls()                        // Add in default controls (keyboard, buttons)
  .touch();                          // Add in touch support (for the UI)

  Q.Sprite.extend("Player",{
    init: function(p) {
      this._super(p, { asset: "mario.png", jumpSpeed: -400, speed: 300 });
      this.add('2d, platformerControls');
    },
    step: function(dt) {
      if(Q.inputs['left'] && this.p.direction == 'right') {
        this.p.flip = 'x';
      } 
      else if(Q.inputs['right']  && this.p.direction == 'left') {
        this.p.flip = false;                    
      }
    }                    
  });

  Q.scene("level1", function(stage) {          
    Q.stageTMX("map.tmx", stage);
    var player = stage.insert(new Q.Player({ x: 13*16 + 8, y: 24*16 + 8}));
    stage.add("viewport").follow(player);
  });

  Q.loadTMX("map.tmx, mario.png", function() {
    Q.stageScene("level1");
  });

  // Scroll back to the top to undo the canvas stealing focus
  // and moving the viewport down the page
  document.body.scrollTop = document.documentElement.scrollTop = 0;
});
</script>

As you may have noticed compared to the "finished" game at the beignning of the
post, there are some glaring problems with this game so far, so let's address
them one by one.

## Keeping Mario on the Map

If you run to the left edge of the map, nothing stops you from going right off
the edge of it and falling forever. We could fix this in code, perhaps by
setting Mario's velocity to zero if he's outside the bounds of the level, but
there's an easier solution: adding more collision information to the map.

Just because we've made our primary tile layer have collision detection on it
doesn't mean we can't have another one. In Tiled, we can just create another
tile layer, give it a `collision=true` property, and paint additional tiles
where we want collision detection. When finished, just re-order the layers such
that this new collision layer is behind the primary one, and you've created
evil invisible video game walls!

## Keeping the Viewport Centred

The viewport always stays centered over the player, which looks crappy when the
player approaches the edges of the level. What we'd like is for the viewport
to stay within the bounds of the level while also following the player the best
that it can. Fortunately this is also an easy fix: we can provide mininum and
maximum values for the viewport position when we create it, like so:

{% highlight javascript %}
stage.add("viewport").follow(player,{x: true, y: true},{minX: 0, maxX: 256*16, minY: 0, maxY: 32*16});
{% endhighlight %}

## Animating Mario

If you haven't already, I recommend reading through the Quintus guides on
[sprites](http://www.html5quintus.com/guide/sprites.md) and on
[animation](http://www.html5quintus.com/guide/animation.md) to get up to
speed.

In order to animate sprites, we need a sprite sheet that contains all the
images that will compose the animations. I made this one for animating Mario:

![A sprite sheet for Mario]({{ site.baseurl }}/assets/content/quintus/part2/game2/images/sprites.png)

I used [TexturePacker](https://www.codeandweb.com/texturepacker) to put this
together, based on a larger sprite sheet I found on the Internet. If you're
making your own, the important things to keep in mind are:

 - You can have differently-sized frames in the same sheet, but animations
   require that all frames are the same size. So, for example, you could
   have one sheet containing images for both small Mario (each 17x16 pixels)
   and large Mario (each 31x17 pixels), but you'll have to use each of them
   separately.
 - I didn't confirm it because it was so easy to work around, but I think
   Quintus sprite sheets have the same issue as tilesets where the first one
   cannot be used. That's why the sheet above has its first entry blank.
 - TexturePacker doesn't support the format that Quintus expects, so if you're
   using it to create a sprite sheet, you'll still need to write some JSON
   manually (see below) so that Quintus knows how to use it.

With your sprite sheet saved as `sprites.png` in your game's `images` directory,
you'll need a matching `sprites.json` in your `data` directory. Something like
this:

{% highlight json %}
{
  "mario": {
      "tilew": 17,
      "tileh": 16,
      "sx": 0,
      "sy": 0,
      "w": 238,
      "h": 16
  }
}
{% endhighlight %}

This defines a sheet named "mario", the width and height of the tiles in that
sheet, the x and y offset in the sprite sheet image at which the sheet begins
(these default to 0 anyway), and the width and height of the the sprite sheet
image itself. If we had more frames for Luigi or Super Mario, we could add
more entries to the hash with appropriately updated `tilew`, `tileh`, `sx` and
`sy` values.

We now have all the assets we need; time to load them properly. We've got to
change our call to `loadTMX` to look like this:

{% highlight javascript %}
  Q.loadTMX("map.tmx, sprites.png, sprites.json", function() {
    Q.compileSheets("sprites.png","sprites.json");
    Q.animations('mario', {
      stand: { frames: [1] },
      run: { frames: [2,3,4,3], rate: 1/4 },
      jump: { frames: [6] }
    });

    Q.stageScene("level1");
  });
{% endhighlight %}

We actually defined all our animations here while we were at it! Take a look
at the official animations guide for more details, but that's pretty much all
there is to it. We defined a "mario" animation set, along with a bunch of
named animations. Each animation is just a sequence of frames,
along with some optional extra info (such as `rate` to define the time in
seconds for each frame, or the self-explanatory `loop` option).

Finally, we need to change our `Player` definition to make use of these
animation resources:

{% highlight javascript %}
  Q.Sprite.extend("Player",{
    init: function(p) {
      this._super(p, {
        sprite: "mario",  // Instead of using 'asset' for static images, we're
        sheet: "mario",   // using 'sprite' to specify the animation set and
                          // 'sheet' to specify the sprite sheet used
        jumpSpeed: -400,
        speed: 300,
        inMidair: false
      });
      this.add('2d, animation, platformerControls');
    },
    step: function(dt) {
      // 'jumping' is only true when the user is actively pressing the jump
      // button, but we're interested in the whole arc of the jump, so we
      // manually update this 'inMidair' variable.
      if(this.p.jumping) {
        this.inMidair = true;
      }
      if(this.p.landed > 0) {
        this.inMidair = false;
      }

      // Play the jumping animation if Mario is in mid-air
      if(this.inMidair) {
        this.play('jump');
      }
      // Play the running animation if we're on the ground and moving
      else if (this.p.vx != 0) {
        this.play('run');
      }
      else {
        this.play('stand');
      }

      if(Q.inputs['left'] && this.p.direction == 'right') {
        this.p.flip = 'x';
      } 
      else if(Q.inputs['right']  && this.p.direction == 'left') {
        this.p.flip = false;                    
      }
    }                    
  });
{% endhighlight %}

That's it! You can revisit the game at the top of the post to see the improvements
in action.


## Wrapping Up

We've still got a little ways to go before we can call this a proper game:
there's no goal yet, and no enemies to get in the way of that goal. That's for
next week!

If you're looking for some inspiration for more features you can add, have a
look at [the most full-featured example on the Quintus site](http://www.html5quintus.com/quintus/examples/platformer_full/).
It's pretty fancy, and you can use your browser's debugger to look under the
hood and see how it works.

Finally, [here]({{ site.baseurl }}/assets/content/quintus/part2/game2/game2.js)
is the full source for the game. Keep in mind that it has a few modifications
so that it can run properly on this site.
