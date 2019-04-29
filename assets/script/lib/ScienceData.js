"use strict";

var Class = require('./generateClass');
var LocalStorageApi = require('./LocalStorageApi');
var ScienceData = Class({
    extends: LocalStorageApi,
    data: {
        configKey: 'scienceDate',
        positionInfo: new Array(),
        _configP: new Array({
            uuid:'',
            p: null,
            n: 0,
            parentn: -1,
            status: 4, //1:不能研发，2:可以研发，3:研发中，4:研发完成
            time: 10,
            title: '金融',
        },{
            uuid:'',
            p: null,
            n: 1,
            parentn: 0,
            status: 2,
            time: 15,
            title: '代币化',
        },{
            uuid:'',
            p: null,
            n: 2,
            parentn: 1,
            status: 2, 
            time: 20,
            title: '自由枷锁',
        },{
            uuid:'',
            p: null,
            n: 3,
            parentn: 2,
            status: 2, 
            time: 20,
            title: '抵御通胀',
        },{
            uuid:'',
            p: null,
            n: 4,
            parentn: 2,
            status: 2, 
            time: 20,
            title: '公平税收',
        },{
            uuid:'',
            p: null,
            n: 5,
            parentn: 2,
            status: 2, 
            time: 20,
            title: '商业税收',
        }),
    },

    /**
     * 初始化坐标，非第一次打开不需要初始化
     * @param {object} positionObj 坐标集合
     * @return null
     */
    initPosition (positionObj) {
        this.positionInfo = [];
        if (this.getValue(this.configKey)) {
            let tempValue = this.getValueObj(this.configKey);
            for (let key in tempValue) {
                if (tempValue.hasOwnProperty(key)) {
                    this.positionInfo.push(tempValue[key]);
                }
            }
            // cc.log(this.positionInfo);
            return;
        }
        try {
            for (let key in this._configP) {
                if (this._configP.hasOwnProperty(key)) {
                    let p = positionObj[this._configP[key].n] 
                                        ? positionObj[this._configP[key].n] 
                                        : null;
                    let tempObj = {
                        uuid:this._configP[key].uuid,
                        p: p,
                        n: this._configP[key].n,
                        parentn: this._configP[key].parentn,
                        status: this._configP[key].status,
                        time: this._configP[key].time,
                        title: this._configP[key].title,
                    };
                    this.positionInfo.push(tempObj);
                }
            }
        } catch (error) {
            cc.log(error);
        }
        this.saveConfig();
    },

    /**
     * 把科技数据存到本地
     * @param {Array} config 坐标数据 
     * @return null
     */
    saveConfig () {
        this.setValueObj(this.configKey, this.positionInfo);
    },

    updatePosition () {
        //TODO
    },

    /**
     * 判断科技是否允许点亮
     */
    judge () {
        //TODO
    },
});

module.exports = ScienceData;
