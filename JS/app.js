var gameProperties = {
  screenWidth: 900,
  screenHeight: 600
};

var states = {
  game: 'game',
  menu: 'menu'
};

var assets = {
  bee1: { URL: '../Sprites/Bee1.png', name: 'bee1' },
  bee2: { URL: '../Sprites/Bee22.png', name: 'bee2' },

  stinger1: { URL: '../Sprites/Stinger1.png', name: 'Stinger1' },
  stinger2: { URL: '../Sprites/Stinger2.png', name: 'Stinger2' },

  heart1: { URL: '../Sprites/blueheart.png', name: 'heart1' },
  heart2: { URL: '../Sprites/redheart.png', name: 'heart2' },

  stingBlank: { name: 'stingBlank' }
};

var beeProperties = {
  startX: gameProperties.screenWidth * 0.20,
  startY: gameProperties.screenHeight * 0.5,
  acceleration: 500,
  drag: 25,
  maxVelocity: 500,
  angularVelocity: 150
};

var gameState = function(game) {
  this.beeSprite1;
  this.beeSpite2;
  this.stingerSprite1;
  this.stingerSprite2;
  this.heartSprite1;
  this.heartSprite2;

  this.keyLeft1;
  this.keyRight1;
  this.keyForward1;
  this.keyLeft2;
  this.keyRight2;
  this.keyForward2;
};

gameState.prototype = {

  preload: function() {
    game.load.image(assets.bee1.name, assets.bee1.URL);
    game.load.image(assets.bee2.name, assets.bee2.URL);
    game.load.image(assets.stinger1.name, assets.stinger1.URL);
    game.load.image(assets.stinger2.name, assets.stinger2.URL);
    game.load.image(assets.heart1.name, assets.heart1.URL);
    game.load.image(assets.heart2.name, assets.heart2.URL);
    this.game.load.physics('stinger_physics', 'Sprites/Stinger2.json');
  },

  create: function() {
    // setup physics and world bounds, pause movement
    game.world.setBounds(0, 0, 900, 600);
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.scale.refresh();
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.restitution = 0.8;
    game.physics.p2.pause();

    // add audio
    this.flight = this.game.add.audio('flight');
    this.beep = this.game.add.audio('beep');
    this.win = this.game.add.audio('win');

    // create health indicators
    this.heartSprite1 = game.add.sprite(10, 45, assets.heart1.name);
    this.heartSprite12 = game.add.sprite(10, 10, assets.heart1.name);
    this.heartSprite2 = game.add.sprite(848, 10, assets.heart2.name);
    this.heartSprite22 = game.add.sprite(848, 45, assets.heart2.name);

    // create bee 1
    this.beeSprite1 = game.add.sprite(beeProperties.startX, beeProperties.startY, assets.bee1.name);
    this.beeSprite1.anchor.set(0.5, 0.5);

    // create bee 2
    this.beeSprite2 = game.add.sprite(gameProperties.screenWidth * 0.80, gameProperties.screenHeight * 0.5, assets.bee2.name);
    this.beeSprite2.anchor.set(0.5, 0.5);

    // create stingers
    this.stinger1 = game.add.sprite(0, 0, assets.stinger1.name);
    this.stinger2 = game.add.sprite(0, 0, assets.stinger2.name);

    // turn on physics for sprites
    this.game.physics.p2.enable(this.beeSprite1);
    this.beeSprite1.body.angle = 0;
    this.game.physics.p2.enable(this.beeSprite2);
    this.beeSprite2.body.angle = 180;
    this.game.physics.p2.enable(this.stinger1);
    this.game.physics.p2.enable(this.stinger2);

    // load stinger hitboxes
    this.stinger1.body.clearShapes();
    this.stinger1.body.loadPolygon('stinger_physics', 'Stinger1');
    this.stinger2.body.clearShapes();
    this.stinger2.body.loadPolygon('stinger_physics', 'Stinger2');

    // add stinger positioning children to bees
    this.stingPositioner1 = game.add.sprite(0, 70);
    this.stingPositioner1.anchor.set(0.5, 0.5);
    this.stingPositioner1.pivot.set(0, 0);
    this.beeSprite1.addChild(this.stingPositioner1);

    this.stingPositioner2 = game.add.sprite(0, 70);
    this.stingPositioner2.anchor.set(0.5, 0.5);
    this.stingPositioner2.pivot.set(0, 0);
    this.beeSprite2.addChild(this.stingPositioner2);

    // create opening text placement locations
    // bee1 name
    this.name1 = game.add.text(beeProperties.startX + 120, beeProperties.startY - 20, '', {
      font: '20px silkscreennormal',
      fill: '#000000',
      align: 'center'
    });
    this.name1.anchor.setTo(0.5, 0.5);

    // the
    this.the1 = game.add.text(beeProperties.startX + 120, beeProperties.startY, '', {
      font: '20px silkscreennormal',
      fill: '#000000',
      align: 'center'
    });
    this.the1.anchor.setTo(0.5, 0.5);

    // bee1 adjective
    this.adj1 = game.add.text(beeProperties.startX + 120, beeProperties.startY + 20, '', {
      font: '20px silkscreennormal',
      fill: '#000000',
      align: 'center'
    });
    this.adj1.anchor.setTo(0.5, 0.5);

    // vs
    this.versus = game.add.text(gameProperties.screenWidth / 2, gameProperties.screenHeight * 0.5, '', {
      font: '35px silkscreennormal',
      fill: '#000000',
      align: 'center'
    });
    this.versus.anchor.setTo(0.5, 0.5);

    // bee2 name
    this.name2 = game.add.text(gameProperties.screenWidth * 0.80 - 120, gameProperties.screenHeight * 0.5 - 20, '', {
      font: '20px silkscreennormal',
      fill: '#000000',
      align: 'center'
    });
    this.name2.anchor.setTo(0.5, 0.5);

    // the
    this.the2 = game.add.text(gameProperties.screenWidth * 0.80 - 120, gameProperties.screenHeight * 0.5, '', {
      font: '20px silkscreennormal',
      fill: '#000000',
      align: 'center'
    });
    this.the2.anchor.setTo(0.5, 0.5);

    // bee2 adjective
    this.adj2 = game.add.text(gameProperties.screenWidth * 0.80 - 120, gameProperties.screenHeight * 0.5 + 20, '', {
      font: '20px silkscreennormal',
      fill: '#000000',
      align: 'center'
    });
    this.adj2.anchor.setTo(0.5, 0.5);

    // fight
    this.fight = game.add.text(gameProperties.screenWidth / 2, gameProperties.screenHeight / 3, '', {
      font: '60px silkscreennormal',
      fill: '#000000',
      align: 'center'
    });
    this.fight.anchor.setTo(0.5, 0.5);

    // create walls
    var hBlockShape = this.game.add.bitmapData(this.game.world.width, 10);
    var vBlockShape = this.game.add.bitmapData(10, this.game.world.height);

    // fill block shapes
    hBlockShape.ctx.rect(0, 0, this.game.world.width, 10);
    hBlockShape.ctx.fillStyle = '000';
    hBlockShape.ctx.fill();

    vBlockShape.ctx.rect(0, 0, 10, this.game.world.height);
    vBlockShape.ctx.fillStyle = '000';
    vBlockShape.ctx.fill();

    // create top wall
    this.blockT = this.game.add.sprite(this.game.world.width / 2, 5, hBlockShape);
    this.game.physics.p2.enable(this.blockT);
    this.blockT.body.static = true;
    this.blockT.anchor.setTo(0.5, 0.5);

    // create bottom wall
    this.blockB = this.game.add.sprite(this.game.world.width / 2, this.game.world.height - 5, hBlockShape);
    this.game.physics.p2.enable(this.blockB);
    this.blockB.body.static = true;
    this.blockB.anchor.setTo(0.5, 0.5);

    // create left wall
    this.blockL = this.game.add.sprite(5, this.game.world.height / 2, vBlockShape);
    this.game.physics.p2.enable(this.blockL);
    this.blockL.body.static = true;
    this.blockL.anchor.setTo(0.5, 0.5);

    // create right wall
    this.blockR = this.game.add.sprite(this.game.world.width - 5, this.game.world.height / 2, vBlockShape);
    this.game.physics.p2.enable(this.blockR);
    this.blockR.body.static = true;
    this.blockR.anchor.setTo(0.5, 0.5);

    // set collision groups
    // create collision groups
    this.bee1BodyGroup = this.game.physics.p2.createCollisionGroup();
    this.bee2BodyGroup = this.game.physics.p2.createCollisionGroup();
    this.bee1StingerGroup = this.game.physics.p2.createCollisionGroup();
    this.bee2StingerGroup = this.game.physics.p2.createCollisionGroup();
    this.terrainGroup = this.game.physics.p2.createCollisionGroup();

    // assign block collsion groups
    this.blockT.body.setCollisionGroup(this.terrainGroup);
    this.blockB.body.setCollisionGroup(this.terrainGroup);
    this.blockL.body.setCollisionGroup(this.terrainGroup);
    this.blockR.body.setCollisionGroup(this.terrainGroup);

    // assign bee collision groups
    this.beeSprite1.body.setCollisionGroup(this.bee1BodyGroup);
    this.stinger1.body.setCollisionGroup(this.bee1StingerGroup);
    this.beeSprite2.body.setCollisionGroup(this.bee2BodyGroup);
    this.stinger2.body.setCollisionGroup(this.bee2StingerGroup);

    // assign physiscs collisions
    this.blockT.body.collides([this.bee1BodyGroup, this.bee2BodyGroup]);
    this.blockB.body.collides([this.bee1BodyGroup, this.bee2BodyGroup]);
    this.blockL.body.collides([this.bee1BodyGroup, this.bee2BodyGroup]);
    this.blockR.body.collides([this.bee1BodyGroup, this.bee2BodyGroup]);
    this.beeSprite1.body.collides([this.bee2BodyGroup, this.bee2StingerGroup, this.terrainGroup]);
    this.beeSprite2.body.collides([this.bee1BodyGroup, this.bee1StingerGroup, this.terrainGroup]);

    // assign stinger collisions
    this.stinger1.body.collides([this.bee2StingerGroup, this.bee2BodyGroup]);
    this.stinger2.body.collides([this.bee1StingerGroup, this.bee1BodyGroup]);

    // stinger to stinger
    this.stinger1.body.createBodyCallback(this.stinger2, this.stingerRepulse, this);
    this.stinger2.body.createBodyCallback(this.stinger1, this.stingerRepulse, this);

    // stinger to body
    this.stinger1.body.createBodyCallback(this.beeSprite2.body, this.bee2Stung, this);
    this.stinger2.body.createBodyCallback(this.beeSprite1.body, this.bee1Stung, this);

    this.initKeyboard();
    this.setUp();
    game.stage.backgroundColor = '#ffff00';
  },

  update: function() {
    this.checkPlayerInput();

    // keep stingers attached to bee bodies
    this.stinger1.body.reset(this.stingPositioner1.world.x, this.stingPositioner1.world.y);
    this.stinger1.body.rotation = this.beeSprite1.rotation;

    this.stinger2.body.reset(this.stingPositioner2.world.x, this.stingPositioner2.world.y);
    this.stinger2.body.rotation = this.beeSprite2.rotation;
  },

  render: function() {
    // intro sequence
    if (timer.running) {
      // bee1 name
      if (timer.ms > 1000 && timer.ms < 1500) {
        this.name1.setText(bee1Name);
      }

      // the
      if (timer.ms > 1500 && timer.ms < 2000) {
        this.the1.setText('the');
      }

      // bee1 adjective
      if (timer.ms > 2000 && timer.ms < 2500) {
        this.adj1.setText(bee1Adj);
      }

      // vs
      if (timer.ms > 2500 && timer.ms < 3000) {
        this.versus.setText('vs');
      }

      // bee2 name
      if (timer.ms > 3000 && timer.ms < 3500) {
        this.name2.setText(bee2Name);
      }

      // the
      if (timer.ms > 3500 && timer.ms < 4000) {
        this.the2.setText('the');
      }

      // bee2 adjective
      if (timer.ms > 4000 && timer.ms < 4500) {
        this.adj2.setText(bee2Adj);
      }

      // start message and music
      if (timer.ms > 5000 && timer.ms < 5100) {
        this.fight.setText('BUZZ!');
        this.flight.loopFull();
      }
    }
  },

  initKeyboard: function() {
    this.keyLeft1 = game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.keyRight1 = game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.keyForward1 = game.input.keyboard.addKey(Phaser.Keyboard.W);

    this.keyLeft2 = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.keyRight2 = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.keyForward2 = game.input.keyboard.addKey(Phaser.Keyboard.UP);
  },

  // stinger contact collision control
  stingerRepulse: function() {
    this.stingDelay();
    var exchange = 0;
    var bee1X = this.beeSprite1.body.velocity.x + Math.sign(this.beeSprite1.body.velocity.x) * 100;
    var bee1Y = this.beeSprite1.body.velocity.y + Math.sign(this.beeSprite1.body.velocity.y) * 100;
    var bee2X = this.beeSprite2.body.velocity.x + Math.sign(this.beeSprite2.body.velocity.x) * 100;
    var bee2Y = this.beeSprite2.body.velocity.y + Math.sign(this.beeSprite2.body.velocity.y) * 100;

    // checks to see if sprites are moving in the same direction
    if (Math.sign(bee1X) === Math.sign(bee2X) && Math.sign(bee1Y) === Math.sign(bee2Y)) {

      // bee1 is faster than bee2
      if (Math.abs(bee1X) > Math.abs(bee2X) && Math.abs(bee1Y) > Math.abs(bee2Y)) {
        bee1X = -bee1X;
        bee1Y = -bee2Y;
        bee2X = this.beeSprite2.body.velocity.x + Math.sign(this.beeSprite2.body.velocity.x) * 50;
        bee2Y = this.beeSprite2.body.velocity.y + Math.sign(this.beeSprite2.body.velocity.y) * 50;
      }

      // bee2 is faster than bee1
      else if (Math.abs(bee1X) < Math.abs(bee2X) && Math.abs(bee1Y) < Math.abs(bee2Y)) {
        bee1X = this.beeSprite1.body.velocity.x + Math.sign(this.beeSprite1.body.velocity.x) * 50;
        bee1Y = this.beeSprite1.body.velocity.y + Math.sign(this.beeSprite1.body.velocity.y) * 50;
        bee2X = -bee2X;
        bee2Y = -bee2Y;
      }
      else {
        if (Math.round(Math.random())) {
          bee1X = -bee1X;
          bee1Y = -bee2Y;
          bee2X = this.beeSprite2.body.velocity.x + Math.sign(this.beeSprite2.body.velocity.x) * 50;
          bee2Y = this.beeSprite2.body.velocity.y + Math.sign(this.beeSprite2.body.velocity.y) * 50;
        }
        else {
          bee1X = this.beeSprite1.body.velocity.x + Math.sign(this.beeSprite1.body.velocity.x) * 50;
          bee1Y = this.beeSprite1.body.velocity.y + Math.sign(this.beeSprite1.body.velocity.y) * 50;
          bee2X = -bee2X;
          bee2Y = -bee2Y;
        }
      }
      this.beeSprite1.body.velocity.x = bee1X;
      this.beeSprite1.body.velocity.y = bee1Y;
      this.beeSprite2.body.velocity.x = bee2X;
      this.beeSprite2.body.velocity.y = bee2Y;
    }

    // if they have opposite headings, reverses them
    else {
      if (Math.sign(bee1X) !== Math.sign(bee2X)) {
        exchange = bee1X;
        bee1X = bee2X;
        bee2X = exchange;
      }
      if (Math.sign(bee1Y) !== Math.sign(bee2Y)) {
        exchange = bee1Y;
        bee1Y = bee2Y;
        bee2Y = exchange;
      }
      this.beeSprite1.body.velocity.x = bee1X;
      this.beeSprite1.body.velocity.y = bee1Y;
      this.beeSprite2.body.velocity.x = bee2X;
      this.beeSprite2.body.velocity.y = bee2Y;
    }
  },

  // starts timer for intro text control
  setUp: function() {
    timer = game.time.create();
    timerEvent = timer.add(Phaser.Timer.SECOND * 6, this.endTimer, this);
    timer.start();
  },

  // ends timer, removes text, allows movement
  endTimer: function() {
    timer.stop();
    game.physics.p2.resume();
    this.name1.setText('');
    this.the1.setText('');
    this.adj1.setText('');
    this.versus.setText('');
    this.name2.setText('');
    this.the2.setText('');
    this.adj2.setText('');
    this.fight.setText('');
    bee1Health = 2;
    bee2Health = 2;
    stung = false;
  },

  // controls bee1's stung reactions
  bee1Stung: function() {
    if (stung === false) {
      bee1Health -= 1;
      if (bee1Health > 0) {
        this.stingerRepulse();
        this.heartSprite1.kill();
        this.beep.play();
      }
      else {
        this.heartSprite12.kill();
        game.physics.p2.pause();
        this.fight.setText('red bee is best bee');
        this.win.play();
        this.flight.fadeOut(4500);
        game.time.events.add(Phaser.Timer.SECOND * 5, this.gameReset, this);
      }
    }
  },

  // controls bee2's stung reactions
  bee2Stung: function() {
    if (stung === false) {
      bee2Health -= 1;
      if (bee2Health > 0) {
        this.stingerRepulse();
        this.heartSprite22.kill();
        this.beep.play();
      }
      else {
        this.heartSprite2.kill();
        game.physics.p2.pause();
        this.fight.setText('blue bee is best bee');
        this.win.play();
        this.flight.fadeOut(4500);
        game.time.events.add(Phaser.Timer.SECOND * 5, this.gameReset, this);
      }
    }
  },

  // puts a 1 second delay between stings
  stingDelay: function() {
    stung = true;
    game.time.events.add(Phaser.Timer.SECOND * 1, this.stingReset, this);
  },

  // reallows stinging
  stingReset: function() {
    stung = false;
  },

  // reverts game to menu
  gameReset: function() {
    this.flight.stop();
    game.state.start(states.menu);
  },

  // handles controls
  checkPlayerInput: function() {
    if (this.keyLeft1.isDown) {
      this.beeSprite1.body.rotateLeft(beeProperties.angularVelocity);
    }
    else if (this.keyRight1.isDown) {
      this.beeSprite1.body.rotateRight(beeProperties.angularVelocity);
    }
    else {
      this.beeSprite1.body.setZeroRotation();
    }

    if (this.keyForward1.isDown) {
      this.beeSprite1.body.thrust(beeProperties.acceleration);
    }

    if (this.keyLeft2.isDown) {
      this.beeSprite2.body.rotateLeft(beeProperties.angularVelocity);
    }
    else if (this.keyRight2.isDown) {
      this.beeSprite2.body.rotateRight(beeProperties.angularVelocity);
    }
    else {
      this.beeSprite2.body.setZeroRotation();
    }

    if (this.keyForward2.isDown) {
      this.beeSprite2.body.thrust(beeProperties.acceleration);
    }
  }
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
var bee1Health = 2;
var bee2Health = 2;
var stung = false;
var bee1Name = '';
var bee2Name = '';
var bee1Adj = '';
var bee2Adj = '';
game.state.add(states.game, gameState);
game.state.add(states.menu, Menu);
game.state.start(states.menu);
