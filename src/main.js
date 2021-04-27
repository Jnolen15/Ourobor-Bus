let config = {
    type: Phaser.CANVAS,
    width: 480,
    height: 840,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {x: 0, y: 0},
        }
    },
    scene: [Play],
}

//define game
let game = new Phaser.Game(config);

//define globals
let cursors;
let score = 0;
let distance = 0;
let gameOver = false;