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
var privateKey = fs.readFileSync('../../../../etc/ssl/private/mf.key');
var certificate = fs.readFileSync('../../../../etc/ssl/certs/mf.crt');
var cert_g = fs.readFileSync('../../../../etc/ssl/certs/gd_bundle-g2-g1.crt');

var securePort = normalizePort(process.env.PORT || '443');
var secureAdminPort = normalizePort(process.env.PORT || '8888');
appServer.set('port', securePort);
AdminApp.set('port', secureAdminPort);

var options = {key: privateKey, cert: certificate, ca : [cert_g]};
var adminOptions = {key: privateKey, cert: certificate, ca : [cert_g]};

var adminHttps = require('https').Server(adminOptions, AdminApp);
var https = require('https').Server(options, appServer);
let io = require('socket.io')(https);

adminHttps.listen(secureAdminPort);
https.listen(securePort);

const { addUser, getUser, addRoomCode, removeRoomCode, roomExistence, bannedUserCheck } = require('./users');
const { addRoom, getRoom, addMessages, removeMessages } = require('./rooms');
const { sendPushNotification } = require('./messages');
io.on('connect', (socket) => {
  socket.on('connection', ({ userID }, callback) => {
    console.log("socket ID", socket.id)
    if (userID != null) {
      addUser(socket.id, userID, socket);
      // var ROOMS_OF_USER = getUser(user.userID);
      // if (ROOMS_OF_USER.roomList.length > 0) {
      //   for (var i = 0; i < ROOMS_OF_USER.roomList.length; i++) {
      //     socket.join(ROOMS_OF_USER.roomList[i]);
      //   }
      // }
    }
  });

  socket.on('CreateRoom', async data => {
    // CreateRoom receives roomCode, sender_seq, receiver_seq, etc...;
    // Using receiver_seq (seq of the user who registered company information) gets target's socket;
    var socketB = getUser(data.receiver_seq);
    if (!socketB) return;

    // join the room;
    socket.join(data.roomCode);

    // Checks Whether the user is banned;
    var check = await bannedUserCheck(data);
    if (check) return;

    // socketB has the socket of the target (receiver);
    // force to participate the target to room;
    socketB.socket.join(data.roomCode);
    
    // inserts roomCode to users array in the users.js
    addRoomCode(data.sender_seq, data.receiver_seq, data.roomCode);

    // Also, inserts room information to rooms array in the rooms.js
    addRoom(data);
  });

  socket.on('sendMessage', async message => {

    // Using the roomCode, requests the room information;
    var returnRoom = getRoom([message.roomCode]);

    // inserts a new message to the messages in the messages.js;
    addMessages(message);

    // Checks Whether the user is banned;
    var check = await bannedUserCheck(message);
    if (check) {

      // Return a message to all participants in the room;
      socket.emit('receiveMessage', { roomInfo: returnRoom[0], messages: message });
    } else {
      // The sendPushNotification function sends a notification to the user who is not viewing the application;
      sendPushNotification(message)
      io.in(message.roomCode).emit('receiveMessage', { roomInfo: returnRoom[0], messages: message });
    }
  });

  socket.on('GetRoom', (data) => {
    // The getRoom function requests all the information of the room containing the message;
    var rawReturn = getRoom([data]);
    socket.emit('GetRoom', rawReturn);
  });

  socket.on('GetRoomList', (data) => {

    // The getUser function requests user's information using user_seq;
    // if there is no returns from the getUser function, the GetRoomList do nothing;
    var ROOMS_OF_USER = getUser(data);
    if (!ROOMS_OF_USER) return;
    
    // When the getUser function returns a roomList of rooms the user has joined;
    // Use the roomList variable to request detailed information about the room.
    var roomList = ROOMS_OF_USER.roomList;
    if (roomList) {
      var rawReturn = getRoom(roomList);
    }

    // And, the function returns the detail of rooms;
    socket.emit('GetRoomList', rawReturn);
  });

  socket.on('leave', (data) => {
    // The leave function receives roomCode & user_seq and deletes the roomCode in the users array;
    removeRoomCode(data);

    // If the existence of a room is false, it means that there are no more users participating in this room.;
    var a = roomExistence(data);
    if (!a) {
      // So, removes all messages
      removeMessages(data)
    }
    var messages = {
      roomCode: data.roomCode,
      sender_seq: 'admin',
      message: '다른 사용자가 방을 떠났습니다.'
    }
    // If the user left, official message is sent to the room;
    addMessages(messages);
    io.in(data.roomCode).emit('officialMessage', { messages });
    socket.leave(data.roomCode)
  });
});
