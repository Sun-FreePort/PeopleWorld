/**
 * 存档库
 *
 * 设置或移除存储值，只需设定 initSave 方法的内容
 */
let storage = {
    constructor() {
        this.data = false;
    },

    /**
     * 赋值游戏场景对象
     * （存档数据，一般统一放置在游戏场景）
     * 引入存档库时，需进行初始化
     *
     * @param gameObj
     */
    init(gameObj) {
        this.data = gameObj;
    },

    /**
     * 初始化存档
     */
    initSave() {
        let _gameData = {
            ONE_DAY: 2,
            nowTime: 0,
            areaValue: 2,
            unitAreaVolume: 10,  // 单位面积可容纳人口
            peopleValue: 10,  // 人口
            lastTime: 0,  //
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
        if (this.data[key] === undefined) {
            return (!_gameData) ? 'Error: initSave' : _gameData[key];
        }
        return this.data[key];
    },

    /**
     * 清理存档
     */
    clearSave() {
        this.data.enabled = false;
        this.updateSave();
        let _gameData = cc.sys.localStorage.getItem('gameData');
        cc.sys.localStorage.setItem('gameData.bac', _gameData);
        cc.sys.localStorage.removeItem('gameData');
        cc.director.loadScene('main');
    },

    /**
     * 复原存档（至上次清理前）
     */
    restoreSave() {
        this.data.enabled = false;
        this.updateSave();
        let _gameData = cc.sys.localStorage.getItem('gameData.bac');
        cc.sys.localStorage.setItem('gameData', _gameData);
        cc.director.loadScene('main');
    },
};

module.exports = storage;
