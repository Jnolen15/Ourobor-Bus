class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // --- Loading Screen Setup
        // loading-backgroundbox
        var progBoxWidth = game.config.width * .68;
        var progBoxHeight = 30;
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(game.config.width*.5 - progBoxWidth*.5, game.config.height*.5 - progBoxHeight*.5, progBoxWidth, progBoxHeight);
        // progress bar setup
        var busProgBar = this.add.image(game.config.width / 2,game.config.height / 2,'loadingBar');
        // loading-text setup
        var loadingText = this.make.text({
            x: game.config.width*.5,
            y: game.config.height*.5 - progBoxHeight - 5,
            text: 'Loading...',
            style: {
                font: '25px Courier',
                fill: '#b3cfdd'
            }
        }).setOrigin(.5);
        loadingText.setOrigin(0.5, 0.5);
        // loading-event listeners
        this.load.on('progress', function (value) {
            busProgBar.frame.cutWidth = busProgBar.frame.width * value;
        });            
        this.load.on('complete', function () {
            //console.log('complete');
            progressBox.destroy();
            loadingText.destroy();
        });

        // --- Loading data
        // Menu images
        this.load.image('menuScreen', './assets/menuscreen.png');
        // tutorial images
        this.load.image('tutor1', './assets/Tutorial1.png');
        this.load.image('tutor2', './assets/Tutorial2.png');
        this.load.image('tutor3', './assets/Tutorial3.png');
        // Add sprites
        this.load.image('UI', './assets/uiBack.png');
        this.load.image('end', './assets/uiEnd.png');
        this.load.image('tiremarks', './assets/tireMarks.png');
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
        this.load.image('busstop', './assets/obstacle_busstop.png');
        // Hell Obstacles
        this.load.image('spike', './assets/obstacle_hellspike.png');
        this.load.image('fire1', './assets/obstacle_fire_frame1.png');
        this.load.image('fire2', './assets/obstacle_fire_frame2.png');
        this.load.image('fire3', './assets/obstacle_fire_frame3.png');
        this.load.image('fire4', './assets/obstacle_fire_frame4.png');
        // Heaven Obstacles
        this.load.image('statue', './assets/obstacle_angelstatue.png');
        this.load.image('fountain', './assets/obstacle_fountain.png');
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
        this.add.image(0, 0,'menuScreen').setOrigin(0,0);

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