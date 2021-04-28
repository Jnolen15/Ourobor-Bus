class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload(){ 
        this.load.image('street', './assets/street_background.png');
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
        // this.bg = this.add.tileSprite(0,0,480,640, 'street').setOrigin(0,0);
        this.add.text(game.config.width/8,game.config.height/4, "Title Screen", menuConfig).setOrigin(0,0);
        this.add.text(game.config.width/8,game.config.height * .35, "Press any of the arrow keys", menuConfig).setOrigin(0,0);
        this.add.text(game.config.width/8,game.config.height * .45, "to start!", menuConfig).setOrigin(0,0);
        this.add.text(game.config.width/8,game.config.height * .55, "High Score: " + highScore, menuConfig).setOrigin(0,0);

        // define keys
        this.keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyLEFT) ||
            Phaser.Input.Keyboard.JustDown(this.keyRIGHT) ||
            Phaser.Input.Keyboard.JustDown(this.keyUP) ||
            Phaser.Input.Keyboard.JustDown(this.keyDOWN)) {
            this.scene.start('playScene');    
        }
    }
}