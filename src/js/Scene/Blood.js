/*
生命值
 */

import * as PIXI from 'pixi.js';
import * as PixiUtils from 'chc-pixi-utils';
import EventEmitter from 'eventemitter3';

export default class Scene extends PIXI.Sprite {
    constructor() {
        super();
        EventEmitter.call(this);
    }

    init() {
        this.MYDEAD = 'my_dead'; //该玩家死了
        this.SUBOVER = 'sub_over'; //减血完毕

        this.bloodNum = 3; //血量
        this.bloodBorder = []; //血槽框数组
        this.bloodArr = []; //血槽数组

        for (let i = 0; i < this.bloodNum; i++) {

            let tempBorder = new PIXI.Graphics();
            tempBorder.lineStyle(2, 0xff0000, 1);
            tempBorder.drawCircle(0, 0, 20);

            let temp = PixiUtils.CdrawCircle(20, {
                fillColor: '0xff0000'
            });

            this.bloodBorder.push(tempBorder);
            this.bloodArr.push(temp);

            tempBorder.x = 0;
            tempBorder.y = 50 * i + tempBorder.height / 2;
            temp.x = tempBorder.x;
            temp.y = tempBorder.y;
        }
    }

    begin() {
        for (let i = 0; i < this.bloodNum; i++) {
            this.addChild(this.bloodBorder[i]);
            this.addChild(this.bloodArr[i]);
        }
    }

    subtract() {
        this.bloodNum--;
        let temp = this.bloodArr[this.bloodNum];
        TweenMax.to(temp, 0.5, {alpha: 0});
        TweenMax.to(temp.scale, 0.5, {
            x: 2, y: 2, onComplete: () => {
                if (this.bloodNum <= 0) {
                    console.log('游戏结束');
                    this.emit(this.MYDEAD);
                } else {
                    this.emit(this.SUBOVER);
                }
            }
        });
    }
}