const userModel = require("./public/javascripts/components/userModel");

const users = [];

const addUser = (socketID, userID, socket) => {
  var user;
  var index = users.findIndex((user) => user.userID === userID);
  if (index !== -1) {
    if (users[index].roomList.length > 0) {
      user = {
        socketID: socketID,
        userID: userID,
        socket: socket,
        roomList: [users[index].roomList]
      }
    } else {
      user = {
        socketID: socketID,
        userID: userID,
        socket: socket,
        roomList: []
      }
    }
    users[index] = user;
  } else {
    user = {
      socketID: socketID,
      userID: userID,
      socket: socket,
      roomList: []
    }
    users.push(user)
  }
  return user;
}

const addRoomCode = (sender_seq, receiver_seq, roomCode) => {
  var index_a = users.findIndex((user) => user.userID == sender_seq);
  var a = users[index_a].roomList.indexOf(roomCode);
  if (a == -1) {
    users[index_a].roomList.push(roomCode)
  }

  var index_b = users.findIndex((user) => user.userID == receiver_seq);
  var b = users[index_b].roomList.indexOf(roomCode);
  if (b == -1) {
    users[index_b].roomList.push(roomCode)
  }

  return users;
}

const removeRoomCode = (a) => {
  var index = users.findIndex((data) => data.userID == a.sender_seq);
  for (var i = 0; i < users[index].roomList.length; i++) {
    if (users[index].roomList[i] == a.roomCode) {
      users[index].roomList.splice(i, 1);
    }
  }
}

const getUser = (uid) => {
  var user = users.find((user) => user.userID === uid);

  return user;
};

const roomExistence = (data) => {
  var returnValue = false;
  users.map((user) => {
    if (user.roomList == data.roomCode) {
      returnValue = true;
    }
  })
  return returnValue;
}

const bannedUserCheck = async (data) => {
  try {
    var BANNED_USER = await userModel.CHECK_BANNED_USER(data);
    if (BANNED_USER.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = { addUser, addRoomCode, getUser, removeRoomCode, roomExistence, bannedUserCheck };