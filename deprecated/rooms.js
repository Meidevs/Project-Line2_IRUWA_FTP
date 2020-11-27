const rooms = [];

const addRoom = (data) => {
  var date_time = new Date().toISOString();
  var exist = rooms.filter((rooms) => rooms.roomCode == data.roomCode);
  if (exist.length > 0) return false;

  rooms.push({
    roomCode: data.roomCode,
    sender_seq: data.sender_seq,
    sender_name: data.sender_name,
    receiver_seq: data.receiver_seq,
    receiver_name: data.receiver_name,
    items_seq: data.items_seq,
    item_name: data.item_name,
    item_uri: data.item_uri,
    cmp_seq: data.cmp_seq,
    cmp_name: data.cmp_name,
    reg_date: date_time,
    messages: [],
  });
}

const getRoom = (roomList) => {
  var rawArray = new Array();
  roomList.map((data) => {
    for (var i = 0; i < rooms.length; i++) {
      if (data == rooms[i].roomCode) {
        rawArray.push(rooms[i]);
      }
    }
  })
  console.log('get Room rawArray' , rawArray)
  return rawArray;
}

const addMessages = (data) => {
  var exist = rooms.findIndex((rooms) => rooms.roomCode == data.roomCode);
  rooms[exist].messages.push(data);
}

const removeMessages = (data) => {
  var exist = rooms.findIndex((rooms) => rooms.roomCode == data.roomCode);
  // rooms[exist].messages = [];
  console.log(rooms)
}

module.exports = { addRoom, getRoom, addMessages, removeMessages };