let express = require('express');
let config = require('config');
let app = express();
let socketIO = require('socket.io');
let http = require('http');

module.exports = class ChatServer {
    constructor(opts) {
        this.server = http.createServer(app);
        this.io = socketIO(this.server);
        this.opts = opts;
        this.userMaps = new Map();
    }

    start(cb) {
        this.server.listen(this.opts.port, () => {
            console.log("Up and running ...");
            this.io.on('connection', socket => {
                cb(socket);
            })
        })
    }

    onJoin(socket, cb) {
        this.io.on('join', (data) => {
            console.log("Requesting to join a room: ", data)
            socket.roomname = data.roomname
            this.io.join(data.roomname, _ => {
                cb({
                    roomname: data.roomname
                })
            })
        })
    }

    distributeMsg(socket, msg, done) {
        this.io.to(socket.roomname).emit('send', msg);
        done()
    }

}