const body = require('body-parser');
const express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var static = require('serve-static');

//Middle Ware List
var ftpRouter = require('./routes/ftp');
var authRouter = require('./routes/auth');
var adminRouter = require('./routes/admin');
var apiRouter = require('./routes/api');

const appFTP_1 = express();
const appFTP_2 = express();
const AdminApp = express();
const appServer = express();

// Session Storage
const session = require('express-session');
const FileStore = require('session-file-store')(session);

appServer.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  store: new FileStore(),
  cookie: {
    maxAge: 2592000000,
  }
}));

// view engine setup
appFTP_1.use(bodyParser.json());
appFTP_1.set('views', path.join(__dirname, 'views'));
appFTP_1.set('view engine', 'ejs');
appFTP_1.use(logger('dev'));
appFTP_1.use(express.json());
appFTP_1.use(express.urlencoded({ extended: false }));
appFTP_1.use(cookieParser());
appFTP_1.use(express.static(path.join(__dirname, 'public')));

appFTP_2.use(bodyParser.json());
appFTP_2.set('views', path.join(__dirname, 'views'));
appFTP_2.set('view engine', 'ejs');
appFTP_2.use(logger('dev'));
appFTP_2.use(express.json());
appFTP_2.use(express.urlencoded({ extended: false }));
appFTP_2.use(cookieParser());
appFTP_2.use(express.static(path.join(__dirname, 'public')));

AdminApp.use(bodyParser.json());
AdminApp.set('views', path.join(__dirname, 'views'));
AdminApp.set('view engine', 'ejs');
AdminApp.use(logger('dev'));
AdminApp.use(express.json());
AdminApp.use(express.urlencoded({ extended: false }));
AdminApp.use(cookieParser());
AdminApp.use(express.static(path.join(__dirname, 'public')));

appServer.use(bodyParser.json());
appServer.set('views', path.join(__dirname, 'views'));
appServer.set('view engine', 'ejs');
appServer.use(logger('dev'));
appServer.use(express.json());
appServer.use(express.urlencoded({ extended: false }));
appServer.use(cookieParser());
appServer.use(express.static(path.join(__dirname, 'public')));

// Request API, RESTful Endpoint
appFTP_1.use('/ftp', ftpRouter);
appFTP_2.use('/ftp', ftpRouter);

// Request API, RESTful Endpoint For User Authentication.
appFTP_1.use('/auth', authRouter);
appFTP_2.use('/auth', authRouter);

//Request API, RESTful Endpoint for Admin System
AdminApp.use('/admin', adminRouter);

//Request API, RESTful Endpoint as App Server
appServer.use('/api', apiRouter);

// Parse the request body as JSON
appFTP_1.use(body.json());
appFTP_2.use(body.json());
AdminApp.use(body.json());
appServer.use(body.json());

appFTP_1.listen(3000);
appFTP_2.listen(3001);

var http = require('http').Server(appServer);
let io = require('socket.io')(http);

AdminApp.listen(80, () => {
  console.log('Admin Server Running! http://localhost:80/admin')
});
http.listen(8888, () => {
  console.log('App Server is Running! http://localhost:8888/api');
});

const { addUser, removeUser, getUser, setMessages, getMessages } = require('./users');
const { GET_CMP_INFO_ON_USER } = require('./public/javascripts/components/userModel');
var rooms = [];
var infos = [];
io.on('connect', (socket) => {
  socket.on('connection', ({ userID }, callback) => {
    if (userID != null) {
      addUser(socket.id, userID, socket);
    }
  });

  socket.on('join', (data, callback) => {
    var user = getUser(data.sender_seq);
    var index = rooms.findIndex(item => item.user == user.userID);
    if (index == -1) {
      rooms.push({ roomCode: data.roomCode, user: user.userID, status: 1 })
    } else {
      rooms[index] = { roomCode: data.roomCode, user: user.userID, status: 1 };
    }
    socket.join(data.roomCode);
  });

  socket.on('goMessage', (data, callback) => {
    var y = infos.findIndex(data => data.roomCode == data.roomCode);
    if (y === -1)
      infos.push(data);

    var x = rooms.findIndex((user) => user.user == data.receiver_seq);
    if (x == -1 || rooms[x].status == 0) {
      setMessages(data.roomCode, data.receiver_seq, data.sender_seq, data.message, data.reg_date);
    }
    io.in(data.roomCode).emit('message', { sender_seq: data.sender_seq, message: data.message, reg_date: data.reg_date });
  });

  socket.on('getHistory', (userID, callback) => {
    const history = getMessages(userID);
    var info = infos.filter(data => data.receiver_seq == userID);

    socket.emit('returnHistory', { history: history, info: info });
  })

  // socket.on('disconnect', () => {
  //   const user = removeUser(socket.id);

  //   if (user) {
  //     io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
  //     io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
  //   }
  // })
});


// io.on('connect', (socket) => {
//   socket.on('connection', (data) => {
//     console.log('User Connected!');
//     console.log(data)
//     var uid = {
//       socketID: socket.id,
//       userID: data.userID,
//       socket: socket
//     }
//     var uid_exist = users.filter((item) => item.userID === uid.userID);
//     if (uid_exist.length > 0) {
//       index = users.findIndex(item => item.userID === uid.userID);
//       users[index] = uid;
//     } else {
//       users.push(uid);
//     }
//   });

//   socket.on('messageLogs', (data) => {
//     var returnList = unReadList.filter(item => item.receiver_seq == data);
//     unReadList = unReadList.filter(item => item.sender_seq = user_seq);
//     socket.emit('getMessageLogs', returnList);
//   });

//   socket.on('inviteRoom', (message) => {
//     console.log('inviteRoom', message);
//     console.log('users', users);
//     var index = users.findIndex(item => item.userID == message.receiver_seq);
//     if (index !== -1) {
//       var socketB = users[index].socket;
//       socket.join(message.roomCode);
//       socketB.join(message.roomCode);
//     }
//     roomList.push({ sender_seq: message.sender_seq, receiver_seq: message.receiver_seq,items_seq : message.items_seq, roomCode: message.roomCode })
//   });

//   socket.on('getRoom', data => {
//     var returnList = roomList.filter(item => item.receiver_seq == data);
//     socket.emit('getRoom', returnList)
//   });

//   socket.on('inRoom', data => {
//     socket.join(data.roomCode);
//     socket.in(data.roomCode).emit('receiveMessage', '방에 입장하셨습니다.');
//   })

//   socket.on('outRoom', data => {
//     socket.leave(data.roomCode);
//   })

//   socket.on('sendMessage', (message) => {
//     console.log('sendMessage', message);

//     unReadList.push({
//       roomCode : message.roomCode,
//       sender_seq : message.sender_seq,
//       receiver_seq : message.receiver_seq,
//       message : message.message,
//       reg_date : message.reg_date,
//     })
//     io.in(message.roomCode).emit('receiveMessage', message);
//   });

//   socket.on('disconnect', (err, data) => {
//     console.log(socket.connected)
//     console.log('User Leave')
//   })
// });