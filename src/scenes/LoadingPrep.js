class LoadingPrep extends Phaser.Scene {
    constructor() {
        super("loadingPrepScene");
    }

    preload() {
        this.load.image('loadingBar', './assets/BusLoadingBar.png');
    }

    create() {
        this.scene.start('menuScene');
    }
}