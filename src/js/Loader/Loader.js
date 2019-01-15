import * as PIXI from 'pixi.js';
import EventEmitter from 'eventemitter3';

export default class Loader extends PIXI.Sprite {
    constructor(config) {
        super();
        EventEmitter.call(this);

        this.currpg = 0;
        this.realpg = 0;
        this.loadEnd = false;

        this.easing = (config) ? config.easing || 1 : 1; //加载进度的缓冲值
        this.manifest = (config) ? config.manifest || null : null;
    }

    start() {
        if (this.manifest == null){
            this.emit('onComplete');
            return;
        }

        this.loader = new PIXI.loaders.Loader();
        this.loader.add(this.manifest);
        //loader.onProgress.add(onProgressHandler.bind(this));
        this.loader.onComplete.add(onLoaded.bind(this));
        this.loader.load();

        function onLoaded() {
            this.loadEnd = true;
            this.emit('onComplete');
            //parseSpriteSheet.call(this); //解析资源中的json数据，与对应的图片绑定
        }

        /*function parseSpriteSheet() {
            const resources = loader.resources;
            //console.log(resources);

            Object.keys(resources).forEach((key) => {
                //console.log(resources[key].loadType);
                let loadType = resources[key].loadType;
                if (loadType == 1) {
                    let texturename = resources[key].name + '_image';
                    let baseTexture = resources[texturename].texture.baseTexture;
                    let jsonData = resources[key].data;
                    let spritesheet = new PIXI.Spritesheet(baseTexture, jsonData);
                    spritesheet.parse(() => {

                    });
                }
            });

            this.emit('onComplete');
        }*/

        /*function onProgressHandler() {
            if (this.loadEnd) {
                this.realpg = 100;
                if (this.currpg >= 95) {
                    this.currpg = 100;
                }
            }

            this.realpg = loader.progress;
            this.currpg += (this.realpg - this.currpg) * this.easing;

            this.emit('onProgress', Math.floor(this.currpg));
        }*/
    }

    update() {
        if (this.loadEnd) {
            this.realpg = 100;
            if (this.currpg >= 95) {
                this.currpg = 100;
            }
        }

        this.realpg = this.loader.progress;
        this.currpg += (this.realpg - this.currpg) * this.easing;

        this.emit('onProgress', Math.floor(this.currpg));
    }
}
