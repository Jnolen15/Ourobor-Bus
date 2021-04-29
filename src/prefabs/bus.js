class Bus extends Phaser.Physics.Arcade.Sprite { 
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        // Add self 
        scene.add.existing(this);
        
        // Add physics
        scene.physics.add.existing(this);
        
        // Bus properties
        this.moveSpeed = 20;
        this.setCollideWorldBounds(true);
        this.setDragX(busDrag);
        this.setDepth(100);
        this.setMaxVelocity(380);
    }

    update(){
        // left/right movement
        if(cursors.left.isDown) {
            // console.log("pressed left");
            this.body.velocity.x -= this.moveSpeed;
                
        } else if(cursors.right.isDown) {
            // console.log("pressed right"); 
            this.body.velocity.x += this.moveSpeed; 
        }
    }

}