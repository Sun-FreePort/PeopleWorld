
var ScienceData = require('./lib/ScienceData');

cc.Class({
    extends: cc.Component,

    properties: {
        graphics: {
            default: null,
            type: cc.Graphics,
        },
        preScience: {
            default: null,
            type: cc.Prefab,
        },
        preScienceImgs: {
            default: [],
            type: cc.SpriteFrame,
        },
        sciencePosition: {
            default: [],
            type:cc.Vec2,
        },
        prefabUuids: new Array(),
        finishColor: cc.Color, // 完成后的线条颜色
        continueColor: cc.Color, //正在进行中的线条颜色
        scienceData: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.verticalLine();
        //初始化数据
        this.scienceData = new ScienceData();
        this.scienceData.initPosition(this.sciencePosition);

        this.addScience();
    },

    // start () {},

    // update (dt) {},

    /**
     * 绘制主干竖线
     * @return null
     */
    verticalLine () {
        //TODO
    },

    /**
     * 科技prefab
     * @param Obj (cc.v2) 坐标
     * @param Obj (cc.v2) 缩放
     * @param Obj (SpriteFram) 科技预制件图片
     * @return Obj 科技的预制件
     */
    generatePreScience (p = cc.v2(0, 0), s = cc.v2(1, 1), img = null) {
        let science = cc.instantiate(this.preScience);
        if (img) {
            science.getComponent(cc.Sprite).spriteFrame = img;
        }
        science.setPosition(p);
        science.setScale(s);
        return science;
    },

    /**
     * 添加科技
     * @return null
     */
    addScience () {
        for (let key in this.scienceData.positionInfo) {
            if (this.scienceData.positionInfo.hasOwnProperty(key)) {
                let pV2 = this.scienceData.positionInfo[key]['p'];
                let preImgUrl = '';
                if (this.scienceData.positionInfo[key]['on_off'] == 0) {
                    preImgUrl = this.preScienceImgs[0];
                } else {
                    preImgUrl = this.preScienceImgs[2];
                }

                let node = this.generatePreScience(pV2, cc.v2(0.5, 0.5), preImgUrl);
                this.scienceData.positionInfo[key]['uuid'] = node.uuid;
                this.prefabUuids.push(node.uuid);
                this.node.addChild(node);
                //添加鼠标点击事件
                node.on(cc.Node.EventType.TOUCH_END, this.onCallBack, this);
                //初始化连线
                if (key - 1 < 0) {
                    continue;
                }
                this.initLine(this.scienceData.positionInfo[key]);
            }
        }
    },

    /**
     * 绘制线条
     * @param String 线条颜色
     * @param Int 开始坐标X
     * @param Int 开始坐标Y
     * @param Int 结束坐标X
     * @param Int 结束坐标Y
     * @return null
     */
    drawLine (color, fromX, fromY, toX, toY) {
        this.graphics.lineWidth = 2;
        this.graphics.strokeColor.setR(color.getR());
        this.graphics.strokeColor.setG(color.getG());
        this.graphics.strokeColor.setB(color.getB());
        this.graphics.strokeColor.setA(color.getA());
        this.graphics.moveTo(fromX, fromY);
        this.graphics.lineTo(toX, toY);
        this.graphics.stroke();
    },

    //回调方法
    onCallBack (event) {
        //阻止冒泡
        event.stopPropagationImmediate();
        let uuid = event.target.uuid;
        for (const key in this.scienceData.positionInfo) {
            if (this.scienceData.positionInfo[key].uuid == uuid) {
                this.scienceData.positionInfo[key].on_off = 1;
                for (const k in this.scienceData.positionInfo) {
                    if (this.scienceData.positionInfo.hasOwnProperty(k)) {
                        if (this.scienceData.positionInfo[key].parentn == this.scienceData.positionInfo[k].n) {
                            this.drawLine(this.finishColor, 
                            this.scienceData.positionInfo[key].p.x,
                            this.scienceData.positionInfo[key].p.y,
                            this.scienceData.positionInfo[k].p.x,
                            this.scienceData.positionInfo[k].p.y);
                        }
                    }
                }
                break;
            }
        }
    },
    
    /**
     * 初始化技能连线
     * @param {object} position 
     */
    initLine (position) {
        for (let key in this.scienceData.positionInfo) {
            if (this.scienceData.positionInfo.hasOwnProperty(key) 
            && (this.scienceData.positionInfo[key].n == position.parentn)) {
                if (position.on_off == 1 && this.scienceData.positionInfo[key].on_off == 1) {
                    this.drawLine(this.finishColor, position.p.x, position.p.y, 
                                this.scienceData.positionInfo[key].p.x, 
                                this.scienceData.positionInfo[key].p.y);
                }
                break;
            }
        }
    }
});
