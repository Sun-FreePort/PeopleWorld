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
            this.initSave();
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
    },

    update (dt) {
        // 每秒更新
        this.nowTime += dt;

        if (this.nowTime > this.lastTime + 2) {
            this.lastTime += this.time.ONE_DAY;

        	this.researchTech1();
            this.updateSave();
        }
    },

    // 研究科技1
    researchTech1 () {
    	this.progress.node.width = ++this.progressWidth;
    },

    initSave() {
        let _gameData = {
            ONE_DAY: 2,
            nowTime: this.nowTime,
            areaValue: this.areaValue,
            peopleValue: this.peopleValue,
            lastTime: 0,
            monster: {
                area: 1,
                hp: 22,
                attack: 7,
                origin: {
                    area: 1,
                    hp: 22,
                    attack: 7,
                },
            },
            people: {
                hp: 3,
                attack: 1,
            },
        };
        cc.sys.localStorage.setItem('gameData', JSON.stringify(_gameData));
    },

    updateSave() {
        let _gameData = JSON.parse(cc.sys.localStorage.getItem('gameData'));
        _gameData.nowTime = this.nowTime;
        _gameData.lastTime = this.lastTime;
        cc.sys.localStorage.setItem('gameData', JSON.stringify(_gameData));
    },

    clearSave() {
        this.enabled = false;
        this.updateSave();
        let _gameData = cc.sys.localStorage.getItem('gameData');
        cc.sys.localStorage.setItem('gameData.bac', _gameData);
        cc.sys.localStorage.removeItem('gameData');
        cc.director.loadScene('main');
    },

    restorySave() {
        this.enabled = false;
        this.updateSave();
        let _gameData = cc.sys.localStorage.getItem('gameData.bac');
        cc.sys.localStorage.setItem('gameData', _gameData);
        cc.director.loadScene('main');
    },

    openMainBorder () {
    	cc.director.loadScene('main');
    }
});
