
var ScienceData = require('./lib/ScienceData');
window.scienceObj = null;
var gProNode = null;
window.proWidth = 0;
window.time = 0;

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
        progressM: 0,
        proNode: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //初始化数据
        // this.scienceData = new ScienceData();
        // this.scienceData.initPosition(this.sciencePosition);
        window.scienceObj = null;
        window.scienceObj = new ScienceData();
        window.scienceObj.initPosition(this.sciencePosition);
        this.progressM = 0;

        //预加载资源
        this.loaderRes();
    },

    start () {
        this.initProgress();
    },

    update (dt) {
        this.progressBar();
        window.scienceObj.saveConfig();
    },
    /**
     * 进度条加载完以后执行回调
     * @return void
     */
    progressBar () {
        let progress = this.proCount();
        if (progress == 0) {
            return;
        }
        this.node.getChildByName('progressBar').getComponent(cc.ProgressBar).progress = progress;
        if (this.node.getChildByName('progressBar').getComponent(cc.ProgressBar).progress  >= 1) {
            this.node.getChildByName('progressBar').getComponent(cc.ProgressBar).progress = 0;
            this.progressCallBack();
            this.progressM = 0;
        }
    },

    /**
     * 当前进度条走的进度
     */
    proCount () {
        if (window.proWidth > 0) {
            return window.time / window.proWidth;
        } else {
            return 0;
        }

    },
    
    /**
     * 初始化进度条
     */
    initProgress () {
        let progressWidth = 0;
        this.node.getChildByName('progressBar').getComponent(cc.ProgressBar).progress = progressWidth;// 初始化进度条
    },

    /**
     * 走进度条
     * @param {Number} researchNode 
     * @return boole;
     */
    researching (researchNode) {
        if (window.proWidth) {
            return false;
        }
        window.proWidth = researchNode.time;
        var funUp = function () {
            window.time ++;
            if (window.time > window.proWidth) {
                window.clearInterval(interval);
            }
        }

        var interval = window.setInterval(funUp, 1000);
        return true;
    },

    /**
     * 进度条走完以后的回调
     */
    progressCallBack () {
        let scienceDate = window.scienceObj.positionInfo;
        for (let key in scienceDate) {
            const element = scienceDate[key];
            if (element.status == 3) {
                let node = this.node.getChildByUuid(element.uuid);
                let researchAni = node.getChildByName('Background').getComponent(cc.Animation);
                researchAni.stop();
                node.getChildByName('Background').getComponent(cc.Sprite).spriteFrame = this.researchSpriteFrame(4);
                window.time = 0;
                window.proWidth = 0;
                window.scienceObj.positionInfo[key].status = 4;
            }
        }
    },

    /**
     * 加载资源
     */
    loaderRes () {
        let imgs = [
            'img/static/scienceTree/research_not',
            'img/static/scienceTree/research_will',
            'img/static/scienceTree/researching_small',
            'img/static/scienceTree/researching_big',
            'img/static/scienceTree/researched',
        ];
        cc.loader.loadResArray(imgs, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            //添加科技节点
            this.addScience();
            this.initLine();
        }.bind(this));
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
            science.getChildByName('Background').getComponent(cc.Sprite).spriteFrame = img;
        }
        science.setPosition(p);
        science.setScale(s);
        return science;
    },

    /**
     * 根据科技状态返回对应的spriteFrame
     * @param {int} status
     * @return obj 
     */
    researchSpriteFrame (status) {
        let resSprite = cc.loader.getRes('img/static/scienceTree/research_not', cc.SpriteFrame);
        switch (status) {
            case 2 :
                resSprite = cc.loader.getRes('img/static/scienceTree/research_will', cc.SpriteFrame);
                break;
            case 4 :
                resSprite = cc.loader.getRes('img/static/scienceTree/researched', cc.SpriteFrame);
                break;
            case 3 : ;
            case 1 : ;
            defalue :
                break;
        }
        return resSprite;
    },

    /**
     * 添加科技
     * @return null
     */
    addScience () {
        for (let key in window.scienceObj.positionInfo) {
            if (window.scienceObj.positionInfo.hasOwnProperty(key)) {
                let pV2 = window.scienceObj.positionInfo[key]['p'];
                let preImgUrl = this.researchSpriteFrame(window.scienceObj.positionInfo[key]['status']);
                let node = this.generatePreScience(pV2, cc.v2(1, 1), preImgUrl);
                node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label).string = window.scienceObj.positionInfo[key]['title'];
                window.scienceObj.positionInfo[key]['uuid'] = node.uuid;
                this.prefabUuids.push(node.uuid);
                this.node.addChild(node);
                if (window.scienceObj.positionInfo[key].status == 3) {
                    this.animationPlay(node);
                }
                //添加鼠标点击事件
                node.on(cc.Node.EventType.TOUCH_END, this.onCallBack, this);
                //初始化连线
                if (key - 1 < 0) {
                    continue;
                }
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
        this.graphics.lineWidth = 5;
        this.graphics.strokeColor.setR(color.getR());
        this.graphics.strokeColor.setG(color.getG());
        this.graphics.strokeColor.setB(color.getB());
        this.graphics.strokeColor.setA(color.getA());
        this.graphics.moveTo(fromX, fromY);
        this.graphics.lineTo(toX, toY);
        this.graphics.stroke();
    },

    /**
     * 控制动画
     * @param {obj} ani 
     * @param {string} type 
     */
    animationPlay (ani, type) {
        let researchAni = ani.getChildByName('Background').getComponent(cc.Animation);
        researchAni.play("researching");
    },

    //回调方法
    onCallBack (event) {
        //阻止冒泡
        event.stopPropagationImmediate();
        let uuid = event.target.uuid;
        for (const key in window.scienceObj.positionInfo) {
            if (window.scienceObj.positionInfo[key].uuid == uuid) {
                if (window.scienceObj.positionInfo[key].status != 2) {
                    break;
                }
                for (const k in window.scienceObj.positionInfo) {
                    if (window.scienceObj.positionInfo.hasOwnProperty(k)) {
                        if ((window.scienceObj.positionInfo[key].parentn == -1)
                            || window.scienceObj.positionInfo[key].parentn == window.scienceObj.positionInfo[k].n) {

                            //判断上一级节点是否激活，如果没有激活当前节点不允许激活
                            if ((window.scienceObj.positionInfo[k].status < 3) 
                                && (window.scienceObj.positionInfo[key].parentn != -1)) {
                                break;
                            }

                            let proNode = this.node.getChildByUuid(uuid);
                            let sign = this.researching(window.scienceObj.positionInfo[key]);
                            if (sign) {
                                this.animationPlay(proNode);
                                window.scienceObj.positionInfo[key].status = 3;
                            } 
                        }
                    }
                }
                break;
            }
        }
    },

    /**
     * 初始化技能连线
     */
    initLine () {
        //清楚科技线条
        this.graphics.clear();
        for (let key in window.scienceObj.positionInfo) {
            let element1 = window.scienceObj.positionInfo[key];

            for (let k in window.scienceObj.positionInfo) {
                let element2 = window.scienceObj.positionInfo[k];
                if ((element1.parentn != -1)&& (element2.n == element1.parentn)) {
                    this.drawLine(this.finishColor, element1.p.x, element1.p.y, element2.p.x, element2.p.y);
                }
            }
        }
    }
});
