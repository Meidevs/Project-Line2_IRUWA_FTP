// Setup basic express server
let express = require('express');
let config = require("config")
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let port = 8000;
server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

let numUsers = 0;


io.on('connection', (socket) => {
    let addedUser = false;

    // when the client emits 'new message', this listens and executes
    socket.on(config.get('chat.events.NEWMSG'), (data, done) => {
        let room = socket.roomname;
        console.log('Room Name', room);
        if (!socket.roomname) {
            socket.emit(config.get('chat.events.NEWMSG'), false)
        }
        // we tell the client to execute 'new message'
        socket.to(room).emit('new message', data);
    });

    socket.on(config.get('chat.events.JOINROOM'), (data, done) => {
        console.log("Requesting to join a room: ", data)
        socket.roomname = data;
        socket.join(data, () => {
            console.log('Room Name : ', data)
            socket.to(data).emit('new message', 'joined the party!')
        })
    })

    // when the user disconnects.. perform this
    socket.on('disconnect', () => {
        if (addedUser) {
            --numUsers;

            // echo globally that this client has left
            socket.to(socket.roomname).emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });
});