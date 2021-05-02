/*
Group B1:
Jared Nolen, Danielle Kraljevski, Nathann Latimore, Benjamin Urlik
Title: Ourobor-Bus
Creative tilt:
For our game we decided on a theme of a bus driving down an infinite street, 
picking up (or hitting) pedestrians. Based on how many pedestrians you pick up
or hit, the bus will travel to heaven or hell.
Technical Bit:
Instead of our game just spawning pedestrians and obstacles randomly, it
spawns premade patterns that are randomly selected from an array. We did
this so that the game would feel more structured/fair/fun while still having
a bit of randomness.
Visual / Audio bit:
The game's visual art is made by Danielle. We went with a pixel art style
to emphasize the arcade style feel. She made three variations for each set 
(Earth, Heaven and Hell). For the sound we used sfxr to generate
arcade sounding effects. For the passenger hit and pickup effects we have
three sound effects that are randomly picked to avoid repetition. The music
was made by Jared (me writing this rn). This was my first time really 
attempting to make music. I made it so that the music would dynamically
gain another layer in hell / heaven. The new lead that gets added is only
there for about half the song so it's possible you go to the new area and 
don't immediately hear it. But stay there long enough and you will!
*/

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
            //debug: true,
            gravity: {x: 0, y: 0},
        }
    },
    scene: [Menu, Play, Tutorial],
}

//define game
let game = new Phaser.Game(config);

//define globals
let cursors;
let score = 0;
let distance = 0;
let numPedHit = 0;
let numPedPicked = 0;
let highScore = 0;
let distHighScore = 0;
let isEarth = true;
let isHell = false;
let isHeaven = false;
let gameOver = false;
let scrollSpeed = 6;
let busSpeed = 80;
let pedMoveSpeed = 350;
let busDrag = 500;