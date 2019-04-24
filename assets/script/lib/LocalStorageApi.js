"use strict";

var Class = require('./generateClass');

var LocalStorageApi = Class({
    setValue (key, value) {
        cc.sys.localStorage.setItem(key, value)
    },
    getValue (key) {
        return cc.sys.localStorage.getItem(key)
    },
    setValueObj (key, value) {
        cc.sys.localStorage.setItem(key, JSON.stringify(value));
    },
    getValueObj (key) {
        return JSON.parse(cc.sys.localStorage.getItem(key));
    },
    removeValue (key) {
        cc.sys.localStorage.removeItem(key)
    },
});

module.exports = LocalStorageApi;