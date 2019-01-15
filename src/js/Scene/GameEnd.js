import * as PixiUtils from 'chc-pixi-utils';
import Scene from './Scene.js';

export default class Scene1 extends Scene {
    init(__type) {
        this.REPLAY = 'replay';

        this.bg = PixiUtils.CdrawRect(this.wid, this.hei, {fillColor: '0x000000', fillAlpha: 0.6});

        let str = '';
        switch (__type) {
            case 0:
                str = '电 脑 获 胜';
                break;
            case 1:
                str = '玩 家 获 胜';
                break;
            case 2:
                str = '平 局';
                break;
        }

        this.content = new PIXI.Container();

        let style = new PIXI.TextStyle({
            fontSize: 48,
            fontWeight: 'bold',
            fill: '#ffffff'
        });

        this.txt = new PIXI.Text(str, style);

        this.replayBtn = PixiUtils.CBtnText('再玩一次', 150, 60, {
            lineWeight: 2,
            lineColor: '0x000000',
            lineAlpha: 1,
            fillAlpha: 0,
            fontSize: 24,
            align: 'center'
        });
    }

    begin() {
        this.addChild(this.bg);
        this.addChild(this.content);

        this.content.addChild(this.txt);
        this.content.addChild(this.replayBtn);
        this.replayBtn.x = (this.txt.x + this.txt.width) / 2 - this.replayBtn.width / 2;
        this.replayBtn.y = this.txt.y + this.txt.height + 30;

        this.content.x = this.wid / 2 - this.content.width / 2;
        this.content.y = this.hei / 2 - this.content.height / 2;

        this.replayBtn.on('pointerdown', () => {
            this.emit(this.REPLAY);
        });
    }

    get wid() {
        return 640;
    }

    get hei() {
        return 1386;
    }
}