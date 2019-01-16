import * as PixiUtils from 'chc-pixi-utils';
import Scene from './Scene.js';
import {configArr} from "../Config";
import Card from './Card';

export default class SelectCard extends Scene {

    init() {
        this.BEGIN_GAME = 'begin_game';

        this.bg = PixiUtils.CdrawRect(this.wid, this.hei, {fillColor: 0x293c55});
        this.waitBg = PixiUtils.CdrawRect(this.wid, this.hei, {fillColor: '0x000000', fillAlpha: 0.6});

        this.content = new PIXI.Container();

        let cardPositionArr = [115, 320, 526]; //待选择的三种卡牌的x轴位置

        const fontStyle = new PIXI.TextStyle({
            fontSize: 36,
            fill: '0xffffff'
        });

        this.txt = new PIXI.Text('选择五张牌出战', fontStyle);

        //虚线框的位置数组，x轴位置和距待选卡牌的y轴位置
        let dashLinePositionArr = [
            {x: 115, y: 80},
            {x: 320, y: 80},
            {x: 526, y: 80},
            {x: 211, y: 300},
            {x: 430, y: 300}
        ];

        //待选卡牌
        this.scardArr = [];
        for (let i = 0; i < cardPositionArr.length; i++) {
            let temp = new Card();
            temp.init(configArr[i]);
            temp.x = cardPositionArr[i];
            this.scardArr.push(temp);
        }

        //虚线框
        this.dashArr = [];
        for (let i = 0; i < dashLinePositionArr.length; i++) {
            let temp = getKuang();
            temp.pos = dashLinePositionArr[i];
            this.dashArr.push(temp);
        }

        this.selectArr = [null, null, null, null, null]; //已选的卡牌

        //开始游戏按钮
        this.btn = PixiUtils.CBtnText('开始游戏', 200, 80, {
            lineWeight: 5,
            lineColor: '0xa9334c',
            lineAlpha: 1,
            fillAlpha: 1,
            fillColor:'0x0e151f',
            fontColor:'0xffffff',
            fontSize: 24,
            align: 'center'
        });

        //等待提示
        this.waitTip = PixiUtils.CBtnText('等待其他玩家开始', 300, 100, {
            lineWeight: 5,
            lineColor: '0xa9334c',
            lineAlpha: 1,
            fillAlpha: 1,
            fillColor:'0x0e151f',
            fontColor:'0xffffff',
            fontSize: 24,
            align: 'center'
        });

        super.init(); //再执行父类的init()
    }

    get wid() {
        return 640;
    }

    get hei() {
        return 1258;
    }

    begin() {
        this.addChild(this.bg);
        this.addChild(this.content);

        this.content.addChild(this.txt);
        this.txt.x = this.wid / 2 - this.txt.width / 2;

        for (let i = 0; i < this.scardArr.length; i++) {
            let temp = this.scardArr[i];
            this.content.addChild(temp);
            temp.begin();
            temp.y = temp.hei / 2 + this.txt.y + this.txt.height + 30;
            temp.interactive = true;
            temp.on('pointerdown', () => {
                console.log(temp.value);
                this.selCard(i);
            });
        }

        for (let i = 0; i < this.dashArr.length; i++) {
            let temp = this.dashArr[i];
            this.content.addChild(temp);
            temp.x = temp.pos.x;
            temp.y = this.scardArr[0].y + temp.height + temp.pos.y;
        }

        this.content.addChild(this.btn);
        this.btn.x = this.wid / 2 - this.btn.width / 2;
        this.btn.y = this.dashArr[this.dashArr.length - 1].y + this.dashArr[this.dashArr.length - 1].height / 2 + 50;
        this.btn.on('pointerdown', () => {
            console.log('开始游戏');
            this.beginGame();
        });

        this.content.y = this.hei / 2 - this.content.height / 2;

        this.btn.visible = false;

        this.addChild(this.waitBg);
        this.waitBg.visible = false;
        this.addChild(this.waitTip);
        this.waitTip.x = this.wid / 2 - this.waitTip.width / 2;
        this.waitTip.y = this.hei / 2 - this.waitTip.height / 2;
        this.waitTip.visible = false;

        this.emit(this.SCENE_IN);
        this._isSceneIn = true;
    }

    selCard(__id) {
        let _index = 0;
        for (let i = 0; i < this.selectArr.length; i++) {
            if (this.selectArr[i] == null) {
                _index = i;
                joinCard.call(this);
                break;
            }
        }

        function joinCard() {
            let temp = new Card();
            temp.init(configArr[__id]);
            this.content.addChild(temp);
            temp.id = _index;
            temp.begin();
            temp.x = this.dashArr[_index].x;
            temp.y = this.dashArr[_index].y;
            this.selectArr[_index] = temp;
            this.dashArr[_index].alpha = 0;

            temp.interactive = true;
            temp.on('pointerdown', () => {
                this.content.removeChild(temp);
                this.selectArr[_index] = null;
                this.dashArr[_index].alpha = 1;
                this.showBtn();
            });

            this.showBtn();
        }

    }

    showBtn() {
        for (let i = 0; i < this.selectArr.length; i++) {
            var temp = this.selectArr[i];
            if (temp == null) {
                this.btn.visible = false;
                return;
            }
        }

        this.btn.visible = true;
    }

    beginGame() {
        var arr = [];
        for (let i = 0; i < this.selectArr.length; i++) {
            arr.push(this.selectArr[i].value);
        }
        this.emit(this.BEGIN_GAME, arr);
    }

    wait() {
        this.waitBg.visible = true;
        this.waitTip.visible = true;
    }

    out() {
        super.out();
    }


    //Scene类update方法执行的方法，在这里自定义逐帧内容
    updateFun() {
        //console.log('33333');
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