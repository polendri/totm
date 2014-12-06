---
layout: post
title:  "Quintus, a JavaScript Game Engine: Part 2"
date:   2014-12-08 00:00:00
authors: "Paul Hendry"
---

<script src='http://cdn.html5quintus.com/v0.2.0/quintus-all.js'></script>

Part 1: [Quintus, a JavaScript Game Engine: Introduction]({{ site.baseurl }}/quintus-introduction)

In this post, we'll build a simple platformer and learn about scenes, sprites,
animation, and tiles.

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
you select a layer format of "XML" when creating a new map in tiled. From
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

The end result looks like this:

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
});
</script>

