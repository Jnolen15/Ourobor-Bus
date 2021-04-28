class Pedestrian extends Phaser.Physics.Arcade.Sprite { 
    constructor(scene, x, y, texture, scorevalue, frame){
        super(scene, x, y, texture, frame);
        // Add self 
        scene.add.existing(this);
        
        // Add physics
        scene.physics.add.existing(this);
        
        // Pedestian properties
        this.value = scorevalue;
        this.moveSpeed = 350;
        this.body.velocity.y += this.moveSpeed;
        this.maximumY = 880; 
        
        // Add self to scene's array
        scene.objects.push(this);
    }

    update() {
        if (this.y > this.maximumY + 20) {
            // console.log("pedestrian deleted");
            this.destroy();
        }
    }

    destroySelf(){
        this.destroy();
    }
}