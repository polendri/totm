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
});

