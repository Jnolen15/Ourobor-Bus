class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // Menu images
        this.load.image('menuScreen', './assets/menuscreen.png');
        // tutorial images
        this.load.image('tutor1', './assets/tutorial1.png');
        this.load.image('tutor2', './assets/tutorial2.png');
        this.load.image('tutor3', './assets/tutorial3.png');
        // Add sprites
        this.load.image('UI', './assets/uiBack.png');
        this.load.image('end', './assets/uiEnd.png');
        this.load.image('tiremarks', './assets/tiremarks.png');
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
        // Hell Pedestrians
        this.load.image('hellped1', './assets/hellpedestrian_1.png');
        this.load.image('hellped2', './assets/hellpedestrian_2.png');
        this.load.image('hellped3', './assets/hellpedestrian_3.png');
        this.load.image('hellrped1', './assets/hellrichpedestrian_1.png');
        // Heaven Pedestrians
        this.load.image('heavenped1', './assets/heavenpedestrian_1.png');
        this.load.image('heavenped2', './assets/heavenpedestrian_2.png');
        this.load.image('heavenped3', './assets/heavenpedestrian_3.png');
        this.load.image('heavenrped1', './assets/heavenrichpedestrian_1.png');
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
            backgroundColor: '#b3cfdd',
            color: '#000',
            align: 'right',
            padding: {
            left: 5,
            right: 5,
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }

        // show menu image
        this.add.image(0,0,'menuScreen').setOrigin(0,0);

        // show menu text
        this.add.text(game.config.width * .9, game.config.height * .76, "[↑] Start", menuConfig).setOrigin(1,0);
        this.add.text(game.config.width * .9, game.config.height * .83, "[↓] Tutorial", menuConfig).setOrigin(1,0);
        this.add.text(game.config.width * .9, game.config.height * .90, "High Score: " + highScore, menuConfig).setOrigin(1,0);

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