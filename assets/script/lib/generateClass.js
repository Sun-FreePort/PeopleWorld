"use strict";

/**
 * 构造类通用方法
 * @param obj 类的方法和属性
 * @return object
 */
function Class(params) {
    var obj = function () {};
    for (let key in params) {
        if (params.hasOwnProperty(key)) {
            if (key == 'extends') {
                let o = function () {};
                o.prototype = params[key].prototype
                obj.prototype = new o();
            } else if (key == 'data') {
                for (let dataKey in params[key]) {
                    obj.prototype[dataKey] = params[key][dataKey];
                }
            } else {
                obj.prototype[key] = params[key];
            }
        }
    }
    return obj;
}

module.exports = Class;
