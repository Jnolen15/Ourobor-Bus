class Spawner {
    constructor(scene, bus, busLeft, busRight){
        scene.add.existing(this);
        this.scene = scene;
        this.bus = bus;
        this.busLeft = busLeft;
        this.busRight = busRight;

        // | how high objects spawn on the screen
        this.yPos = -100;
        // | how spaced out objects are when they're stacked in a column
        this.stackDistance = 80;
        // | placement of spawners by x position (pixels);
        this.xPos1 = 80;
        this.xPos2 = 160;
        this.xPos3 = 240;
        this.xPos4 = 320;
        this.xPos5 = 400;
        // | list of all possible spawn patterns
        let pat0 = { c1:'none', c2:'obst', c3:'none', c4:'obst', c5:'ped3'}
        let pat1 = { c1:'none', c2:'obst', c3:'ped3', c4:'obst', c5:'ped3'}
        let pat2 = { c1:'obst', c2:'mPed', c3:'none', c4:'mPed', c5:'obst'}
        let pat3 = { c1:'none', c2:'none', c3:'sTop', c4:'sMid', c5:'sBot'} // Triangle shape (sloping left)
        let pat4 = { c1:'sBot', c2:'sMid', c3:'sTop', c4:'none', c5:'none'} // Triangle shape (sloping right)
        let pat5 = { c1:'sTop', c2:'none', c3:'obst', c4:'none', c5:'sBot'}
        let pat6 = { c1:'sBot', c2:'none', c3:'obst', c4:'none', c5:'sTop'}
        let pat7 = { c1:'obst', c2:'mPed', c3:'hPed', c4:'mPed', c5:'obst'}
        this.patternList = [pat0, pat1, pat2, pat3, pat4, pat5, pat6, pat7];
        // | spawn timer setup
        let timerConfig = {
            delay: 3000, // milliseconds
            callback: () => {
                if(!gameOver)
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
        let currObst;   // current obstacle
        let currPed;    // current pedestrian
        switch(key) {
            case 'none':
                // | do nothing
                break;
            case 'obst':
                // | spawn obstacle
                currObst = new Obstacle(this.scene, xPos, this.yPos, 'testObstacle');
                this.setObsCollision(this.bus, currObst);
                break;
            case 'mPed':
                // | spawn a single pedestrian in the middle
                currPed = new Pedestrian(this.scene, xPos, this.yPos, 'testObstacle1', 1);
                this.setPedCollision(this.bus, this.busLeft, this.busRight, currPed);
                break;
            case 'hPed':
                // | spawn a single pedestrian slightly higher
                currPed = new Pedestrian(this.scene, xPos, this.yPos-this.stackDistance, 'testObstacle1', 1);
                this.setPedCollision(this.bus, this.busLeft, this.busRight, currPed);
                break;
            case 'ped3':
                // --- Spawn a column of 3 pedestrians
                // | pedestrian 1
                currPed = new Pedestrian(this.scene, xPos, this.yPos+this.stackDistance, 'testObstacle1', 1);
                this.setPedCollision(this.bus, this.busLeft, this.busRight, currPed);
                // | pedestrian 2
                currPed = new Pedestrian(this.scene, xPos, this.yPos, 'testObstacle1', 1);
                this.setPedCollision(this.bus, this.busLeft, this.busRight, currPed);
                // | pedestrian 3
                currPed = new Pedestrian(this.scene, xPos, this.yPos-this.stackDistance, 'testObstacle1', 5);
                this.setPedCollision(this.bus, this.busLeft, this.busRight, currPed);
                break;
            case 'sBot':
                // | spawn a obstacle with a ped in front (lower on the screen) 
                currObst = new Obstacle(this.scene, xPos, this.yPos, 'testObstacle');
                this.setObsCollision(this.bus, currObst);
                currPed = new Pedestrian(this.scene, xPos, this.yPos+this.stackDistance, 'testObstacle1', 1);
                this.setPedCollision(this.bus, this.busLeft, this.busRight, currPed);
                break;
            case 'sMid':
                currObst = new Obstacle(this.scene, xPos, this.yPos-this.stackDistance, 'testObstacle');
                this.setObsCollision(this.bus, currObst);
                currPed = new Pedestrian(this.scene, xPos, this.yPos, 'testObstacle1', 1);
                this.setPedCollision(this.bus, this.busLeft, this.busRight, currPed);
                break;
            case 'sTop':
                currObst = new Obstacle(this.scene, xPos, this.yPos-(this.stackDistance*2), 'testObstacle');
                this.setObsCollision(this.bus, currObst);
                currPed = new Pedestrian(this.scene, xPos, this.yPos-this.stackDistance, 'testObstacle1', 1);
                this.setPedCollision(this.bus, this.busLeft, this.busRight, currPed);
                break;
            default:
                console.log("ERROR - Unknown column pattern key: " + key);
        }
    }

    setObsCollision(bus, obstacle){
        this.scene.physics.add.overlap(bus, obstacle, function(bus, obstacle) {
            console.log("obstacle hit!!");
            gameOver = true;
            obstacle.destroy();
        });
    }

    setPedCollision(bus, busLeft, busRight, pedestrian){
        this.scene.physics.add.overlap(bus, pedestrian, function(bus, pedestrian) {
            console.log("pedestrian hit!!");
            score -= pedestrian.value * 2;
            pedestrian.destroy();
        });
        this.scene.physics.add.overlap(busLeft, pedestrian, function(busLeft, pedestrian) {
            console.log("pedestrian picked up!!");
            score += pedestrian.value;
            pedestrian.destroy();
        });
        this.scene.physics.add.overlap(busRight, pedestrian, function(busRight, pedestrian) {
            console.log("pedestrian picked up!!");
            score += pedestrian.value;
            pedestrian.destroy();
        });
    }
}