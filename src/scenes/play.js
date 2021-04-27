class Play extends Phaser.Scene {
    constructor() {
        super('playScene');

        this.didEndGame = false;
        this.lastScore = 0;
    }

    preload(){ 
        // Add sprites
        this.load.image('blood', './assets/blood.png');
        this.load.image('money', './assets/money.png');
        this.load.image('bus', './assets/BUSsprite.png');
        this.load.image('street', './assets/street_background.png');
        this.load.image('testObstacle', './assets/testObstacle.png');
        this.load.image('testObstacle1', './assets/testObstacle1.png');
        // Add Auido
        this.load.audio('music', ['./assets/ourobor-Bus Hell.mp3']);
    }
    
    create() {
        // set up audio, play bgm
        this.bgm = this.sound.add('music', { 
            mute: false,
            volume: 0.5,
            rate: 1,
            loop: true 
        });
        this.bgm.play();
        
        // Street Background
        this.street = this.add.tileSprite(0,0,480,640, 'street').setOrigin(0,0);
        
        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();

        // Add Bus
        this.bus = new Bus(this, 220, 560, 'bus').setOrigin(0,0);

        // object array (pedestrians and obstacles)
        this.objects = [];

        // Adding side hitboxes
        this.leftHitbox = this.physics.add.sprite(this.bus.x - 40,this.bus.y, 'bus').setOrigin(0,0);
        this.rightHitbox = this.physics.add.sprite(this.bus.x + 40,this.bus.y, 'bus').setOrigin(0,0);
        this.leftHitbox.alpha = 0;
        this.rightHitbox.alpha = 0;

        // Add Spawner
        this.spawner = new Spawner(this, this.bus, this.leftHitbox, this.rightHitbox);

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 150
        }
        this.scoreLeft = this.add.text(10, 10, score + "$", scoreConfig);
        this.scoreRight = this.add.text(320, 10, distance + "ft.", scoreConfig);

        // Add extra keys
        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // Particles
        let bloodparticleConfig = {
            x: 400,
            y: 300,
            blendmode: 'ADD',
            speed: {min: 20, max: 100},
            scale: {start: 1, end: 0},
            rotate: {start: 360, end: 0},
            gravityY: 300,
            on: false,
        }

        this.bloodParticles = this.add.particles('blood');
        this.bloodemitter = this.bloodParticles.createEmitter(bloodparticleConfig);

        // Particles
        let moneyparticleConfig = {
            x: 400,
            y: 300,
            blendmode: 'ADD',
            speed: {min: 20, max: 100},
            scale: {start: 1, end: 0},
            rotate: {start: 360, end: 0},
            gravityY: 300,
            on: false,
        }

        this.moneyParticles = this.add.particles('money');
        this.moneyemitter = this.moneyParticles.createEmitter(moneyparticleConfig);

    }

    update(){
        // End game check
        if(gameOver){
            this.gameisover();
        }

        // Move street
        if(!gameOver)
            this.street.tilePositionY -= 6;
        
        // Move hitboxes with bus
        this.leftHitbox.x = this.bus.x + 40;
        this.rightHitbox.x = this.bus.x - 40;
        
        // Update Bus
        if(!gameOver)
            this.bus.update();
        
        // update objects (pedestrians and obstacles)
        if (this.objects.length >= 1) {
            this.objects.forEach(
                (item, index)=>{
                    if (item.active == true) {
                        // update the item if it still exists 
                        item.update();
                    }
                    else {
                        // remove the item if it is no longer active
                        this.objects.splice(index, 1);
                    }
                });
        }

        // Update score
        if(!gameOver){
            this.scoreLeft.text = score + "$";
            this.scoreRight.text = distance + "ft.";
            distance++;
        }

        // Shake screen if bus hits something
        if(!this.bus.body.touching.none){
            if(gameOver){
                this.cameras.main.shake(500, 0.05);
            }
            else{
                this.bloodParticles.emitParticleAt(this.bus.x + 20, this.bus.y, 50);
                this.cameras.main.shake(100, 0.01);
                this.lastScore = score;
            }
        }

        // Money particles if score increase
        if(score > this.lastScore){
            this.moneyParticles.emitParticleAt(this.bus.x + 50, this.bus.y, 5);
            this.moneyParticles.emitParticleAt(this.bus.x - 10, this.bus.y, 5);
            this.lastScore = score;
        }

         // check key input for restart
         if (gameOver && Phaser.Input.Keyboard.JustDown(this.keyR)){
            score = 0;
            distance = 0;
            gameOver = false;
            this.lastScore = 0;
            this.didEndGame = false;
            this.scene.restart();
        }
    }

    gameisover(){
        if(!this.didEndGame){
            this.didEndGame = true;

            // Display End
            let endConfig = {
                fontFamily: 'Courier',
                fontSize: '28px',
                backgroundColor: '#F3B141',
                color: '#843605',
                align: 'right',
                padding: {
                    top: 5,
                    bottom: 5,
                },
            }
            
            this.add.text(game.config.width / 2, game.config.height / 2, 'YOU CRASHED!', endConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'CASH MADE: ' + score + "$", endConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 128, 'DISTANCE TRAVELED: ' + distance + " FEET", endConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 192, 'R TO RESTART', endConfig).setOrigin(0.5);
        }
    }
}