class Play extends Phaser.Scene {
    constructor() {
        super('playScene');

        this.didEndGame = false;
        this.lastScore = 0;
        this.hellBound = -5;
        this.heavenBound = 5;
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
            //fixedWidth: 150
        }
        this.scoreLeft = this.add.text(340, 10, score + "$", scoreConfig);
        this.scoreRight = this.add.text(340, 40, distance + "ft.", scoreConfig);
        this.hsRight = this.add.text(10, 40, "HS $: " + highScore + "$", scoreConfig);
        this.hsRight = this.add.text(10, 10, "HS ft.: " + distHighScore + "ft.", scoreConfig);

        // Difficulty Setup
        this.timeElapsed = 0;
        this.minDiffTime = 15 * 1000;
        this.maxDiffTime = 60 * 1000;
        this.currDiff = 0;
        this.maxObstIncrease = 400; // FIX THIS (NO MAGIC NUMBERS BRO)
        this.maxScrollIncrease = 6; // FIX THIS (NO MAGIC NUMBERS BRO)

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

    update(time, delta){
        // update time elapsed and difficulty scale 
        this.timeElapsed += delta; // in miliseconds
        this.currDiff = this.inverseLerp(this.timeElapsed, this.minDiffTime, this.maxDiffTime);
        
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
        if(score > this.hellBound && score < this.heavenBound && !isEarth){
            console.log("Next stop Earth!");
            this.earthSwap();
        }
        // Hell Swap
        if(score <= this.hellBound && !isHell){
            console.log("Next stop Hell!");
            this.hellSwap();
        }
        // Heaven Swap
        if(score >= this.heavenBound && !isHeaven){
            console.log("Next stop Heaven!");
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
        if (gameOver){
            if(Phaser.Input.Keyboard.JustDown(this.keyR)) {
                score = 0;
                distance = 0;
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
                console.log("This many before: " + this.objects.length);
                console.log("SWAPPING");
                this.street.alpha = 0;
                this.hellStreet.alpha = 0;
                this.heavenStreet.alpha = 1;
                this.destroyAll();
                this.prevLocation = 'Heaven';
                console.log("This many after: " + this.objects.length);
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