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
        // Street background
        this.load.image('street', './assets/street_background_5lane.png');
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
        this.load.audio('music', './assets/ourobor-Bus Hell.mp3');
        this.load.audio('oHit', './assets/ObstacleHit.wav');
        this.load.audio('pHit', './assets/passengerHit.wav');
        this.load.audio('pHit2', './assets/passengerHit2.wav');
        this.load.audio('pHit3', './assets/passengerHit3.wav');
        this.load.audio('pPickup', './assets/passengerPickup.wav');
        this.load.audio('pPickup2', './assets/passengerPickup2.wav');
        this.load.audio('pPickup3', './assets/passengerPickup3.wav');
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
        this.street = this.add.tileSprite(0,0,480,840, 'street').setOrigin(0,0);
        
        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();

        // Add Bus
        this.bus = new Bus(this, 220, 760, 'bus').setOrigin(0,0);
        this.bus.setScale(1.5);

        // object array (pedestrians and obstacles)
        this.objects = [];

        // Adding side hitboxes
        this.leftHitbox = this.physics.add.sprite(this.bus.x, this.bus.y-100, 'bus').setOrigin(0,0);
        this.rightHitbox = this.physics.add.sprite(this.bus.x, this.bus.y-100, 'bus').setOrigin(0,0);
        this.leftHitbox.alpha = 0;
        this.rightHitbox.alpha = 0;
        this.leftHitbox.setScale(1.5);
        this.rightHitbox.setScale(1.5);

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
        this.hsRight = this.add.text(320, 40, "HS: " + highScore, scoreConfig);

        // Add extra keys
        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

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
        if(score > highScore) {
            highScore = score;
        }

        // End game check
        if(gameOver){
            this.gameisover();
        }

        // Move street
        if(!gameOver)
            this.street.tilePositionY -= 6;
        
        // Move hitboxes with bus
        this.leftHitbox.x = this.bus.x + 80;
        this.rightHitbox.x = this.bus.x - 80;
        
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
            if(gameOver){ // If it hit an obstacle game over
                // add tween to fade out music
                this.tweens.add({
                    targets: this.bgm,
                    volume: 0,
                    ease: 'Linear',
                    duration: 1000,
                });
                this.sound.play('oHit', { volume: 0.75 });
                this.cameras.main.shake(500, 0.05);
            }
            else{
                // Play random sound
                var rand = Phaser.Math.Between(1,3);
                if(rand == 1)
                    this.sound.play('pHit', { volume: 0.75 });
                else if(rand == 2)
                    this.sound.play('pHit2', { volume: 0.75 });
                else if(rand == 3)
                    this.sound.play('pHit3', { volume: 0.75 });
                this.bloodParticles.emitParticleAt(this.bus.x + 40, this.bus.y, 50);
                this.cameras.main.shake(100, 0.01);
                this.lastScore = score;
            }
        }

        // Money particles if score increase
        if(score > this.lastScore){
            var rand = Phaser.Math.Between(1,3);
                if(rand == 1)
                    this.sound.play('pPickup', { volume: 0.75 });
                else if(rand == 2)
                    this.sound.play('pPickup2', { volume: 0.75 });
                else if(rand == 3)
                    this.sound.play('pPickup3', { volume: 0.75 });
            this.moneyParticles.emitParticleAt(this.bus.x + 90, this.bus.y, 5);
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
        else if (gameOver && Phaser.Input.Keyboard.JustDown(this.keyM)) {
            score = 0;
            distance = 0;
            gameOver = false;
            this.didEndGame = false;
            this.scene.start('menuScene');
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
            this.add.text(game.config.width / 2, game.config.height / 2 + 192, 'R TO RESTART OR M TO MENU', endConfig).setOrigin(0.5);
        }
    }
}