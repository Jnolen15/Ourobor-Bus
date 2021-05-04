class Play extends Phaser.Scene {
    constructor() {
        super('playScene');

        this.didEndGame = false;
        this.lastScore = 0;
        this.earthBound = 5;
        this.hellBound = -10;
        this.heavenBound = 10;
        this.prevLocation = 'Earth';
    }

    create() {
        // set up audio, play bgm
        this.bgm = this.sound.add('music', { 
            mute: false,
            volume: 0.5,
            rate: 1,
            loop: true 
        });
        this.hellbgm = this.sound.add('hellMusic', { 
            mute: false,
            volume: 0.0,
            rate: 1,
            loop: true 
        });
        this.heavenbgm = this.sound.add('heavenMusic', { 
            mute: false,
            volume: 0.0,
            rate: 1,
            loop: true 
        });
        this.bgm.play();
        this.hellbgm.play();
        this.heavenbgm.play();
        
        // UI Back
        this.uiBack = this.add.image(0, 0, 'UI').setOrigin(0,0);
        this.uiBack.depth = 150;

        // Street Background
        this.street = this.add.tileSprite(0,0,480,840, 'street').setOrigin(0,0);
        this.hellStreet = this.add.tileSprite(0,0,480,840, 'hellStreet').setOrigin(0,0);
        this.heavenStreet = this.add.tileSprite(0,0,480,840, 'heavenStreet').setOrigin(0,0);
        this.hellStreet.alpha = 0;
        this.heavenStreet.alpha = 0;

        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();

        // Add Bus
        this.bus = new Bus(this, 220, 760, 'bus').setOrigin(0,0);
        this.bus.setScale(1.5);

        // bus animation config
        this.anims.create({
            key: 'busDoorAnim',
            frameRate: 10,
            frames: this.anims.generateFrameNames('busAnim', {
                prefix: 'bus_spritesheet',
                suffix: ".png",
                start: 1,
                end: 3
            })
        });
        this.theBusAnim = this.add.sprite(this.bus.x, this.bus.y, "busAnim", "bus_spritesheet3.png");
        this.theBusAnim.alpha = 0;
        this.theBusAnim.depth = 200;
        this.theBusAnim.setScale(1.5);

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
            color: '#F3B141',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            //fixedWidth: 150
        }
        this.scoreLeft = this.add.text(340, 40, score + "$", scoreConfig);
        this.scoreRight = this.add.text(340, 10, distance + "ft.", scoreConfig);
        this.hsRight = this.add.text(10, 40, "HS $: " + highScore + "$", scoreConfig);
        this.hsRightdist = this.add.text(10, 10, "HS ft.: " + distHighScore + "ft.", scoreConfig);
        this.scoreLeft.depth = 200;
        this.scoreRight.depth = 200;
        this.hsRight.depth = 200;
        this.hsRightdist.depth = 200;

        // Difficulty Setup
        this.timeElapsed = 0;
        this.minDiffTime = 15 * 1000; // 60 seconds (60,000 milliseconds)
        this.maxDiffTime = 210 * 1000; // 3 minutes 30 seconds (210,000 milliseconds)
        this.currDiff = 0;
        this.maxObstIncrease = 400;
        this.maxScrollIncrease = this.maxObstIncrease * (3/200); // This ratio makes the tile scroll look accurate

        // Add extra keys
        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

        // Blood Particles
        let bloodparticleConfig = {
            x: 400,
            y: 300,
            blendmode: 'ADD',
            speed: {min: 20, max: 100},
            scale: {start: 1, end: 0},
            rotate: {start: 360, end: 0},
            gravityY: 800,
            on: false,
        }
        this.bloodParticles = this.add.particles('blood');
        this.bloodParticles.depth = 200;
        this.bloodemitter = this.bloodParticles.createEmitter(bloodparticleConfig);

        // Money Particles
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
        this.moneyParticles.depth = 200;
        this.moneyemitter = this.moneyParticles.createEmitter(moneyparticleConfig);

        // Tire Particles
        let tireparticleConfig = {
            x: 400,
            y: 300,
            blendmode: 'ADD',
            rotate: 0,
            speed: 0,
            scale: 0.5,
            lifespan: 10000,
            accelerationY: 550,
            maxVelocityY: 550,
            //gravityY: 400,
            on: false,
        }
        this.tireParticles = this.add.particles('tiremarks');
        this.tireemitter = this.tireParticles.createEmitter(tireparticleConfig);
    }

    update(time, delta){
        // update time elapsed and difficulty scale 
        this.timeElapsed += delta; // in miliseconds
        this.currDiff = this.inverseLerp(this.timeElapsed, this.minDiffTime, this.maxDiffTime);
        //if (Phaser.Input.Keyboard.JustDown(this.keyR))
        //    console.log(this.currDiff);
        
        if(Math.abs(score) > Math.abs(highScore)) {
            highScore = score;
        }
        if(distance > distHighScore) {
            distHighScore = distance;
        }

        // End game check
        if(gameOver){
            this.gameisover();
        }

        // Move street
        if(!gameOver){
            this.street.tilePositionY -= scrollSpeed + (this.currDiff * this.maxScrollIncrease);
            this.hellStreet.tilePositionY -= scrollSpeed + (this.currDiff * this.maxScrollIncrease);
            this.heavenStreet.tilePositionY -= scrollSpeed + (this.currDiff * this.maxScrollIncrease);
        }
        // Move hitboxes with bus
        this.leftHitbox.x = this.bus.x + busSpeed;
        this.rightHitbox.x = this.bus.x - busSpeed;
        
        // Update Bus
        if(!gameOver)
            this.bus.update();
        
        // update objects (pedestrians and obstacles)
        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i].active == true) {
                // update the item if it still exists 
                this.objects[i].update(this.currDiff * this.maxObstIncrease);
            }
            else {
                // remove the item if it's no longer active
                this.objects.splice(i, 1);
                i--;
            }
        }

        // Update score
        if(!gameOver){
            this.scoreLeft.text = score + "$";
            this.scoreRight.text = distance + "ft.";
            distance++;
        }

        // Earth Swap
        if(score > -this.earthBound && score < this.earthBound && !isEarth){
            //console.log("Next stop Earth!");
            this.earthSwap();
        }
        // Hell Swap
        if(score <= this.hellBound && !isHell){
            //console.log("Next stop Hell!");
            this.hellSwap();
        }
        // Heaven Swap
        if(score >= this.heavenBound && !isHeaven){
            //console.log("Next stop Heaven!");
            this.heavenSwap();
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
                this.tweens.add({
                    targets: this.hellbgm,
                    volume: 0,
                    ease: 'Linear',
                    duration: 1000,
                });
                this.tweens.add({
                    targets: this.heavenbgm,
                    volume: 0,
                    ease: 'Linear',
                    duration: 1000,
                });
                this.sound.play('oHit', { volume: 0.75 });
                this.cameras.main.shake(500, 0.05);
                this.destroyAll();
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

        // Moving the animation with the sprite
        this.theBusAnim.x = this.bus.x + 39;
        this.theBusAnim.y = this.bus.y + 93;

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

            // Animation
            this.theBusAnim.alpha = 1;
            this.bus.alpha = 0;
            this.theBusAnim.play("busDoorAnim");
            this.theBusAnim.on('animationcomplete', () => {
                this.theBusAnim.alpha = 0;
                this.bus.alpha = 1;
            });
        }

        // Trie markings particles
        //if(cursors.left.isDown || cursors.right.isDown){
        if(this.bus.body.velocity.x > 370 || this.bus.body.velocity.x < -370){
            this.tireParticles.emitParticleAt(this.bus.x + 70, this.bus.y + 10, 1);
            this.tireParticles.emitParticleAt(this.bus.x + 10, this.bus.y + 10, 1);
        }

        // check key input for restart
        if (gameOver){
            if(Phaser.Input.Keyboard.JustDown(this.keyR)) {
                score = 0;
                distance = 0;
                numPedHit = 0;
                numPedPicked = 0;
                gameOver = false;
                isEarth = true;
                isHell = false;
                isHeaven = false;
                this.lastScore = 0;
                this.didEndGame = false;
                this.scene.restart();
            }
            else if(Phaser.Input.Keyboard.JustDown(this.keyM)) {
                score = 0;
                distance = 0;
                gameOver = false;
                isEarth = true;
                isHell = false;
                isHeaven = false;
                this.lastScore = 0;
                this.didEndGame = false;
                this.scene.start('menuScene');
            }
        }
    }

    earthSwap(){
        isEarth = true;
        isHell = false;
        isHeaven = false;
        // stop other music
        this.tweens.add({
            targets: this.hellbgm,
            volume: 0,
            ease: 'Linear',
            duration: 1000,
        });
        this.tweens.add({
            targets: this.heavenbgm,
            volume: 0,
            ease: 'Linear',
            duration: 1000,
        });
        if(this.prevLocation == 'Hell'){
            //add transition
            this.hellTransition = this.physics.add.sprite(0, -1040, 'hellTransition').setOrigin(0,0);
            this.hellTransition.depth = 100;
            this.hellTransition.body.velocity.y += 500;
        } else if (this.prevLocation == 'Heaven'){
            //add transition
            this.heavenTransition = this.physics.add.sprite(0, -1040, 'heavenTransition').setOrigin(0,0);
            this.heavenTransition.depth = 100;
            this.heavenTransition.body.velocity.y += 500;
        }
        // | spawn timer setup
        let timerConfig = {
            delay: 2000, // milliseconds
            callback: () => {
                // make change
                this.street.alpha = 1;
                this.hellStreet.alpha = 0;
                this.heavenStreet.alpha = 0;
                this.destroyAll();
                this.prevLocation = 'Earth';
            },
            callbackScope: this,
        }
        this.spawnerTimer = this.time.addEvent(timerConfig);
    }
    
    hellSwap(){
        isEarth = false;
        isHell = true;
        isHeaven = false;
        // start music
        this.tweens.add({
            targets: this.hellbgm,
            volume: 0.5,
            ease: 'Linear',
            duration: 1000,
        });
        //add transition
        this.hellTransition = this.physics.add.sprite(0, -1040, 'hellTransition').setOrigin(0,0);
        this.hellTransition.depth = 100;
        this.hellTransition.body.velocity.y += 500;
        // | spawn timer setup
        let timerConfig = {
            delay: 2000, // milliseconds
            callback: () => {
                // make change
                this.street.alpha = 0;
                this.hellStreet.alpha = 1;
                this.heavenStreet.alpha = 0;
                this.destroyAll();
                this.prevLocation = 'Hell';
            },
            callbackScope: this,
        }
        this.spawnerTimer = this.time.addEvent(timerConfig);
    }

    heavenSwap(){
        isEarth = false;
        isHell = false;
        isHeaven = true;
        // start music
        this.tweens.add({
            targets: this.heavenbgm,
            volume: 0.5,
            ease: 'Linear',
            duration: 1000,
        });
        //add transition
        this.heavenTransition = this.physics.add.sprite(0, -1040, 'heavenTransition').setOrigin(0,0);
        this.heavenTransition.depth = 100;
        this.heavenTransition.body.velocity.y += 500;
        // | spawn timer setup
        let timerConfig = {
            delay: 2000, // milliseconds
            callback: () => {
                // make change
                this.street.alpha = 0;
                this.hellStreet.alpha = 0;
                this.heavenStreet.alpha = 1;
                this.destroyAll();
                this.prevLocation = 'Heaven';
            },
            callbackScope: this,
        }
        this.spawnerTimer = this.time.addEvent(timerConfig);
    }

    destroyAll(){
        while (this.objects.length != 0) {
            if (this.objects[0].active == true) {
                // destroy the item if it still exists 
                this.objects[0].destroy();
                this.objects.splice(0, 1);
            }
            else {
                // remove the item if it's no longer active
                this.objects.splice(0, 1);
            }
        }
    }

    gameisover(){
        if(!this.didEndGame){
            this.didEndGame = true;

            // Display End
            let endConfig = {
                fontFamily: 'Courier',
                fontSize: '28px',
                color: '#d95763',
                align: 'center',
                padding: {
                    top: 5,
                    bottom: 5,
                },
            }

            // Show end screen after a moment
            let endtimerConfig = {
                delay: 1000, // milliseconds
                callback: () => {
                    this.uiEnd = this.add.image(40, 150, 'end').setOrigin(0,0);
                    this.uiEnd.depth = 150;

                    this.add.text(game.config.width / 2, game.config.height / 2 - 128, 'The Ourobor-Bus', endConfig).setOrigin(0.5).depth = 200;
                    this.add.text(game.config.width / 2, game.config.height / 2 - 100, 'CRASHES!', endConfig).setOrigin(0.5).depth = 200;
                    this.add.text(game.config.width / 2, game.config.height / 2 - 54, 'It hit: ' + numPedHit + ' people', endConfig).setOrigin(0.5).depth = 200;
                    this.add.text(game.config.width / 2, game.config.height / 2 + 10, 'Picked up: ' + numPedPicked + ' people', endConfig).setOrigin(0.5).depth = 200;
                    this.add.text(game.config.width / 2, game.config.height / 2 + 74, 'MADE: ' + score + "$", endConfig).setOrigin(0.5).depth = 200;
                    this.add.text(game.config.width / 2, game.config.height / 2 + 138, 'TRAVELED: ' + distance + ' FEET.', endConfig).setOrigin(0.5).depth = 200;
                    this.add.text(game.config.width / 2, game.config.height / 2 + 202, 'R TO RESTART.', endConfig).setOrigin(0.5).depth = 200;
                    this.add.text(game.config.width / 2, game.config.height / 2 + 266, 'M TO RETURN TO MENU.', endConfig).setOrigin(0.5).depth = 200;
                },
                callbackScope: this,
            }
            this.endTimer = this.time.addEvent(endtimerConfig);
        }
    }

    inverseLerp(point, a, b)
    {
        if (a == b && point >= b) {
            return 1.0;
        }
        else if (a == b && point < b) {
            return 0.0;
        }
        
        point = Phaser.Math.Clamp(point, a, b);
        if (point == a)
            return 0.0;
        else if (point == b)
            return 1.0;
        else {
            let d = b - a;
            let f = b - point;
            return (d - f) / d;
        }
    }
}