let storage = {
	constructor() {
		this.data = false;
	},

	init(gameObj) {
		this.data = gameObj;
	},

    initSave() {
        let _gameData = {
            ONE_DAY: 2,
            nowTime: this.getValue('nowTime', false),
            areaValue: this.getValue('areaValue', false),
            peopleValue: this.getValue('peopleValue', false),
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

        return _gameData;
    },

    updateSave() {
        let _gameData = JSON.parse(cc.sys.localStorage.getItem('gameData'));
        _gameData.ONE_DAY = 2;
        _gameData.nowTime = this.getValue('nowTime', _gameData);
        _gameData.lastTime = this.getValue('lastTime', _gameData);
        _gameData.areaValue = this.getValue('areaValue', _gameData);
        _gameData.peopleValue = this.getValue('peopleValue', _gameData);
        _gameData.monster = this.getValue('monster', _gameData);
        _gameData.people = this.getValue('people', _gameData);
        cc.sys.localStorage.setItem('gameData', JSON.stringify(_gameData));
    },

    getValue(key, _gameData) {
    	if (this.data[key] === undefined) {
    	    if (!_gameData) {
                return 'Error: initSave';
            }
    		return _gameData[key];
    	}
    	return this.data[key];
    },

    clearSave() {
    	this.data.enabled = false;
    	this.updateSave();
    	let _gameData = cc.sys.localStorage.getItem('gameData');
    	cc.sys.localStorage.setItem('gameData.bac', _gameData);
    	cc.sys.localStorage.removeItem('gameData');
    	cc.director.loadScene('main');
    },

    restoreSave() {
    	this.data.enabled = false;
    	this.updateSave();
    	let _gameData = cc.sys.localStorage.getItem('gameData.bac');
    	cc.sys.localStorage.setItem('gameData', _gameData);
    	cc.director.loadScene('main');
    },
};

module.exports = storage;
