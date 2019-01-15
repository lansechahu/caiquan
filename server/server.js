var http = require("http"),
    io = require("socket.io");
var app = http.createServer(),
    io = io.listen(app);
app.listen(3030.);

io.sockets.on("connection", function (socket) {
    var myurl = socket.request.headers.referer;
    var dateNum = (new Date()).valueOf(); //生成时间戳，作为房间号
    var roomID = null;

    console.log('连上了：' + dateNum);

    //返回连接成功
    socket.emit('receive_conn', dateNum);

    //创建一个房间，并加入此房间
    socket.on('create_room', function (__roomID) {
        console.log('玩家创建并加入房间' + __roomID);
        socket.join(__roomID);
        roomID = __roomID;
    });

    //加入指定房间
    socket.on('join_room', function (__roomID) {
        console.log('玩家加入房间' + __roomID);
        socket.join(__roomID);
        roomID = __roomID;

        if (io.sockets.adapter.rooms[roomID].length == 2) {
            //如果房间人数达到2人，可以成团了，给房间里的人发送消息
            io.sockets.in(roomID).emit('man_fill'); //向同房间的所有客户端发送消息
        }

        /*console.log(io.sockets.adapter.rooms); //获取所有房间的信息
        console.log(io.sockets.adapter.rooms[roomID]); //获取指定房间的socket实例
        console.log('length:::::' + io.sockets.adapter.rooms[roomID].length); //获取指定房间的socket实例的个数*/
    });

    //选牌完毕，准备开始游戏
    socket.on('myReady', function (__arr) {
        //告诉另一个玩家自己准备好了
        socket.broadcast.to(roomID).emit('play_ready', __arr);
    });

    //出好牌了
    socket.on('my_ok', function (__index) {
        console.log(__index);
        socket.broadcast.to(roomID).emit('play_ok', __index);
    });

    //有人断开链接
    socket.on('disconnect', function () {
        console.log('有人断开链接了');
        socket.broadcast.to(roomID).emit('player_disconnect'); //告诉房间里另一个人自己下线了
    });
});