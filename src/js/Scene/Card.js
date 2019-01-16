/*
卡牌
 */
import * as PIXI from 'pixi.js';
import * as PixiUtils from 'chc-pixi-utils';
import EventEmitter from 'eventemitter3';
import {TweenMax} from 'gsap/TweenMax';

import * as filters from 'pixi-filters';

export default class Scene extends PIXI.Sprite {
    constructor() {
        super();
        EventEmitter.call(this);
    }

    get wid() {
        return 132;
    }

    get hei() {
        return 207;
    }

    init(__obj) {
        this.name = __obj.name;
        this.src = __obj.src;
        this.value = __obj.value;

        this.content = new PIXI.Container();

        this.bg = PixiUtils.CdrawRect(this.wid, this.hei, {
            lineWeight: 2,
            lineColor: '0xfff000',
            lineAlpha: 1,
            fillColor: '0xffffff'
        });

        const filter = new filters.DropShadowFilter({
            color: '0xf6514d',
            rotation: 0,
            blur: 10,
            quality: 5
        });
        this.bg.filters = [filter];

        //背面
        /*this.back = PixiUtils.CdrawRect(this.wid, this.hei, {
            lineWeight: 2,
            lineColor: '0xfff000',
            lineAlpha: 1,
            fillColor: '0xfe3242'
        });*/
        this.back = PixiUtils.CSprite('card_bg.jpg', 'fromFrame');
        this.back.alpha = 0;

        this.card = PixiUtils.CSprite(this.src, 'fromFrame');

        /*const fontStyle = new PIXI.TextStyle({
            fontSize: 36,
            fill: '0x000000'
        });

        this.txt = new PIXI.Text(this.name, fontStyle);*/
    }

    begin() {
        this.addChild(this.content);
        this.addChild(this.bg);
        this.bg.x = -this.bg.width / 2;
        this.bg.y = -this.bg.height / 2;
        this.addChild(this.card);
        this.card.x = -this.card.width / 2;
        this.card.y = -this.card.height / 2;
        this.addChild(this.back);
        this.back.x = -this.back.width / 2;
        this.back.y = -this.back.height / 2;
    }

    //显示背面
    showBack() {
        this.back.alpha = 1;
    }

    //翻牌
    fanCard() {
        this.back.alpha = 0;
        this.showFlash();
    }

    //小粒子
    showFlash() {
        //0:左，1：右，2:上，3：下
        for (let i = 0; i < 100; i++) {
            let temp = PixiUtils.CdrawCircle(2, {
                fillColor: '0xf6514d'
            });
            let rand = Math.floor(Math.random() * 4);
            let xx = 0;
            let yy = 0;
            let tx = 0;
            let ty = 0;
            switch (rand) {
                case 0:
                    //左
                    xx = this.bg.x;
                    yy = Math.random() * (this.bg.height) + this.bg.y;
                    tx = xx - (Math.random() * 30 + 15);
                    ty = yy + (Math.random() * 30 - 15);
                    break;
                case 1:
                    //右
                    xx = this.bg.x + this.bg.width;
                    yy = Math.random() * (this.bg.height) + this.bg.y;
                    tx = xx + (Math.random() * 30 + 15);
                    ty = yy + (Math.random() * 30 - 15);
                    break;
                case 2:
                    //上
                    xx = Math.random() * this.bg.width + this.bg.x;
                    yy = this.bg.y;
                    tx = xx + (Math.random() * 30 - 15);
                    ty = yy - (Math.random() * 30 + 15);
                    break;
                case 3:
                    //下
                    xx = Math.random() * this.bg.width + this.bg.x;
                    yy = this.bg.y + this.bg.height;
                    tx = xx + (Math.random() * 30 - 15);
                    ty = yy + (Math.random() * 30 + 15);
                    break;
            }

            temp.x = xx;
            temp.y = yy;
            this.content.addChild(temp);
            temp.alpha = 0.6;
            TweenMax.to(temp, 0.8, {
                x: tx, y: ty, alpha: 0, onComplete: () => {
                    this.removeChild(temp);
                }
            });
        }
    }
}