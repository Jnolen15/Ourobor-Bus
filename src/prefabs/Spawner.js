class Spawner {
    constructor(scene){
        scene.add.existing(this);
        this.scene = scene;
        // | placement of spawners by x position (pixels);
        this.spawn1 = 80;
        this.spawn2 = 160;
        this.spawn3 = 240;
        this.spawn4 = 320;
        this.spawn5 = 400;
        // | spawn timer setup
        let timerConfig = {
            delay: 5000,                // milliseconds
            callback: () => {
                this.diceRoll(this.spawn1);
                this.diceRoll(this.spawn2);
                this.diceRoll(this.spawn3);
                this.diceRoll(this.spawn4);
                this.diceRoll(this.spawn5);
                console.log("-----------");
            },
            callbackScope: this,
            loop: true
        }
        this.spawnerTimer = scene.time.addEvent(timerConfig);
    }

    update() {
        
    }

    diceRoll(xPos) {
        let spawnRoll = Phaser.Math.Between(1, 10);
        if (spawnRoll <= 6) {
            // | don't spawn anything
            console.log("spawning nothing at " + xPos);
        }
        else {
            // | spawn something
            let typeRoll = Phaser.Math.Between(1, 2);
            
            if (typeRoll == 1) {
                // | spawn obstacle
                console.log("spawning obstacle at " + xPos);
                this.obstacle = new Obstacle(this.scene, xPos, 0, 'bus');
            }
            else if (typeRoll == 2) {
                // | spawn pedestrian
                console.log("spawning pedestrian at " + xPos);
                this.obstacle = new Obstacle(this.scene, xPos, 0, 'bus');
            }
        }
    }
}