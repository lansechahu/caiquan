/*
单人游戏
 */

import * as PixiUtils from 'chc-pixi-utils';
import Scene from './Scene.js';
import Blood from './Blood';
import Card from './Card';
import {configArr} from '../Config';


export default class SingleGame extends Scene {
    init(__arr) {
        this.GAME_OVER = 'game_over'; //游戏结束事件

        this.bg = PixiUtils.CdrawRect(this.wid, this.hei, {fillColor: 0xc5dfff});

        this.isClick = true;
        this.round = 5; //回合数

        //玩家卡牌位置数组
        let cardPositionArr = [
            {x: 115, y: 0},
            {x: 320, y: 0},
            {x: 526, y: 0},
            {x: 211, y: 220},
            {x: 430, y: 220}
        ];
        //玩家卡牌数组
        this.cardArr = [];

        let style = new PIXI.TextStyle({
            fontSize: 36,
            fontWeight: 'bold',
            fill: '#000000'
        });

        //中间线
        this.line = new PIXI.Graphics();
        this.line.lineStyle(2, 0xffffff, 1);
        this.line.moveTo(0, 0);
        this.line.lineTo(this.wid - 200, 0);

        //电脑UI
        this.com_ok = false; //电脑已准备好
        this.com_name = new PIXI.Text('电脑：', style);
        this.com_blood = new Blood();
        this.com_blood.init();
        //电脑卡牌组
        this.com_cardArr = getComCardArr();
        this.com_card = null; //电脑已选卡牌

        //玩家UI
        this.user_ok = false; //玩家已准备好
        this.user_name = new PIXI.Text('玩家：', style);
        this.user_blood = new Blood();
        this.user_blood.init();
        this.user_card = null; //玩家已选卡牌

        //玩家卡牌
        console.log(__arr);
        for (let i = 0; i < cardPositionArr.length; i++) {
            let temp = new Card();
            let __value = __arr[i];
            console.log(__value);
            temp.init(getCard(__value));
            temp.id = i;
            temp.x = (this.wid / 5) * i + temp.wid / 2;
            this.cardArr.push(temp);
        }

        //玩家出牌虚框
        this.kuang = getKuang();
        //电脑出牌虚框
        this.com_kuang = getKuang();

        //选定按钮
        this.btn = PixiUtils.CBtnText('选 定', 120, 60, {
            lineWeight: 2,
            lineColor: '0x000000',
            lineAlpha: 1,
            fillAlpha: 0,
            fontSize: 24,
            align: 'center'
        });

        super.init(); //再执行父类的init()
    }

    get wid() {
        return 640;
    }

    get hei() {
        return 1338;
    }

    begin() {
        this.addChild(this.bg);

        //中间线
        this.addChild(this.line);
        this.line.x = this.wid / 2 - this.line.width / 2;
        this.line.y = this.hei * 0.3 - this.y;

        //电脑UI
        this.addChild(this.com_name);
        this.com_name.x = 20;
        this.com_name.y = 0 - this.y + 30;
        this.addChild(this.com_blood);
        this.com_blood.begin();
        this.com_blood.x = this.com_name.x + this.com_name.width / 2 - 20;
        this.com_blood.y = this.com_name.y + this.com_name.height + 30;
        //电脑虚框
        this.addChild(this.com_kuang);
        this.com_kuang.x = this.wid / 2;
        this.com_kuang.y = (this.line.y - this.com_name.y) / 2 + this.com_name.y;
        //电脑出牌
        this.comSelectCard();

        //出示卡牌与中间线的间距
        this.lineDis = this.line.y - this.com_kuang.y;

        //玩家UI
        this.addChild(this.user_name);
        this.user_name.x = 20;
        this.user_name.y = this.line.y + 30;
        this.addChild(this.user_blood);
        this.user_blood.begin();
        this.user_blood.x = this.user_name.x + this.user_name.width / 2 - 20;
        this.user_blood.y = this.user_name.y + this.user_name.height + 30;

        //玩家出牌虚框
        this.addChild(this.kuang);
        this.kuang.x = this.wid / 2;
        this.kuang.y = this.line.y + this.lineDis;

        //玩家卡牌
        for (let i = 0; i < this.cardArr.length; i++) {
            let temp = this.cardArr[i];
            this.addChild(temp);
            temp.begin();
            temp.y = this.hei - temp.hei / 2 + this.y - 50;
            temp.initPos = {x: temp.x, y: temp.y};
            temp.isSelect = false;
            temp.interactive = true;
            temp.on('pointerdown', () => {
                if (this.user_ok || this.isClick == false) return;
                this.isClick = false;
                this.selectCard(temp);
            });
        }

        //选定按钮
        this.addChild(this.btn);
        this.btn.x = (this.wid - this.kuang.x - this.kuang.width / 2) / 2 - this.btn.width / 2 + this.kuang.x + this.kuang.width / 2;
        this.btn.y = this.kuang.y;
        this.btn.visible = false;
        this.btn.on('pointerdown', () => {
            this.btn.visible = false;
            this.user_ok = true;
            this.game_play(); //进行判断
        });

        //监听血条
        this.com_blood.on(this.com_blood.SUBOVER, () => {
            bloodSubOver.call(this)
        });
        this.user_blood.on(this.com_blood.SUBOVER, () => {
            bloodSubOver.call(this)
        });
        this.com_blood.on(this.com_blood.MYDEAD, () => {
            gameover.call(this)
        });
        this.user_blood.on(this.com_blood.MYDEAD, () => {
            gameover.call(this)
        });

        this.emit(this.SCENE_IN);
        this._isSceneIn = true;
    }

    //玩家选择了卡牌
    selectCard(__card) {
        if (this.user_card == __card) {
            //如果点击的是已出的牌，则已出的牌回去
            TweenMax.to(this.user_card, 0.3, {
                x: this.user_card.initPos.x, y: this.user_card.initPos.y, onComplete: () => {
                    this.isClick = true;
                }
            });
            this.user_card = null;
            this.btn.visible = false; //确认按钮消失
        } else {
            //已出的牌回去，选中的牌出去
            if (this.user_card) {
                TweenMax.to(this.user_card, 0.3, {
                    x: this.user_card.initPos.x, y: this.user_card.initPos.y
                });
                this.user_card = null;
            }
            TweenMax.to(__card, 0.3, {
                x: this.kuang.x, y: this.kuang.y, onComplete: () => {
                    this.isClick = true;
                    this.user_card = __card;
                }
            });

            this.btn.visible = true; //确认按钮出现
        }
    }

    //电脑出牌
    comSelectCard() {
        let __time = Math.random() * 1;
        setTimeout(() => {
            let __index = Math.floor(Math.random() * this.com_cardArr.length);
            let obj = this.com_cardArr.splice(__index, 1)[0];
            console.log(obj);
            this.com_card = new Card();
            this.com_card.init(obj);
            this.addChild(this.com_card);
            this.com_card.x = Math.random() * this.wid;
            this.com_card.y = -this.com_card.hei - this.y;
            this.com_card.begin();
            this.com_card.showBack(); //显示背面
            //改变虚框和卡牌的层级
            /*this.removeChild(this.com_kuang);
            this.addChild(this.com_kuang);*/

            TweenMax.to(this.com_card, 0.3, {
                x: this.com_kuang.x, y: this.com_kuang.y, onComplete: () => {
                    this.com_ok = true;
                    this.game_play(); //进行判断
                }
            });

        }, __time * 1000);
    }

    //进行判断
    game_play() {
        if (this.com_ok && this.user_ok) {
            TweenMax.to(this.com_card.scale, 0.3, {
                x: 1.5, y: 1.5
            });
            TweenMax.to(this.com_card.scale, 0.1, {
                x: 1, y: 1, delay: 0.3
            });
            setTimeout(() => {
                this.com_card.fanCard();
                judge.call(this);
            }, 350);
        }
    }

    out() {
        super.out();
    }


    //Scene类update方法执行的方法，在这里自定义逐帧内容
    updateFun() {
        //console.log('33333');
    }
}

//血条减少完成
function bloodSubOver() {
    TweenMax.to(this.com_card, 0.5, {x: -this.com_card.wid, ease: Expo.easeIn, delay: 0.5});
    TweenMax.to(this.user_card, 0.5, {x: this.wid + this.user_card.wid, ease: Expo.easeIn, delay: 0.5});
    this.round--;
    setTimeout(() => {
        this.removeChild(this.com_card);
        this.com_card = null;
        this.removeChild(this.user_card);
        this.user_card = null;

        if (this.round <= 0) {
            console.log('游戏结束，判断谁赢');
            gameover.call(this);
        } else {
            this.com_ok = false;
            this.user_ok = false;
            this.isClick = true;
            this.comSelectCard();
        }
    }, 1000);
}

//游戏结束，判断谁赢
function gameover() {
    let type = 0; //结果类型，0是电脑赢，1是玩家赢，2是平局
    if (this.com_blood.bloodNum > this.user_blood.bloodNum) {
        console.log('电脑赢');
        type = 0;
    } else if (this.com_blood.bloodNum < this.user_blood.bloodNum) {
        console.log('玩家赢');
        type = 1;
    } else if (this.com_blood.bloodNum == this.user_blood.bloodNum) {
        console.log('平局');
        type = 2;
    }

    this.emit(this.GAME_OVER, type);
}

//判断
function judge() {
    switch (getWin(this.com_card.value, this.user_card.value)) {
        case 0:
            //console.log('电脑赢');
            this.user_blood.subtract();
            break;
        case 1:
            //console.log('玩家赢');
            this.com_blood.subtract();
            break;
        case 2:
            //console.log('平局');
            bloodSubOver.call(this);
            break;
    }
}

//判断逻辑,0是a大于b，1是a小于b，2是a等于b
function getWin(a, b) {
    let cc = a - b;
    if (cc == 0) {
        return 2;
    } else if (cc == -2) {
        return 0;
    } else if (cc == 2) {
        return 1;
    } else if (cc < 0) {
        return 1;
    } else if (cc > 0) {
        return 0;
    }
}

function getKuang() {
    let kuang = PixiUtils.dashLineRect(8, 3, 132, 207, {
        lineWeight: 2,
        lineColor: '0x000000'
    });
    kuang.pivot = {x: 132 / 2, y: 207 / 2};

    return kuang;
}

//获取电脑卡牌组
function getComCardArr() {
    let arr = [];
    for (let i = 0; i < 5; i++) {
        let ran = Math.floor(Math.random() * 3);
        let obj = configArr[ran];
        arr.push(obj);
    }

    return arr;
}

//根据卡牌的值选取卡牌
function getCard(__value) {
    let obj;
    for (let i = 0; i < configArr.length; i++) {
        if (configArr[i].value == __value) {
            obj = configArr[i];
        }
        console.log(configArr[i]);
    }
    return obj;
}