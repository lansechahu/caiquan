//音效部分
export default class Soundjs {
    constructor(id, autoPlay, loop, onPlay, onPause, onEnded) {
        this.music = document.getElementById(id);
        this.music.loop = loop;
        this.isOpen = false;
        if (onPlay) this.onPlay = onPlay;
        if (onPause) this.onPause = onPause;
        if (onEnded) this.onEnded = onEnded;

        if (onPlay != undefined) this.music.addEventListener("play", this.onPlay);
        if (onPause != undefined) this.music.addEventListener("pause", this.onPause);

        if (autoPlay) {
            this.music.addEventListener("ended", endHandler.bind(this));
            this.music.restart = this.restartSound.bind(this);

            this.playSound();
            document.addEventListener("WeixinJSBridgeReady", this.playSound.bind(this), false);
            document.addEventListener('YixinJSBridgeReady', this.playSound.bind(this), false);
            //document.addEventListener("touchstart", startSound, false);
        } else {
            this.music.onloadedmetadata = this.pauseSound.bind(this);
        }
    }

    playSound() {
        this.isOpen = true;
        this.music.play();
    }

    pauseSound() {
        this.isOpen = false;
        this.music.pause();
    }

    restartSound() {
        this.music.currentTime = 0;
        this.playSound();
    }

    //静音
    mute() {
        this.music.muted = true;
    }

    //恢复
    unmute(){
        this.music.muted = false;
    }
}

function endHandler() {
    if (this.onEnded != undefined) this.onEnded();
    if (loop) {
        this.playSound();
    }
}