class Obstacle extends Phaser.Physics.Arcade.Sprite { 
    constructor(scene, x, y, texture, moveSpeed, frame){
        super(scene, x, y, texture, frame);
        // Add self 
        scene.add.existing(this);
        
        // Add physics
        scene.physics.add.existing(this);
        
        // Obstacle properties
        this.moveSpeed = moveSpeed;
        this.body.velocity.y += this.moveSpeed;
        this.maximumY = 880;

        // Add self to scene's array
        scene.objects.push(this);
    }

    update(speedIncrease) {
        if (this.y > this.maximumY + 20) {
            // console.log("obstacle deleted");
            this.destroy();
        } else {
            this.setVelocityY(this.moveSpeed + speedIncrease);
        }
    }

    destroySelf(){
        this.destroy();
    }
}