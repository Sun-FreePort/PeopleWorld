cc.Class({
    extends: cc.Component,

    properties: {
        id: 0,
        scene: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {
        this.node.on('touchend', function (event) {
            console.info(this.id);
            this.scene.unschedule(this.homelessSchedule);
            this.scene.peopleValue++;
            this.scene.updatePeople();
            this.scene.addAlert(5, '我们收留了一个流浪人');
            this.node.destroy();
        }, this);
    },

    // update (dt) {},
});
