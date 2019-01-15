/*
卡牌
 */
import * as PIXI from 'pixi.js';
import * as PixiUtils from 'chc-pixi-utils';
import EventEmitter from 'eventemitter3';
import {TweenMax} from 'gsap/TweenMax';

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
        this.value = __obj.value;
        this.bg = PixiUtils.CdrawRect(this.wid, this.hei, {
            lineWeight: 2,
            lineColor: '0xfff000',
            lineAlpha: 1,
            fillColor: '0xffffff'
        });

        //背面
        /*this.back = PixiUtils.CdrawRect(this.wid, this.hei, {
            lineWeight: 2,
            lineColor: '0xfff000',
            lineAlpha: 1,
            fillColor: '0xfe3242'
        });*/
        this.back = PixiUtils.CSprite('card_bg', 'fromFrame');
        this.back.alpha = 0;

        const fontStyle = new PIXI.TextStyle({
            fontSize: 36,
            fill: '0x000000'
        });

        this.txt = new PIXI.Text(this.name, fontStyle);
    }

    begin() {
        this.addChild(this.bg);
        this.bg.x = -this.bg.width / 2;
        this.bg.y = -this.bg.height / 2;
        this.addChild(this.txt);
        this.txt.x = -this.txt.width / 2;
        this.txt.y = -this.txt.height / 2;
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
    }
}