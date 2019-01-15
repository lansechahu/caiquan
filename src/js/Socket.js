/*
socket.io交互部分
 */
import io from 'socket.io-client';
import EventEmitter from 'eventemitter3';

export default class Socket {
    constructor() {
        this.MAN_FILL = 'man_fill';
        this.PLAY_READY = 'play_ready';
        this.PLAY_OK = 'play_ok';
        this.DISCONNECT = 'disconnect';

        this.roomID = null;
        this.emitter = new EventEmitter();
    }

    //连接服务器
    connect(__fun) {
        let socketSrc = window.location.hostname;
        global.socketIO = io.connect(socketSrc + ':3030');

        //服务端回应连接成功，返回房间号
        global.socketIO.on("receive_conn", (__roomID) => {
            //如果没获取过房间号，则将返回的房间号赋过去
            console.log(this.roomID);
            if (this.roomID == null) this.roomID = __roomID;
            __fun();
        });

        this.events();
    }

    //所有的对服务器的监听
    events() {
        //房间人够了
        global.socketIO.on("man_fill", () => {
            console.log('房间人够了');
            this.emitter.emit(this.MAN_FILL);
        });

        //另一个玩家准备好了
        global.socketIO.on('play_ready', (__arr) => {
            console.log('另一个玩家准备好了');
            console.log(__arr);
            this.emitter.emit(this.PLAY_READY, __arr);
        });

        //另一个玩家出牌
        global.socketIO.on('play_ok', (__index) => {
            console.log(__index);
            this.emitter.emit(this.PLAY_OK, __index);
        });

        //另一个玩家退出了
        global.socketIO.on('player_disconnect', () => {
            this.emitter.emit(this.DISCONNECT);
        });
    }

    //创建并加入房间
    createRoom() {
        global.socketIO.emit('create_room', this.roomID);
    }

    //请求加入房间
    joinRoom() {
        global.socketIO.emit('join_room', this.roomID);
    }

    //已经选好牌准备开始游戏
    myReady(__arr) {
        global.socketIO.emit('myReady', __arr);
    }

    //游戏中已经选好牌了
    myOk(__index) {
        global.socketIO.emit('my_ok', __index);
    }

    //关闭链接
    close() {
        global.socketIO.close();
    }
}