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

module.exports = { newMessages };