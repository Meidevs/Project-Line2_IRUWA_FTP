const users = [];
const messages = [];

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

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
}

const getUser = (uid) => {
  var user = users.find((user) => user.userID === uid);

  return user;
};

const setMessages = (roomCode, receiver, sender, message, reg_date) => {
  const uid_exist = users.findIndex(user => user.userID == receiver);
  console.log('setMessages', uid_exist)
  if (uid_exist === -1) return { error: '사용자를 확인할 수 없습니다.' }

  messages.push({ roomCode: roomCode, receiver: receiver, sender: sender, message: message, reg_date: reg_date });
  console.log(messages)
  return messages ;
}

const getMessages = (roomCode) => {
  var message_exist = messages.filter((message) => message.roomCode === roomCode);
  console.log('getMessages', message_exist)
  return message_exist;
}
module.exports = { addUser, removeUser, getUser, setMessages, getMessages };