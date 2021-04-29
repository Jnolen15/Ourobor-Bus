class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");
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
        this.add.text(game.config.width/8,game.config.height/4, "Tutorial Screen", menuConfig).setOrigin(0,0);
        this.add.text(game.config.width/8,game.config.height * .35, "Press any of the arrow keys to move bus", menuConfig).setOrigin(0,0);
        this.add.text(game.config.width - 170,game.config.height - 70, "Start [→]", menuConfig).setOrigin(0,0);
        this.add.text(25,25, "[←]", menuConfig).setOrigin(0,0);

        // define keys
        this.keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyLEFT)) {
            this.scene.start('menuScene');    
        }
        else if(Phaser.Input.Keyboard.JustDown(this.keyRIGHT)) {
            this.scene.start('playScene');
        }
    }
}