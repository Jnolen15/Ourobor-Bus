class Play extends Phaser.Scene {
    constructor() {
        super('playScene');

        this.gameover = false;
    }

    preload(){ 
        // Add sprites
        this.load.image('bus', './assets/BUSsprite.png');
        this.load.image('street', './assets/street_background.png');
        this.load.image('testObstacle', './assets/testObstacle.png');
        this.load.image('testObstacle1', './assets/testObstacle1.png');
    }
    
    create() {
        // Street Background
        this.street = this.add.tileSprite(0,0,480,640, 'street').setOrigin(0,0);
        
        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();

        // Add Bus
        this.bus = new Bus(this, 220, 560, 'bus').setOrigin(0,0);

        // Adding side hitboxes
        this.leftHitbox = this.physics.add.sprite(this.bus.x - 40,this.bus.y, 'bus').setOrigin(0,0);
        this.rightHitbox = this.physics.add.sprite(this.bus.x + 40,this.bus.y, 'bus').setOrigin(0,0);
        this.leftHitbox.alpha = 0;
        this.rightHitbox.alpha = 0;

        // Add Spawner
        this.spawner = new Spawner(this, this.bus, this.leftHitbox, this.rightHitbox);
    }

    update(){
        //console.log(this.spawner.obstacle1);
        //console.log("collider: " + this.bus.body.touching.none);

        // Move street
        this.street.tilePositionY -= 6;
        
        // Move hitboxes with bus
        this.leftHitbox.x = this.bus.x + 40;
        this.rightHitbox.x = this.bus.x - 40;
        
        //console.log("In update");
        this.bus.update();
    }
}