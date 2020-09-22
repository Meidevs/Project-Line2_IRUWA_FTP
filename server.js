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

const { addUser, getUser, addRoomCode } = require('./users');
const { addRoom, getRoom } = require('./rooms');
const { newMessages, getMessages } = require('./messages');
io.on('connect', (socket) => {
  console.log('Socket ID : ', socket.id)
  socket.on('connection', ({ userID }, callback) => {
    if (userID != null) {
      addUser(socket.id, userID, socket);
    }
  });

  socket.on('CreateRoom', data => {
    var socketB  = getUser(data.receiver_seq);
    socket.join(data.roomCode);
    socketB.socket.join(data.roomCode);
    console.log(socketB.socket.id)
    addRoomCode(data.sender_seq, data.receiver_seq, data.roomCode);
    addRoom(data);
  })

  socket.on('sendMessage', message => {
    var returnRoom = getRoom([message.roomCode]);
    // If No Message Ever Befroe then Set Chat Count Update
    var receiveMessage = newMessages(message);
    io.in(message.roomCode).emit('receiveMessage', {roomInfo : returnRoom[0], messages : receiveMessage});
  })

  socket.on('GetRoomList', (data) => {
    var rawReturn = new Array();
    var ROOMS_OF_USER = getUser(data);
    console.log(ROOMS_OF_USER.socket.id)
    var roomList = ROOMS_OF_USER.roomList;
    console.log('roomList', roomList)
    if (roomList) {
      var Instance = getRoom(roomList);
      var rawReturn = getMessages(Instance);
    }
    socket.emit('GetRoomList', rawReturn)
  })

  socket.on('disconnect', (err, data) => {
    console.log(socket.connected)
    console.log('User Leave')
  })
});
