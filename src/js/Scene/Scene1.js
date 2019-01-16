import * as PixiUtils from 'chc-pixi-utils';
import Scene from './Scene.js';

export default class Scene1 extends Scene {

    init() {
        this.SINGLE = 'single';
        this.DOUBLE = 'double';

        this.bg = PixiUtils.CdrawRect(this.wid, this.hei, {fillColor: 0x293c55});

        this.box = new PIXI.Container();

        this.singleBtn = PixiUtils.CBtnText('单人游戏', 200, 80, {
            lineWeight: 5,
            lineColor: '0xa9334c',
            lineAlpha: 1,
            fillAlpha: 1,
            fillColor:'0x0e151f',
            fontColor:'0xffffff',
            fontSize: 24,
            align: 'center'
        });
        this.singleBtn.x = this.wid / 2 - this.singleBtn.width / 2;
        this.singleBtn.initY = 0;
        this.singleBtn.y = this.singleBtn.initY + 80;
        this.singleBtn.alpha = 0;

        this.doubleBtn = PixiUtils.CBtnText('双人游戏', 200, 80, {
            lineWeight: 5,
            lineColor: '0xa9334c',
            lineAlpha: 1,
            fillAlpha: 1,
            fillColor:'0x0e151f',
            fontColor:'0xffffff',
            fontSize: 24,
            align: 'center'
        });

        this.doubleBtn.x = this.wid / 2 - this.doubleBtn.width / 2;
        this.doubleBtn.initY = this.singleBtn.initY + this.singleBtn.height + 50;
        this.doubleBtn.y = this.doubleBtn.initY + 80;
        this.doubleBtn.alpha = 0;

        this.gameType = null;

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
        this.addChild(this.box);

        this.box.addChild(this.singleBtn);
        this.box.addChild(this.doubleBtn);
        this.box.y = this.hei / 2 - this.box.height / 2;

        TweenMax.to(this.singleBtn, 0.5, {y: this.singleBtn.initY, alpha: 1});
        this.singleBtn.on('pointerdown', () => {
            this.gameType = 0;
            this.out();
        });

        TweenMax.to(this.doubleBtn, 0.5, {y: this.doubleBtn.initY, alpha: 1});
        this.doubleBtn.on('pointerdown', () => {
            this.gameType = 1;
            this.out();
        });

        this.emit(this.SCENE_IN);
        this._isSceneIn = true;
    }

    out() {
        TweenMax.to(this.doubleBtn, 0.3, {alpha: 0, y: this.doubleBtn.initY + 80});
        TweenMax.to(this.singleBtn, 0.3, {
            alpha: 0, y: this.singleBtn.initY + 80, onComplete: () => {
                if (this.gameType == 0) {
                    this.emit(this.SINGLE);
                } else {
                    this.emit(this.DOUBLE);
                }
            }
        });
        super.out();
    }


    //Scene类update方法执行的方法，在这里自定义逐帧内容
    updateFun() {
        //console.log('33333');
    }
}

