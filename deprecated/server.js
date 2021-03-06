const body = require('body-parser');
const express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');

//Middle Ware List
var adminRouter = require('./routes/admin');
var apiRouter = require('./routes/api');

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

AdminApp.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  store: new FileStore(),
  cookie: {
    maxAge: 2592000000,
  }
}));

AdminApp.use(bodyParser.json());
AdminApp.set('views', path.join(__dirname, 'views'));
AdminApp.set('view engine', 'ejs');
AdminApp.use(logger('dev'));
AdminApp.use(express.json());
AdminApp.use(express.urlencoded({ extended: false }));
AdminApp.use(cookieParser());
AdminApp.use('/static', express.static(__dirname + '/public'));


appServer.use(bodyParser.json());
appServer.set('views', path.join(__dirname, 'views'));
appServer.set('view engine', 'ejs');
appServer.use(logger('dev'));
appServer.use(express.json());
appServer.use(express.urlencoded({ extended: false }));
appServer.use(cookieParser());
appServer.use(express.static(path.join(__dirname, 'public')));

//Request API, RESTful Endpoint for Admin System
AdminApp.use('/admin', adminRouter);

//Request API, RESTful Endpoint as App Server
appServer.use('/api', apiRouter);

// Parse the request body as JSON
AdminApp.use(body.json());
appServer.use(body.json());

const fs = require('fs');
const normalizePort = require('normalize-port');
// var privateKey = fs.readFileSync('../../../../etc/ssl/private/mf.key');
// var certificate = fs.readFileSync('../../../../etc/ssl/certs/mf.crt');
// var cert_g = fs.readFileSync('../../../../etc/ssl/certs/gd_bundle-g2-g1.crt');

// var securePort = normalizePort(process.env.PORT || '443');
// var secureAdminPort = normalizePort(process.env.PORT || '8888');
// appServer.set('port', securePort);
// AdminApp.set('port', secureAdminPort);

// var options = {key: privateKey, cert: certificate, ca : [cert_g]};
// var adminOptions = {key: privateKey, cert: certificate, ca : [cert_g]};

// var adminHttps = require('https').Server(adminOptions, AdminApp);
// var https = require('https').Server(options, appServer);
// let io = require('socket.io')(https);

// adminHttps.listen(secureAdminPort);
// https.listen(securePort);


var securePort = normalizePort(process.env.PORT || '3000');
var secureAdminPort = normalizePort(process.env.PORT || '8888');
appServer.set('port', securePort);
AdminApp.set('port', secureAdminPort);

var adminHttp = require('https').Server(AdminApp);
var http = require('http').Server(appServer);
let io = require('socket.io')(http);

adminHttp.listen(secureAdminPort);
http.listen(securePort);

const { addUser, getUser, addRoomCode, removeRoomCode, roomExistence, bannedUserCheck } = require('./users');
const { addRoom, getRoom, addMessages, removeMessages } = require('./rooms');
const { sendPushNotification } = require('./messages');
io.on('connect', (socket) => {
  socket.on('connection', ({ userID }, callback) => {
    if (userID != null) {
      var user = addUser(socket.id, userID, socket);
      var ROOMS_OF_USER = getUser(user.userID);
      if (ROOMS_OF_USER.roomList.length > 0) {
        for (var i = 0; i < ROOMS_OF_USER.roomList.length; i++) {
          socket.join(ROOMS_OF_USER.roomList[i]);
        }
      }
    }
  });

  socket.on('CreateRoom', async data => {
    var socketB = getUser(data.receiver_seq);
    if (!socketB) return;
    socket.join(data.roomCode);
    var check = await bannedUserCheck(data);
    if (check) return;
    socketB.socket.join(data.roomCode);
    addRoomCode(data.sender_seq, data.receiver_seq, data.roomCode);
    addRoom(data);
  });

  socket.on('sendMessage', async message => {
    var returnRoom = getRoom([message.roomCode]);
    addMessages(message);
    var check = await bannedUserCheck(message);
    if (check) {
      socket.emit('receiveMessage', { roomInfo: returnRoom[0], messages: message });
    } else {
      sendPushNotification(message)
      io.in(message.roomCode).emit('receiveMessage', { roomInfo: returnRoom[0], messages: message });
    }
  });

  socket.on('GetRoom', (data) => {
    var rawReturn = getRoom([data]);
    socket.emit('GetRoom', rawReturn);
  });

  socket.on('GetRoomList', (data) => {
    var ROOMS_OF_USER = getUser(data);
    if (!ROOMS_OF_USER) return;
    var roomList = ROOMS_OF_USER.roomList;
    if (roomList) {
      var rawReturn = getRoom(roomList);
    }
    socket.emit('GetRoomList', rawReturn);
  });

  socket.on('leave', (data) => {
    removeRoomCode(data);
    var a = roomExistence(data);
    if (!a) {
      removeMessages(data)
    }
    var messages = {
      roomCode: data.roomCode,
      sender_seq: 'admin',
      message: '다른 사용자가 방을 떠났습니다.'
    }
    addMessages(messages);
    io.in(data.roomCode).emit('officialMessage', { messages });
    socket.leave(data.roomCode)
  });
});
