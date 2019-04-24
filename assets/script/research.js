let gameStorage = require("gameStorage");

cc.Class({
    extends: cc.Component,

    properties: {
        Tech1: {
            default: null,
            type: cc.Button
        },
        Tech1Time: 999,

        progress :{
            default: null,
            type: cc.Sprite
        },

        progressWidth: 0,

        Menu: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    	this.actionTech = [];

    	this.progress.node.width = this.progressWidth;
    },
    // 作图：科技研究完毕的状态
    // 作图：科技启动研究的状态

    start () {
        let _gameData = JSON.parse(cc.sys.localStorage.getItem('gameData'));
        if (!_gameData) {
            gameStorage.init(this);
            _gameData = gameStorage.initSave();
        }

        this.hasResearch = {
            tech1: {
                name: '群殴常识'
            }
        };

        // 初始时间
        this.time = {
            ONE_DAY: Number(_gameData.ONE_DAY),
        };
        this.nowTime = Number(_gameData.nowTime);
        this.lastTime = Number(_gameData.lastTime);

        gameStorage.init(this);
    },

    update (dt) {
        // 每秒更新
        this.nowTime += dt;

        if (this.nowTime > this.lastTime + 2) {
            this.lastTime += this.time.ONE_DAY;

        	this.researchTech1();
            gameStorage.updateSave();
        }
    },

    // 研究科技1
    researchTech1 () {
    	this.progress.node.width = ++this.progressWidth;
    },

    openMainBorder () {
    	cc.director.loadScene('main');
    },

    openMenu() {
        this.Menu.x = 0;
    },

    clickMenuMask() {
        this.Menu.node = 590;
    },
});
