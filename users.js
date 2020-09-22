const users = [];

const addUser = (socketID, userID, socket) => {
  var index = users.findIndex((user) => user.userID === userID);
  if (index !== -1) {
    users[index] = { socketID: socketID, userID: userID, socket: socket };
  } else {
    users.push({ socketID: socketID, userID: userID, socket: socket });
  }
  var user = {
    socketID: socketID,
    userID: userID,
    socket: socket
  }
  return user;
}

const addRoomCode = (sender_seq, receiver_seq, roomCode) => {
  var index_a = users.findIndex((user) => user.userID == sender_seq);
  users[index_a].roomList = [roomCode];

  var index_b = users.findIndex((user) => user.userID == receiver_seq);
  users[index_b].roomList = [roomCode];
}

const getUser = (uid) => {
  var user = users.find((user) => user.userID === uid);

  return user;
};
module.exports = { addUser, addRoomCode, getUser };