class Spawner {
    constructor(scene){
        scene.add.existing(this);
        // | placement of spawners by x position (pixels);
        this.spawn1 = 200;
        this.spawn2 = 250;
        this.spawn3 = 300;
        this.spawn4 = 350;
        this.spawn5 = 400;
        // | spawn timer setup
        let timerConfig = {
            delay: 5000,
            loop: true,
            callback: () => {console.log("Called!");}
        }
        this.spawnerTimer = scene.time.delayedCall(500, () => { 
            console.log("Called!");
        }, null, this);
        this.spawnerTimer.loop = true;
    }

    update() {
        
    }
}