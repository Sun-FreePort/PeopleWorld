let gameStorage = require("gameStorage");
let mainAction = require("mainAction");

/**
 * 主场景
 *
 * 场景负责操作界面、执行本场景独有的逻辑、为其他逻辑库提供全局变量
 * 全局执行的逻辑，原则上放在 *Action 逻辑库中
 */
cc.Class({
    extends: cc.Component,

    properties: {
        Money: {
            default: null,
            type: cc.Label
        },

        People: {
            default: null,
            type: cc.Label
        },

        Area: {
            default: null,
            type: cc.Label
        },

        Time: {
            default: null,
            type: cc.Label
        },

        Alert: {
            default: null,
            type: cc.Label
        },
        Menu: {
            default: null,
            type: cc.Node
        },

        homelessPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() {},

    start() {
        let _gameData = JSON.parse(cc.sys.localStorage.getItem('gameData'));
        if (!_gameData) {
            _gameData = gameStorage.initSave();
        }
        this.data = _gameData;

        // 定义时间、名称等无关逻辑内容
        this.transName = {
            'money': '货币',
            'people': '居民',
            'area': '面积',
            'time': '时间',
        };

        if (!this.data.design.one) {
            this.Money.node.opacity = 0;
        }

        // 定义逻辑内容
        this.updateAlert();
        this.updateArea();
        this.updateTime();
        this.updatePeople();
        this.enabled = true;
        this.homelessHas = false;

        gameStorage.init(this);
        mainAction.init(this);
    },

    update (dt) {
        // 每秒更新
        this.data.nowTime += dt;

        if (this.enabled && this.data.nowTime > this.data.lastTime + 2) {
            this.data.lastTime += this.data.ONE_DAY;

            // 全局行为
            mainAction.globalAction();

            // [66% / 人数] 的几率出现流浪人
            if (Math.random() < 0.66 / (this.data.peopleValue - 2)) {
                this.initHomeless();
            }
            
            // 日常更新
            this.updateArea();
            this.updatePeople();
            this.updateAlert();
            this.updateTime();
            gameStorage.updateSave();
        }
    },

    updatePeople() {
        this.People.string = this.transName.people + '：' + this.data.peopleValue.toFixed(0);
    },

    updateMoney() {
        this.Money.string = this.transName.money + '：' + this.data.moneyValue.toFixed(0);
    },

    updateTime() {
        this.Time.string = `${this.transName.time}：${(this.data.nowTime / this.data.ONE_DAY).toFixed(0)} 日`;
    },

    updateArea() {
        this.Area.string = this.transName.area + '：' + this.data.areaValue.toFixed(0);
    },

    updateAlert() {
        let alert = [];
        for (var i = this.data.alertInfos.length - 1; i >= 0; i--) {
            if (this.data.alertInfos[i][0] < this.data.nowTime) {
                this.data.alertInfos.shift();
                continue;
            }
            alert.push(this.data.alertInfos[i][1]);
        }
        this.Alert.string = alert.join('\n');
        this.Alert.node.color = new cc.Color(174, 255, 205);
    },

    fightWar() {
        if (this.data.peopleValue > 8) {
            mainAction.addAlert(7, '机构组织了一场远征');
            // 启动战斗
            mainAction.intrude();
        } else {
            mainAction.addAlert(7, '我们没有更多人用来战斗了');
        }
        this.updateAlert();
    },

    initHomeless() {
        if (!this.homelessHas) {
            this.homeless = cc.instantiate(this.homelessPrefab);
            this.node.addChild(this.homeless);
            let x = Math.random() * this.node.width - this.node.width / 2;
            let y = Math.random() * this.node.height - this.node.height / 2;
            this.homeless.setPosition(cc.v2(x, y));

            this.homeless.getComponent('bubble').id = parseInt(Math.random() * 1000);
            this.homeless.getComponent('bubble').scene = this;

            this.homelessSchedule = this.scheduleOnce(function() {
                this.homelessHas = false;
                this.homeless.destroy();
            }, Math.random() * 6);
            this.homelessHas = true;
        }
    },

    openResearchBorder() {
        if (this.data.peopleValue > 7) {
            gameStorage.updateSave();
            cc.director.loadScene('research');
        } else {
            mainAction.addAlert(7, '为了支持科研行动，我们需要更多人！');
        }
        this.updateAlert();
    },

    openMenu() {
        this.Menu.x = 0;
    },

    clickMenuMask() {
        this.Menu.node = 590;
    },
});
