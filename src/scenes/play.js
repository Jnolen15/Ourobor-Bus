class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    create() {
        
        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();
    }

}