class Bus extends Phaser.GameObjects.Sprite { 
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        // Add self 
        scene.add.existing(this);
        // Add physics
        scene.physics.add.existing(this);
        // Bus properties
        this.moveSpeed = 20;
    }

    update(){
        //console.log("In update");
        // left/right movement
        if(cursors.left.isDown) {
            console.log("pressed left");
            this.body.velocity.x -= this.moveSpeed;
        } else if(cursors.right.isDown) {
            console.log("pressed rightS");
            this.body.velocity.x += this.moveSpeed;
        }
    }

}