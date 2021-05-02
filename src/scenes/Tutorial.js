class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");
    }

    create() {
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Comic Sans MS	',
            fontSize: '28px',
            backgroundColor: '#ffffff',
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

        // image slideshow setup
        this.frame = this.add.image(0,0,'tutor1').setOrigin(0,0);
        this.currSlide = 0;
        this.slides = [
            'tutor1',
            'tutor2',
            'tutor3'
        ];

        // show menu text
        this.add.text(game.config.width * .05, game.config.height * .92, "Prev [←]", menuConfig).setOrigin(0,0);
        this.nextPrompt = this.add.text(game.config.width * .95, game.config.height * .92, "Next [→]", menuConfig).setOrigin(1,0);

        // define keys
        this.keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    update() {
        if (this.currSlide == 0) {                                  // on the first slide
            if (Phaser.Input.Keyboard.JustDown(this.keyLEFT)) {
                this.scene.start('menuScene');    
            }
            else if(Phaser.Input.Keyboard.JustDown(this.keyRIGHT)) {
                this.cycleSlides("up");
            }
        } else if (this.currSlide == this.slides.length - 1) {      // on the last slide
            if (Phaser.Input.Keyboard.JustDown(this.keyLEFT)) {
                this.cycleSlides("down");
            }
            else if(Phaser.Input.Keyboard.JustDown(this.keyRIGHT)) {
                this.scene.start('playScene');
            }
        } else {                                                    // on a middle slide
            if (Phaser.Input.Keyboard.JustDown(this.keyLEFT)) {
                this.cycleSlides("down");
            }
            else if(Phaser.Input.Keyboard.JustDown(this.keyRIGHT)) {
                this.cycleSlides("up");
            }
        }
    }

    cycleSlides(direction) {
        if (direction == "up" || direction == undefined) {
            if ( !(this.currSlide >= this.slides.length) ) {
                this.currSlide++;
                this.frame.setTexture(this.slides[this.currSlide]);
                // edit text to show the next button starts the game
                if (this.currSlide == this.slides.length - 1) {
                    this.nextPrompt.setText("Play [→]");
                    this.nextPrompt.setBackgroundColor('#43b046');
                }
            } else {
                console.log("ERROR — slideshow array out of bounds");
            }
        } else if (direction == "down") {
            if ( !(this.currSlide == 0) ) {
                this.currSlide--;
                this.frame.setTexture(this.slides[this.currSlide]);
                // edit text to show the next button is another slide
                if (this.currSlide == this.slides.length - 2) {
                    this.nextPrompt.setText("Next [→]");
                    this.nextPrompt.setBackgroundColor('#ffffff');
                }
            } else {
                console.log("ERROR — slideshow array out of bounds");
            }
        } else {
            console.log("ERROR — illegal image slideshow direction");
        }
    }
}