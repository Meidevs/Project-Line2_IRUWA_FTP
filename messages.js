const messages = [];

const newMessages = (data) => {
  messages.push(data)
  var message = {
    sender_seq : data.sender_seq,
    roomCode : data.roomCode,
    message : data.message,
    reg_date : data.reg_date,
  }
  return message;
}

const getMessages = (roomList) => {
  messages.map((data) => {
    for (var i = 0; i < roomList.length; i++) {
      if (data.roomCode == roomList[i].roomCode) {
        roomList[i].messages.push(data); 
      }
    }
  })
  return roomList;
}

module.exports = { newMessages, getMessages };