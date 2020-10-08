const body = require('body-parser');
const express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var formidable = require('formidable'),
  http = require('http'),
  util = require('util');
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

//Request API, RESTful Endpoint for Admin System
AdminApp.use('/admin', adminRouter);

//Request API, RESTful Endpoint as App Server
appServer.use('/api', apiRouter);

// Parse the request body as JSON
AdminApp.use(body.json());
appServer.use(body.json());

var http = require('http').Server(appServer, (req, res) => {
  console.log(req.method)
  if (req.url == 'api/auth/register' && req.method.toLowerCase() == 'post') {

    // Instantiate a new formidable form for processing.

    var form = new formidable.IncomingForm();

    // form.parse analyzes the incoming stream data, picking apart the different fields and files for you.

    form.parse(req, function (err, fields, files) {
      if (err) {

        // Check for and handle any errors here.

        console.error(err.message);
        return;
      }
      res.writeHead(200, { 'content-type': 'text/plain' });
      res.write('received upload:\n\n');

      // This last line responds to the form submission with a list of the parsed data and files.

      res.end(util.inspect({ fields: fields, files: files }));
    });
    return;
  }

  // If this is a regular request, and not a form submission, then send the form.

  res.writeHead(200, { 'content-type': 'text/html' });
  res.end(
    '<form action="/upload" enctype="multipart/form-data" method="post">' +
    '<input type="text" name="title"><br>' +
    '<input type="file" name="upload" multiple="multiple"><br>' +
    '<input type="submit" value="Upload">' +
    '</form>'
  );
});
let io = require('socket.io')(http);

AdminApp.listen(80, () => {
  console.log('Admin Server Running! http://localhost:80/admin')
});
http.listen(8888, () => {
  console.log('App Server is Running! http://localhost:8888/api');
});

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
