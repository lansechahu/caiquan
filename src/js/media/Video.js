/*
视频部分
 */
import $ from 'jquery';
import EventEmitter from 'eventemitter3';

export default class Video {
    constructor() {
        this.emiter = new EventEmitter();
        this.VIDEO_PLAY = 'video_play';
        this.VIDEO_END = 'video_end';

        this.video = document.getElementById('video');
        this.video.addEventListener('play', videoPlayHandler.bind(this));
        this.video.addEventListener('ended', videoEnd.bind(this));
        this.video.addEventListener('pause', videoPause.bind(this));
    }

    playVideo() {
        $('.videoBox').show();
        this.video.play();
    }
}

function videoPlayHandler() {
    console.log('视频开始播放了');
    this.emiter.emit(this.VIDEO_PLAY);
}

function videoEnd() {
    console.log('视频播完了');
    this.emiter.emit(this.VIDEO_END);
    $('.videoBox').hide();
}

function videoPause() {
    console.log('视频暂停');
}

