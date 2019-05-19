let gameStorage = require("gameStorage");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {
    },

    // update (dt) {},

    clearSave() {
    	gameStorage.clearSave();
    },

    restoreSave() {
    	gameStorage.restoreSave();
    },

    exit() {
    	if(cc.sys.os == cc.sys.OS_ANDROID){
    		cc.game.end();
    	}
    },
});
