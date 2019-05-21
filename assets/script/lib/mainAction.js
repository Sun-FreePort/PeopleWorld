/**
 * 逻辑库：Main 场景
 */
let main = {
    constructor () {
        this.scene = false;
    },

    /**
     * @param gameObj
     */
    init (gameObj) {
        this.scene = gameObj;
    },

    /**
     * 增加提醒信息流
     */
    addAlert (time, info) {
        let data = this.scene.data;

        let realTime = data.nowTime + time;
        data.alertInfos.push([realTime, (data.nowTime / data.ONE_DAY).toFixed(0) + '日，' + info]);

        this.scene.data = data;
    },

    /**
     * 全局行为
     *
     * 任何场景都需要执行的动作
     */
    globalAction () {
        this.birth();
        this.monsterRest();
    },

    /**
     * 怪兽回复
     */
    monsterRest () {
        let data = this.scene.data;

        if (data.monster.hp < data.monster.origin.hp) {
            data.monster.hp += data.monster.origin.hp * 0.05;
        } else if (data.monster.hp > data.monster.origin.hp) {
            data.monster.hp = data.monster.origin.hp;
        }

        this.scene.data = data;
    },

    /**
     * 人口繁衍
     */
     birth () {
        let data = this.scene.data;

        // 人数增长
        let peopleIsOverload = data.peopleValue > data.areaValue * data.unitAreaVolume;
        if (peopleIsOverload) {
            this.addAlert(7, '人口爆满：新生儿有点多，地上放不下了');
        } else {
            let indulge = 0.2 - data.peopleValue * 0.004;
            data.peopleValue = data.peopleValue * 1.01 + indulge;
        }

        this.scene.data = data;

        // 是否自行发动远征。人越多，远征动力越小
        if (peopleIsOverload && Math.random() < (8 / data.peopleValue)) {
            this.intrude()
        }
     },

    /**
     * 发动远征
     *
     * @param data 场景
     */
    intrude () {
        let data = this.scene.data;

        let human = Math.floor(data.peopleValue * 0.4);
        for (let i = 0; human > 0; i++) {
            // 怪兽袭击人们
            human = Math.floor((human * data.people.hp - data.monster.attack) / data.people.hp);
            if (human < 0) {
                data.peopleValue -= Math.floor(data.peopleValue * 0.4);
                this.addAlert(7, '为了更多土地，人们组织了远征军，遇敌后再无音讯');
                break;
            }

            // 幸存者反击怪兽
            data.monster.hp -= data.people.attack * human;

            // 检查怪兽是否存活
            if (data.monster.hp < 0) {
                this.addAlert(7, '人们组织了远征军，他们击溃了远方的怪兽，获取了新土地');
                data.areaValue += data.monster.area;
                data.peopleValue -= Math.floor(data.peopleValue * 0.4) - human;

                // 怪兽加强
                let UP_RATE_AREA = 1.1;
                let UP_RATE_HP = 1.25;
                let UP_RATE_ATTACK = 1.17;
                data.monster = {
                    area: data.monster.origin.area * UP_RATE_AREA,
                    hp: data.monster.origin.hp * UP_RATE_HP,
                    attack: data.monster.origin.attack * UP_RATE_ATTACK,
                    origin: {
                        area: data.monster.origin.area * UP_RATE_AREA,
                        hp: data.monster.origin.hp * UP_RATE_HP,
                        attack: data.monster.origin.attack * UP_RATE_ATTACK,
                    },
                }
                break;
            }
        }

        this.scene.data = data;
    },
};

module.exports = main;
