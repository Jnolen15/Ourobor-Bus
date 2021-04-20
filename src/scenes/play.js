class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload(){ 
        // Add sprites
        this.load.image('bus', './assets/bus.png');
    }
    
    create() {
        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();

        // Add Bus
        this.bus = new Bus(this, 220, 560, 'bus').setOrigin(0,0);
    }

    update(){
        //console.log("In update");
        this.bus.update();
    }

}