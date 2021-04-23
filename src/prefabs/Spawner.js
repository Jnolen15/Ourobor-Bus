class Spawner {
    constructor(scene, bus){
        scene.add.existing(this);
        this.scene = scene;
        this.bus = bus;
        // | how high objects spawn on the screen
        this.yPos = 0;
        // | placement of spawners by x position (pixels);
        this.xPos1 = 80;
        this.xPos2 = 160;
        this.xPos3 = 240;
        this.xPos4 = 320;
        this.xPos5 = 400;
        // | list of all possible spawn patterns
        let pat1 = { c1:'none', c2:'obst', c3:'none', c4:'obst', c5:'ped3'}
        let pat2 = { c1:'none', c2:'obst', c3:'ped3', c4:'obst', c5:'ped3'}
        let pat3 = { c1:'obst', c2:'ped1', c3:'none', c4:'ped1', c5:'obst'}
        this.patternList = [pat1, pat2, pat3];
        // | spawn timer setup
        let timerConfig = {
            delay: 3000, // milliseconds
            callback: () => {
                this.fullRowSpawn();
            },
            callbackScope: this,
            loop: true
        }
        this.spawnerTimer = scene.time.addEvent(timerConfig);
        console.log("bus speed: " + bus.moveSpeed);
    }
    
    fullRowSpawn() {
        let columnKeys = this.pickPattern();
        this.columnSpawn(columnKeys.c1, this.xPos1);
        this.columnSpawn(columnKeys.c2, this.xPos2);
        this.columnSpawn(columnKeys.c3, this.xPos3);
        this.columnSpawn(columnKeys.c4, this.xPos4);
        this.columnSpawn(columnKeys.c5, this.xPos5);
    }

    pickPattern(preselectedNum) {
        if (preselectedNum == undefined) {
            let random = Phaser.Math.Between(0, this.patternList.length - 1);
            return this.patternList[random];
        } else {
            return this.patternList[preselectedNum];
        }
    }

    columnSpawn(key, xPos) {
        switch(key) {
            case 'none':
                // | do nothing
                break;
            case 'obst':
                // | spawn obstacle
                let obstacle = new Obstacle(this.scene, xPos, 0, 'testObstacle');
                this.scene.physics.add.overlap(this.bus, obstacle);
                break;
            case 'ped1':
                // | spawn a single pedestrian
                let pedestrian = new Pedestrian(this.scene, xPos, 0, 'testObstacle1');
                this.scene.physics.add.overlap(this.bus, pedestrian);
                break;
            case 'ped3':
                // | spawn a column of 3 pedestrians
                let ped1 = new Pedestrian(this.scene, xPos, this.yPos, 'testObstacle1');
                let ped2 = new Pedestrian(this.scene, xPos, this.yPos-80, 'testObstacle1');
                let ped3 = new Pedestrian(this.scene, xPos, this.yPos-160, 'testObstacle1');
                this.scene.physics.add.overlap(this.bus, ped1);
                this.scene.physics.add.overlap(this.bus, ped2);
                this.scene.physics.add.overlap(this.bus, ped3);
                break;
        }
    }
}