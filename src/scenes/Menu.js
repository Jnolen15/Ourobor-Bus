class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // Add sprites
        this.load.image('blood', './assets/blood.png');
        this.load.image('money', './assets/money.png');
        this.load.image('bus', './assets/BUSsprite.png');
        // Street background
        this.load.image('street', './assets/street_background_5lane.png');
        this.load.image('hellStreet', './assets/street_background_hell.png');
        this.load.image('heavenStreet', './assets/street_background_heaven.png');
        // Transitions
        this.load.image('hellTransition', './assets/transition_Hell.png');
        this.load.image('heavenTransition', './assets/transition_Heaven.png');
        // Earth Obstacles
        this.load.image('car1', './assets/carsprite_1.png');
        this.load.image('car2', './assets/carsprite_2.png');
        this.load.image('car3', './assets/carsprite_3.png');
        this.load.image('tree', './assets/obstacle_tree.png');
        // Earth Pedestrians
        this.load.image('ped1', './assets/pedestrian_1.png');
        this.load.image('ped2', './assets/pedestrian_2.png');
        this.load.image('ped3', './assets/pedestrian_3.png');
        this.load.image('rped1', './assets/richpedestrian_1.png');
        // Extra
        this.load.image('testObstacle', './assets/testObstacle.png');
        // Add Auido
        this.load.audio('music', './assets/Ourobor-Bus_Earth.wav');
        this.load.audio('hellMusic', './assets/Ourobor-Bus_Hell.wav');
        this.load.audio('heavenMusic', './assets/Ourobor-Bus_Heaven.wav');
        this.load.audio('oHit', './assets/ObstacleHit.wav');
        this.load.audio('pHit', './assets/passengerHit.wav');
        this.load.audio('pHit2', './assets/passengerHit2.wav');
        this.load.audio('pHit3', './assets/passengerHit3.wav');
        this.load.audio('pPickup', './assets/passengerPickup.wav');
        this.load.audio('pPickup2', './assets/passengerPickup2.wav');
        this.load.audio('pPickup3', './assets/passengerPickup3.wav');
    }

    create() {
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Comic Sans MS	',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#000',
            align: 'left',
            padding: {
            left: 5,
            right: 5,
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }

        // show menu text
        this.add.text(game.config.width/8,game.config.height/4, "Title Screen", menuConfig).setOrigin(0,0);
        this.add.text(game.config.width/8,game.config.height * .35, "[↑] Start", menuConfig).setOrigin(0,0);
        this.add.text(game.config.width/8,game.config.height * .45, "[↓] Tutorial", menuConfig).setOrigin(0,0);
        this.add.text(game.config.width/8,game.config.height * .55, "High Score: " + highScore, menuConfig).setOrigin(0,0);

        // define keys
        this.keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyUP)) {
            this.scene.start('playScene');    
        }
        else if(Phaser.Input.Keyboard.JustDown(this.keyDOWN)) {
            this.scene.start('tutorialScene');
        }
    }
}