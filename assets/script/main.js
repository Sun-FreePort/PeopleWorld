cc.Class({
    extends: cc.Component,

    properties: {
        People: {
            default: null,
            type: cc.Label
        },
        peopleValue: 10,

        Area: {
            default: null,
            type: cc.Label
        },
        areaValue: 10,

        Time: {
            default: null,
            type: cc.Label
        },
        nowTime: 0,

        Alert: {
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() {},

    start() {
    	let _gameData = JSON.parse(cc.sys.localStorage.getItem('gameData'));
    	if (!_gameData) {
            this.initSave();
    	}

    	// 定义时间、名称等无关逻辑内容
    	this.transName = {
    		'people': '居民',
    		'area': '面积',
    		'time': '时间',
    	};

    	// 初始时间
        this.time = {
        	ONE_DAY: Number(_gameData.ONE_DAY),
        };
        this.nowTime = Number(_gameData.nowTime);
        this.lastTime = Number(_gameData.lastTime);

        // 初始值
    	this.areaValue = Number(_gameData.areaValue);
    	this.peopleValue = Number(_gameData.peopleValue);

        // 初始的敌人与人
        this.monster = _gameData.monster;
        this.people = _gameData.people;

        // 定义逻辑内容
        this.alertInfos = [];
        this.updateAlert();
        this.updateArea();
        this.updateTime();
        this.updatePeople();
        this.enabled = true;
    },

    update (dt) {
        // 每秒更新
        this.nowTime += dt;

        if (this.enabled && this.nowTime > this.lastTime + 2) {
        	// 人数增长
            this.lastTime += this.time.ONE_DAY;

            if (this.peopleValue / 10 > this.areaValue) {
                if (Math.random() > 0.8) {
	                let human = Math.floor(this.peopleValue * 0.8);
	                for (let i = 0; human > 0; i++) {
	                	// 野兽袭击人们
	                	human = Math.floor((human * this.people.hp - this.monster.attack) / this.people.hp);
	                	if (human < 0) {
	                		this.addAlert(5, '人们自发的组织了远征军，但他们出发后就再无音讯');
	                		break;
	                	}
	                	// 幸存者反击野兽
	                	this.monster.hp -= this.people.attack * human;
	                	// 检查野兽是否存活
	                	if (this.monster.hp < 0) {
	                		this.addAlert(5, '人们自发的组织了远征军，他们击溃了远方的怪兽，获取了新土地');
	                		this.areaValue += this.monster.area;
	                		this.updateArea();
	                		this.peopleValue -= Math.floor(this.peopleValue * 0.8) - human;
	                		this.updatePeople();

	                		this.monster = {
					        	area: this.monster.origin.area * 1.1,
					        	hp: this.monster.origin.hp * 1.25,
					        	attack: this.monster.origin.attack * 1.17,
	                			origin: {
						        	area: this.monster.origin.area * 1.1,
						        	hp: this.monster.origin.hp * 1.25,
						        	attack: this.monster.origin.attack * 1.17,
	                			},
	                		}
	                		break;
	                	}
	                }
                } else {
                	this.addAlert(5, '人口增长停滞：我们的居民没有更多土地居住了');
                }
            } else {
	            this.peopleValue = this.peopleValue * 1.01;
	            this.updatePeople();
            	this.monsterRest();
            }

            // 日常更新
            this.updateAlert();
            this.updateTime();
            this.updateSave();
        }
    },

    updatePeople() {
	    this.People.string = this.transName.people + '：' + this.peopleValue.toFixed(0);
    },

    updateTime() {
	    this.Time.string = `${this.transName.time}：${(this.nowTime / this.time.ONE_DAY).toFixed(0)} 日`;
    },

    updateArea() {
	    this.Area.string = this.transName.area + '：' + this.areaValue.toFixed(0);
    },

    addAlert (time, info) {
    	let realTime = this.nowTime + time;
        this.alertInfos.push([realTime, (this.nowTime / this.time.ONE_DAY).toFixed(0) + '日，' + info]);
    },

    updateAlert() {
        if (this.alertInfos.length === 0) {
            this.addAlert(5, '宁静的一天');
        }

        let alert = [];
        for (var i = this.alertInfos.length - 1; i >= 0; i--) {
        	if (this.alertInfos[i][0] < this.nowTime) {
        		continue;
        	}
        	alert.push(this.alertInfos[i][1]);
        }
        this.Alert.string = alert.join('\n');
        this.Alert.node.color = new cc.Color(174, 255, 205);
    },

    monsterRest() {
    	if (this.monster.hp < this.monster.origin.hp) {
    		this.monster.hp += this.monster.origin.hp * 0.05;
    	} else if (this.monster.hp > this.monster.origin.hp) {
    		this.monster.hp = this.monster.origin.hp;
    	}
    },

    fightWar() {
    	if (this.peopleValue > 8) {
    		// 启动战斗
    		this.addAlert(5, '机构组织了一场远征');
    	} else {
            this.addAlert(5, '我们没有更多人用来战斗了');
    	}
        this.updateAlert();
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
        let _gameData = {
            ONE_DAY: 2,
            nowTime: this.nowTime,
            areaValue: this.areaValue,
            peopleValue: this.peopleValue,
            lastTime: this.lastTime,
            monster: this.monster,
            people: this.people,
        };
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

    openResearchBorder() {
    	if (this.peopleValue > 7) {
    		this.updateSave();
    		cc.director.loadScene('research');
    	} else {
            this.addAlert(5, '为了支持科研行动，我们需要更多人！');
    	}
        this.updateAlert();
    },

    openMenu() {
        console.info('试图打开菜单')
    }
});
