let config = {
    type: Phaser.CANVAS,
    width: 480,
    height: 640,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Play],
}

//define game
let game = new Phaser.Game(config);

//define globals
let cursors;