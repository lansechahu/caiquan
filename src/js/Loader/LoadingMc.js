/*
* loading界面
* */

import * as PIXI from 'pixi.js';
import * as PixiUtils from 'chc-pixi-utils';
import EventEmitter from 'eventemitter3';

export default class Scene extends PIXI.Sprite {
    constructor(__root) {
        super();
        EventEmitter.call(this);

        this.root = __root;
        this.init();
    }

    get wid() {
        return 640;
    }

    get hei() {
        return 1258;
    }

    init() {
        this.logo = PixiUtils.CSprite('myIcon', 'fromFrame');
    }

    begin() {
        this.addChild(this.logo);
        this.logo.x = this.wid / 2 - this.logo.width / 2;
        this.logo.y = this.hei / 2 - this.logo.height / 2 - 100;

        this.text = new PIXI.Text('100%', {fontSize: 36, align: 'center'});
        this.addChild(this.text);
        this.text.x = this.wid / 2 - this.text.width / 2;
        this.text.y = this.logo.y + this.logo.height + 50;
    }
}