import Sharejs from './Sharejs';
import * as PIXI from 'pixi.js';
import $ from 'jquery';
import Vconsole from 'vconsole';
import Loader from './Loader/Loader';
import QRCode from 'qrcode';

import * as ChcUtils from 'chcutils';

import LoadingMc from './Loader/LoadingMc';
import Scene1 from './Scene/Scene1';
import SelectCard from './Scene/SelectCard';
import SingleGame from './Scene/SingleGame';
import OLGame from './Scene/OLGame';
import GameEnd from './Scene/GameEnd';

import Socket from './Socket';

//双人游戏时，各种游戏状态
let isReplay = false; //是否重玩
let selecting = false; //正在选牌
let gaming = false; //正在游戏中
let ending = false; //正在结束界面

let app;
let stage;
let gameType = 0; //0是单人游戏，1是双人对战

let OLhref = ''; //双人游戏房间地址

//玩家
let playA = false;
let playB = false;

//玩家是否选好牌准备好了
let playA_ready = false;
let playB_ready = false;

//房间号
let roomID = null;

//自己的卡牌组
let myCardArr = null;
//敌人的卡牌组
let enemyCardArr = null;

//创建socket实例
//global.socket = new Socket();

let share = new Sharejs();
share.shareObj = {
    sharePath: location.href, //分享地址
    shareImg: "http://www.blueteapot.cn/tdh/h5Demo/images/myIcon.jpg", //分享图片
    shareTitle: 'h5 demo', //分享title
    shareDesc: "test" //分享描述
}
//share.init();

//==============================定义cookie========================
//如果是玩家B刷新了页面，则让它变成玩家A
let OsUtil = new ChcUtils.OsUtil();
setPlayer();

//================================判断是不是playA=====================
function setPlayer() {
    //如果是点重玩按钮过来的，则直接是playA
    if (isReplay) {
        playA = true;
        playB = false;
        isReplay = false;
        return;
    }
    roomID = OsUtil.getQueryString('id') || null;
    if (roomID == OsUtil.getCookie('roomID')) roomID = null;
    if (roomID == null) {
        console.log('playA');
        playA = true;
        playB = false;
    } else {
        console.log('playB');
        playA = false;
        playB = true;
        gameType = 1; //双人游戏
        OsUtil.setCookie('roomID', roomID, '1');
    }

    /*let roomID = OsUtil.getCookie('roomID');
    global.socket.roomID = OsUtil.getQueryString('id') || null;
    if (global.socket.roomID == roomID) global.socket.roomID = null;
    if (global.socket.roomID == null) {
        playA = true;
        playB = false;
    } else {
        playA = false;
        playB = true;
        gameType = 1; //双人游戏
        OsUtil.setCookie('roomID', global.socket.roomID, '1');
    }*/
}


//初始化pixi
initPixi();

var vconsole = new Vconsole();

//===============================初始化pixi======================================//
function initPixi() {
    const wid = window.innerWidth;
    const hei = window.innerHeight;

    app = new PIXI.Application(640, 640 / (wid / hei), {
        backgroundColor: 0x1099bb,
        preserveDrawingBuffer: true,
        antialias: true,
    });

    document.getElementById('pixiStage').appendChild(app.view);
    app.view.id = 'pixiCanvas';
    stage = new PIXI.Container();
    app.stage.addChild(stage);

    loading();
    start();
}

//=====================================loading部分==================================//
let loadingMc;

function loading() {
    //先加载加载界面
    let loading_asset = [
        {name: 'myIcon', url: './images/myIcon.jpg'}
    ];
    const loader = new Loader({manifest: loading_asset});
    loader.start();
    loader.on('onComplete', () => {
        loadingMc = new LoadingMc();
        stage.addChild(loadingMc);
        loadingMc.x = app.view.width / 2 - loadingMc.wid / 2;
        loadingMc.y = app.view.height / 2 - loadingMc.hei / 2;
        loadingMc.begin();

        loadMain(); //加载主资源
    });
}

let mainLoader;

function loadMain() {
    let loading_asset = [
        {name: 'myIcon', url: './images/myIcon.jpg'}
    ];

    mainLoader = new Loader({manifest: loading_asset, easing: 0.1});
    mainLoader.start();
    mainLoader.on('onProgress', (pro) => {
        //console.log(pro);
        loadingMc.text.text = pro + '%';
    });
    mainLoader.on('onComplete', () => {
        mainLoader = null;
        stage.removeChild(loadingMc);
        loadingMc = null;

        if (playA) {
            lunchIn();
        } else if (playB) {
            linePlayB();
        }
    });
}

//==============================lunch部分=======================
let lunch;

function lunchIn() {
    lunch = new Scene1(app);
    lunch.init();
    stage.addChild(lunch);
    lunch.x = app.view.width / 2 - lunch.wid / 2;
    lunch.y = app.view.height / 2 - lunch.hei / 2;
    lunch.begin();
    lunch.on(lunch.SCENE_IN, () => {
        console.log('lunch in');
    });

    lunch.on(lunch.SINGLE, () => {
        stage.removeChild(lunch);
        lunch = null;
        console.log('单人游戏');
        gameType = 0;
        selectIn();
    });

    lunch.on(lunch.DOUBLE, () => {
        stage.removeChild(lunch);
        lunch = null;
        console.log('双人游戏');
        console.log(window.location.origin, window.location.pathname);
        gameType = 1;
        qcodeIn(); //连接服务器并显示二维码
    });
}


//========================创建socket实例并事件监听==========================//
function socketListen() {
    //创建socket实例
    global.socket = new Socket();
    global.socket.roomID = roomID;

    //房间人够了
    global.socket.emitter.on(global.socket.MAN_FILL, () => {
        console.log(selecting);
        if (selecting) return;
        $('#qrcodeBox').hide();
        selectIn(); //进入选牌部分
    });

    //另一个玩家准备好了
    global.socket.emitter.on(global.socket.PLAY_READY, (__arr) => {
        if (gaming) return;
        enemyCardArr = __arr;
        console.log('另一个玩家准备好了：：：：：：：');
        console.log(enemyCardArr);
        if (playA) playB_ready = true;
        if (playB) playA_ready = true;
        doubleReady();
    });

    //另一个玩家退出了
    global.socket.emitter.on(global.socket.DISCONNECT, () => {
        console.log('另一个玩家失去连接了');
        if (!ending) {
            alert('另一个玩家失去连接了');
            replay();
        }
    });
}

//================================创建双人游戏=======================//
//连接服务器，创建房间并显示二维码
function qcodeIn() {
    //创建socket实例并监听socket事件
    socketListen();

    //连接服务器
    global.socket.connect(() => {
        //创建并加入房间
        global.socket.createRoom();
        OLhref = window.location.origin + window.location.pathname + '?id=' + global.socket.roomID;
        console.log(OLhref);

        QRCode.toDataURL(OLhref)
            .then(url => {
                console.log(url);
                $('#qrcode').attr('src', url);
                $('#qrcodeBox').show();
            })
            .catch(err => {
                console.error(err);
            });
    });
}

//============================玩家B连接服务器=========================//
function linePlayB() {
    socketListen();
    //连接服务器
    global.socket.connect(() => {
        global.socket.joinRoom(); //加入房间
    });
}

//=============================选牌部分==============================
let selectMc;

function selectIn() {
    selecting = true; //选牌阶段
    selectMc = new SelectCard(app);
    selectMc.init();
    stage.addChild(selectMc);
    selectMc.x = app.view.width / 2 - selectMc.wid / 2;
    selectMc.y = app.view.height / 2 - selectMc.hei / 2;
    selectMc.begin();

    selectMc.on(selectMc.BEGIN_GAME, (__arr) => {
        gameIn(__arr);
    });
}

//=================================游戏部分==============================//
let game;

function gameIn(__arr) {
    if (gameType == 0) {
        //单人游戏
        stage.removeChild(selectMc);
        selectMc = null;

        console.log('::::::::::::单人游戏');
        singleGameIn(__arr);
    } else {
        //双人游戏
        console.log('双人游戏');
        selectMc.wait();
        if (playA) playA_ready = true;
        if (playB) playB_ready = true;
        global.socket.myReady(__arr);
        myCardArr = __arr;
        doubleReady(); //判断是否都准备好
    }
}

//=====================判断双人是否都准备好==============================//
function doubleReady() {
    console.log(playA, playB);

    if (playA_ready && playB_ready) {
        stage.removeChild(selectMc);
        selectMc = null;

        console.log('都准备好了');
        console.log(myCardArr);
        console.log(enemyCardArr);
        doubleGameIn();
    }
}

//============单人游戏===============
function singleGameIn(__arr) {
    game = new SingleGame(app);
    game.init(__arr);
    stage.addChild(game);
    game.x = app.view.width / 2 - game.wid / 2;
    game.y = app.view.height / 2 - game.hei / 2;
    game.begin();
    game.on(game.GAME_OVER, (__type) => {
        gameEndIn(__type);
    });
}

//===================双人游戏==================
function doubleGameIn() {
    gaming = true; //游戏阶段
    game = new OLGame(app);
    game.init(myCardArr, enemyCardArr);
    stage.addChild(game);
    game.x = app.view.width / 2 - game.wid / 2;
    game.y = app.view.height / 2 - game.hei / 2;
    game.begin();
    game.on(game.GAME_OVER, (__type) => {
        ending = true;
        setTimeout(() => {
            gameEndIn(__type);
        }, 200);
    });
}


//===========================================游戏结束=============================//
let gameEnd;

function gameEndIn(__type) {
    gameEnd = new GameEnd(app);
    gameEnd.init(__type);
    stage.addChild(gameEnd);
    gameEnd.x = app.view.width / 2 - gameEnd.wid / 2;
    gameEnd.y = app.view.height / 2 - gameEnd.hei / 2;
    gameEnd.begin();
    gameEnd.on(gameEnd.REPLAY, () => {
        replay();
    });
}

//===============================重玩==========================
function replay() {
    window.location.href = window.location.origin + window.location.pathname;
    return;
    if (gameType == '1') {
        //断开链接
        global.socket.close();
    }

    if (selectMc) {
        selecting = false;
        stage.removeChild(selectMc);
        selectMc = null;
    }
    if (game) {
        selecting = false;
        gaming = false;
        stage.removeChild(game);
        game = null;
    }
    if (gameEnd) {
        selecting = false;
        gaming = false;
        ending = false;
        stage.removeChild(gameEnd);
        gameEnd = null;
    }

    if (global.socket) {
        global.socket = null;
    }

    playA_ready = false;
    playB_ready = false;

    isReplay = true;
    setPlayer();
    lunchIn();
}

function update() {
    if (mainLoader) mainLoader.update();
}

function start() {
    requestAnimationFrame(start);
    update();
}