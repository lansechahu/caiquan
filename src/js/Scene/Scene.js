/*
* 场景父类
* */

import * as PIXI from 'pixi.js';
import * as PixiUtils from 'chc-pixi-utils';
import EventEmitter from 'eventemitter3';
import {TweenMax} from 'gsap/TweenMax';

export default class Scene extends PIXI.Sprite {
    constructor(__root) {
        super();
        EventEmitter.call(this);
        this.SCENE_IN = 'scene_in';
        this.SCENE_OUT = 'scene_out';

        this.root = __root;
        this._isSceneIn = false;
    }

    init() {
        //console.log('11111');
    }

    begin() {

    }

    out() {
        this.emit(this.SCENE_OUT);
    }

    update() {
        if (!this._isSceneIn) return;
        this.updateFun();
    }

    updateFun() {

    }
}

