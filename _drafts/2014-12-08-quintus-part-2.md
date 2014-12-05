---
layout: post
title:  "Quintus, a JavaScript Game Engine: Part 2"
date:   2014-12-08 00:00:00
authors: "Paul Hendry"
---

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
