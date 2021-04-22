class Spawner {
    constructor(scene, bus){
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
            delay: 3000,                // milliseconds
            callback: () => {
                this.diceRoll(this.spawn1, scene, bus);
                this.diceRoll(this.spawn2, scene, bus);
                this.diceRoll(this.spawn3, scene, bus);
                this.diceRoll(this.spawn4, scene, bus);
                this.diceRoll(this.spawn5, scene, bus);
                // console.log("-----------");
            },
            callbackScope: this,
            loop: true
        }
        this.spawnerTimer = scene.time.addEvent(timerConfig);
        console.log("bus: " + bus);
        console.log("bus speed: " + bus.moveSpeed);
    }

    update() {
        
    }

    diceRoll(xPos, scene, bus) {
        let spawnRoll = Phaser.Math.Between(1, 10);
        if (spawnRoll <= 6) {
            // | don't spawn anything
            // console.log("spawning nothing at " + xPos);
        }
        else {
            // | spawn something
            let typeRoll = Phaser.Math.Between(1, 2);
            
            if (typeRoll == 1) {
                // | spawn obstacle
                // console.log("spawning obstacle at " + xPos);
                this.obstacle = new Obstacle(this.scene, xPos, 0, 'bus');
                // console.log("bus speed: " + bus.moveSpeed);
                
                scene.physics.add.overlap(bus, this.obstacle);
            }
            else if (typeRoll == 2) {
                // | spawn pedestrian
                // console.log("spawning pedestrian at " + xPos);
                this.obstacle = new Obstacle(this.scene, xPos, 0, 'bus');
                scene.physics.add.overlap(bus, this.obstacle);
            }
        }
    }
}