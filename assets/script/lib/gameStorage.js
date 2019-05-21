/**
 * 游戏数据存储
 *
 * 设置或移除存储值，只需设定 initSave 方法的内容
 */
let storage = {
    constructor() {
        this.scene = false;
    },

    /**
     * 赋值游戏场景对象
     * （存档数据，一般统一放置在游戏场景）
     * 引入存档库时，需进行初始化
     *
     * @param gameObj
     */
    init(gameObj) {
        this.scene = gameObj;
    },

    /**
     * 初始化存档
     */
    initSave() {
        let _gameData = {
            design: {
                one: 0,
                two: 0,
            },  // 科技
            alertInfos: [],  // 主界面提醒信息
            ONE_DAY: 2,  // 每游戏日对应时间
            nowTime: 0,  // 当前时间
            areaValue: 2,  // 面积
            unitAreaVolume: 10,  // 单位面积可容纳人口
            peopleValue: 10,  // 人口
            lastTime: 0,  // 最后更新时间
            monster: {  // 野兽信息
                area: 1,  // 野兽占据的面积
                hp: 22,  // 野兽的生命
                attack: 7,  // 野兽的伤害
                origin: {  // 野兽的完整值存档
                    area: 1,
                    hp: 22,
                    attack: 7,
                },
            },
            people: {  // 个人的信息
                hp: 3,
                attack: 1,
            },
        };
        cc.sys.localStorage.setItem('gameData', JSON.stringify(_gameData));

        return _gameData;
    },

    /**
     * 更新存档
     */
    updateSave() {
        let _gameData = JSON.parse(cc.sys.localStorage.getItem('gameData'));
        Object.keys(_gameData).forEach(function (item) {
            _gameData[item] = storage.getValue(item, _gameData);
        });
        cc.sys.localStorage.setItem('gameData', JSON.stringify(_gameData));
    },

    /**
     * 获取存档中的某个值
     *
     * @param {string} key 值的键名
     * @param {JSON|number} _gameData 可选，存档数据，可避免重复读取存档的性能开销。默认 0 表示未传入
     * @returns {*}
     */
    getValue(key, _gameData = 0) {
        if (_gameData === 0) {
            _gameData = JSON.parse(cc.sys.localStorage.getItem('gameData'));
        }
        if (this.scene.data[key] === undefined) {
            return (!_gameData) ? 'Error: initSave' : _gameData[key];
        }
        return this.scene.data[key];
    },

    /**
     * 清理存档
     */
    clearSave() {
        this.scene.data.enabled = false;
        this.updateSave();
        let _gameData = cc.sys.localStorage.getItem('gameData');
        cc.sys.localStorage.setItem('gameData.bac', _gameData);
        cc.sys.localStorage.removeItem('gameData');
        this.initSave();
        cc.director.loadScene('main');
    },

    /**
     * 复原存档（至上次清理前）
     */
    restoreSave() {
        this.scene.data.enabled = false;
        this.updateSave();
        let _gameData = cc.sys.localStorage.getItem('gameData.bac');
        cc.sys.localStorage.setItem('gameData', _gameData);
        cc.director.loadScene('main');
    },
};

module.exports = storage;
