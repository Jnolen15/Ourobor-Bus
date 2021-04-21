class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload(){ 
        // Add sprites
        this.load.image('bus', './assets/BUSsprite.png');
        this.load.image('street', './assets/street_background.png');
    }
    
    create() {
        // Street Background
        this.street = this.add.tileSprite(0,0,480,640, 'street').setOrigin(0,0);
        
        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();

        // Add Bus
        this.bus = new Bus(this, 220, 560, 'bus').setOrigin(0,0);

        // Add Spawner
        this.spawner = new Spawner(this);

        // Adding side hitboxes
        this.leftHitbox = this.physics.add.sprite(this.bus.x + 40,this.bus.y, 'bus').setOrigin(0,0);
        this.rightHitbox = this.physics.add.sprite(this.bus.x - 40,this.bus.y, 'bus').setOrigin(0,0);
        this.leftHitbox.alpha = 0;
        this.rightHitbox.alpha = 0;

        // obstacel test
        this.obstacel = new Obstacle(this, 220, 0, 'bus').setOrigin(0,0);
    }

    update(){
        // Move street
        this.street.tilePositionY -= 10;
        
        // Move hitboxes with bus
        this.leftHitbox.x = this.bus.x + 40;
        this.rightHitbox.x = this.bus.x - 40;
        
        //console.log("In update");
        this.bus.update();
        this.spawner.update();
    }

}