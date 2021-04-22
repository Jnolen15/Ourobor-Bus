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
                this.randomSpawn(this.spawn1, scene, bus);
                this.randomSpawn(this.spawn2, scene, bus);
                this.randomSpawn(this.spawn3, scene, bus);
                this.randomSpawn(this.spawn4, scene, bus);
                this.randomSpawn(this.spawn5, scene, bus);
                // console.log("-----------");
            },
            callbackScope: this,
            loop: true
        }
        this.spawnerTimer = scene.time.addEvent(timerConfig);
        console.log("bus: " + bus);
        console.log("bus speed: " + bus.moveSpeed);
    }

    randomSpawn(xPos, scene, bus) {
        let spawnRoll = Phaser.Math.Between(1, 10);
        if (spawnRoll <= 4) {                                               // 40% chance to spawn something (60% chance to spawn nothing)
            // | (if yes) spawn something                                             
            let typeRoll = Phaser.Math.Between(1, 2);
            if (typeRoll == 1) {                                            // (if spawning) 50% chance to spawn obstacle 
                // | spawn obstacle
                this.obstacle = new Obstacle(this.scene, xPos, 0, 'testObstacle');
                scene.physics.add.overlap(bus, this.obstacle);
            }
            else if (typeRoll == 2) {                                       // (if spawning) 50% chance to spawn pedestrian
                // | spawn pedestrian                                     
                this.obstacle = new Obstacle(this.scene, xPos, 0, 'testObstacle'); // FIXME (no pedestrian prefab)
                scene.physics.add.overlap(bus, this.obstacle);
            }
        }
    }
}