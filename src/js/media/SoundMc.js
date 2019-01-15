/*
音乐控制按钮
 */

import * as PIXI from 'pixi.js';
import * as PixiUtils from 'chc-pixi-utils';
import EventEmitter from 'eventemitter3';

export default class SoundMc extends PIXI.Sprite {
    constructor(__sound) {
        super();
        EventEmitter.call(this);

        this.sound = __sound;
        this._isSceneIn = false;
    }

    init() {
        this.mc = PixiUtils.setVideo('music_', '.png', 0, 1);
    }

    get wid() {
        return this.mc.width;
    }

    get hei() {
        return this.mc.height;
    }

    begin() {
        this.addChild(this.mc);
        this.mc.interactive = true;

        if (this.sound.isOpen) {
            PixiUtils.VideoStop(this.mc, 1, 0);
        } else {
            PixiUtils.VideoStop(this.mc, 1, 1);
        }

        this.mc.on('pointerdown', () => {
            if (this.sound.isOpen) {
                PixiUtils.VideoStop(this.mc, 1, 1);
                this.sound.pauseSound();
            } else {
                PixiUtils.VideoStop(this.mc, 1, 0);
                this.sound.playSound();
            }
        });
    }

    //静音
    mute() {
        this.sound.mute();
    }

    //恢复
    unmute() {
        this.sound.unmute();
    }
}