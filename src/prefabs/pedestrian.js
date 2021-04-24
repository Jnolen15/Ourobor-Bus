class Pedestrian extends Phaser.Physics.Arcade.Sprite { 
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        // Add self 
        scene.add.existing(this);
        
        // Add physics
        scene.physics.add.existing(this);
        
        // Obstacle properties
        this.score = 1;
        this.moveSpeed = 350;
        this.body.velocity.y += this.moveSpeed;
    } 

}